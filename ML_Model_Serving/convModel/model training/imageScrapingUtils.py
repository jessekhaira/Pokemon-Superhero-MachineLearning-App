def write_base64_to_img(encodedString, imgNum, query):
    img_src = encodedString.split(',')
    img_format = "jpg" if ("jpeg" in img_src[0]) else "png"
    write_to_img(img_src[1], imgNum, img_format, query, False)

def write_to_img(imageBytesData, imgNum, imgFormat, query, url = True):
    imagePath = get_image_path(imgNum, imgFormat, query)
    if url:
        with open(imagePath, "wb") as f:
            f.write(imageBytesData)
    else:
        with open(imagePath, "wb") as f:
            f.write(base64.b64decode(imageBytesData))

def get_image_path(imgNum, imgFormat, query):
    folderLoc = "/" + query
    imageName = "/" + query + str(imgNum)
    fileExt = "."+imgFormat
    return os.path.abspath('') + folderLoc + imageName + fileExt 

def get_image_data_url(url):
    image = requests.get(url)
    return image.content 

def get_actual_image(wd):
    view_image_box = lambda: wd.find_element_by_class_name("ZsbmCf.vi_ext_addon") 
    try:
        actualImage = view_image_box().get_attribute('href')
        return actualImage
    except:
        actualImage = view_image_box().get_attribute('href')
        return actualImage
    finally:
        print(actualImage[:5])

def write_url_to_img(actualImage, imgNum, query):
    image_data = get_image_data_url(actualImage)
    img_format = "jpg" if ("jpg" in actualImage) else "png"
    write_to_img(image_data, imgNum, img_format, query) 