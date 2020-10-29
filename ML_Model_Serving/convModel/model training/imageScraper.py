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
    
    # dict of str: list[str]
    urls_queries = getUrls(queries)
    # save urls as images
    saveUrlsAsImages(urls_queries, img_width, img_height)



def get_urls(queries):
    pass

def save_urls_as_images(urls_queries, img_width, img_height):
    pass 





def writeURL_to_img(imageBytesData, imgNum, imgFormat, query):
    imagePath = get_image_path(imgNum, imgFormat, query)
    with open(imagePath, "wb") as f:
        f.write(imageBytesData)

def get_image_path(imgNum, imgFormat, query):
    folderLoc = "/" + query
    imageName = "/" + query + str(imgNum)
    fileExt = "."+imgFormat
    return os.path.abspath('') + folderLoc + imageName + fileExt 