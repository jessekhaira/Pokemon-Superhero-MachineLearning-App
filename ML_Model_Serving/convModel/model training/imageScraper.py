import selenium
import os 
from PIL import Image 
def image_scraper(queries, img_width = None, img_height = None):
    """
    This function scrapes full-sized images when given an input
    hashtable where the keys are a string representing a query
    and the values are the number of images of that query to be
    scraped.

    Args:
        queries (dict of str:int): HashMap containing mapping between queries and the number
            of images of each query that should be scraped

        img_width(int, optional): Optional, integer representing width to save every image
            that is scraped

        img_height(int, optional): Optional, integer representing height to save every image
            that is scraped

    Returns:
        None. A new folder is made for each query string, and the images 
            associated with the query are saved inside of that folder. 

    """ 
    pass 




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
        if count > 25:
            return 
        box.click() 
        time.sleep(random.randint(3,7))
        # give the http a certain amount of seconds to load in for the extension, if it doesn't load in 
        # this time, then we assume its a base64 encoded image and continue 
        
        # need a lot of error handling code here because there is a lot of uncertainity with the objects 
        # we're dealing with - IE we don't know how long the extension will take to get the real URL of the
        # image, we don't know the form of the data we return, whether its valid at all (not http/not base64) 

        actualImage = ""
        # if try succeeds, means we successfuly extracted a url 
        try:
            WebDriverWait(wd, 12).until(anchor_tag_has_http('ZsbmCf.vi_ext_addon'))
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