import selenium
import os
import time
import random
import sys 
from imageScrapingUtils import * 
import argparse
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
from selenium.webdriver.chrome.options import Options 

def image_scraper(queries, numImagesDesired, driver_path, extension_path):
    """
    This function scrapes full-sized images when given an input list containing the terms for 
    which images should be scraped. 

    Args:
        queries (list of str): List containing the terms for which images should be scraped 

        numImagesDesired (int): Integer representing the number of images to scrape for every
            query in the queries

        driver_path (str): String representing the path to the chrome driver to be used 
            with Selenium.

        view_extension_crx_path (str): String representing the path to the view extension .crx file

    Returns:
        None. A new folder is made for each query string, and the images associated with the query
            are saved inside of that folder. 

    """     
    base_url = 'https://www.google.com/search?tbm=isch&q='
    options = webdriver.ChromeOptions()
    options.add_extension(extension_path) 
    wd = webdriver.Chrome(executable_path=driver_path, options= options)
    for query in queries:
        # go to the webpage containing all images
        wd.get(base_url + query)
        # initalize the directory that will hold all the images
        try:
            os.mkdir(os.path.abspath('') + "/"+query) 
        except:
            pass 
        divContainingImages = wd.find_element_by_id('islrg')
        extract_images(divContainingImages, query, wd, numImagesDesired)



def extract_images(divContainingImages, query, wd, numImagesDesired):
    # function for scrolling to bottom in case there aren't enough images loaded on the page 
    def scroll_to_bottom():
        wd.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

    count = 0
    # scroll down the page until there are enough images loaded on the page and we can begin scraping!
    while len(divContainingImages.find_elements_by_class_name('isv-r.PNCib.MSM1fd')) < numImagesDesired:
        print(len(divContainingImages.find_elements_by_class_name('isv-r.PNCib.MSM1fd')))
        scroll_to_bottom() 

    boxesContainingImages = divContainingImages.find_elements_by_class_name('isv-r.PNCib.MSM1fd')
    print(len(boxesContainingImages)) 

    # loop through the boxes until our count is greater than numImagesDesired and we're done 
    for box in boxesContainingImages:
        count += 1
        if count > numImagesDesired:
            return 
        box.click() 
        # give the http a certain amount of seconds to load in for the extension, if it doesn't load in 
        # this time, then we assume its a base64 encoded image and continue 

        # need a lot of error handling code here because there is a lot of uncertainity with the objects 
        # we're dealing with - IE we don't know how long the extension will take to get the real URL of the
        # image, we don't know the form of the data we return, whether its valid at all (not http/not base64) 
        time.sleep(14)
        actualImage = ""
        # if try succeeds, means we successfuly extracted a url 
        try:
            WebDriverWait(wd, 11).until(anchor_tag_has_http('ZsbmCf.vi_ext_addon'))
            actualImage = get_actual_image(wd)
        # otherwise, its a base64 encoded image 
        except:
            actualImage = get_actual_image(wd)
        finally:
            print(count)
            box.click()
            if "http" in actualImage:
                write_url_to_img(actualImage, count, query)
            else:
                try:
                    write_base64_to_img(actualImage,count, query)
                except:
                    continue 


if __name__ == "__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument(
        "queries",  
        nargs="*",  
        type=str,
        default=[],  # default if nothing is provided
    )

    parser.add_argument(
        "numImagesDesired",
        type=int,  
    )

    parser.add_argument(
        "driver_path",
        type = str
    )

    parser.add_argument(
        "extension_path",
        type = str 
    )

    # parse the command line
    args = parser.parse_args()
    image_scraper(args.queries, args.numImagesDesired, args.driver_path, args.extension_path)