import os 
import numpy as np 
import math
import argparse
from shutil import copyfile

def make_train_valid_test_directories(path_to_data_folder, class_names_folders, 
    valid_percent = 0.18, test_percent = 0.18):
    """
    Creates a /train, /valid, /test directory with the specified number of valid imgs,  
    test imgs and train imgs in the arguments. 
    
    Works only when you have a central folder that holds all your class folders (ex: 
    /data/class1/c1img.jpg, /data/class2/c2img.jpg, etc). 

    Prepares data for Keras ImageDataGenerator. Copies images instead of moving them.
    """

    assert valid_percent + test_percent < 0.67, "Please use less than 67 percent of your data for testing and validating" 
    # create the directories for the train/test/valid
    directories_create = ['train', 'valid', 'test'] 
    for data_split_name in directories_create:
        data_split_path = path_to_data_folder + '/' + data_split_name
        try:
            os.makedirs(data_split_path)
        except:
            pass
        for class_name in class_names_folders:
            try:
                os.makedirs(data_split_path + '/' + class_name)
            except:
                pass 

    
    train_test_valid_split(class_names_folders, path_to_data_folder, valid_percent, test_percent)
    
def train_test_valid_split(class_names_folders, path_to_data_folder, valid_percent, test_percent):
    for name in class_names_folders:
        listImagesDir = os.listdir(path_to_data_folder + '/'+name)
        num_test_imgs = math.ceil(len(listImagesDir) * valid_percent)
        num_valid_imgs = math.ceil(len(listImagesDir) * test_percent)
        test_img_indices = set(np.random.randint(0, len(listImagesDir), num_test_imgs))
        valid_img_indices = get_valid_img_indices(test_img_indices, num_valid_imgs, len(listImagesDir))

        for img_index in range(len(listImagesDir)):
            curr_img = listImagesDir[img_index]
            orig_path_img = path_to_data_folder + '/' + name + '/' + curr_img
            if img_index in test_img_indices:
                copyfile(orig_path_img, '%s/test/%s/%s'%(path_to_data_folder, name, curr_img))
            elif img_index in valid_img_indices:
                copyfile(orig_path_img, '%s/valid/%s/%s'%(path_to_data_folder, name, curr_img))
            else:
                copyfile(orig_path_img, '%s/train/%s/%s'%(path_to_data_folder, name, curr_img))

def get_valid_img_indices(test_img_indices, num_valid_imgs, totalImgs):
    valid_img_indices = set()
    while len(valid_img_indices) < num_valid_imgs:
        randomIdx = np.random.randint(0, totalImgs)
        if randomIdx not in test_img_indices:
            valid_img_indices.add(randomIdx)
    return valid_img_indices


if __name__ == "__main__":
    argparseObj = argparse.ArgumentParser() 
    argparseObj.add_argument(
        '--class_names_folders',
        nargs = "+",
        type = str 
    )

    argparseObj.add_argument(
        '--path_to_data_folder',
        type = str,
        default = os.path.abspath('') + '/data'
    )

    argparseObj.add_argument(
        '--valid_percent',
        type = int,
        default = 0.18
    )

    argparseObj.add_argument(
        '--test_percent',
        type = int,
        default= 0.18
    )

    args = argparseObj.parse_args()
    make_train_valid_test_directories(args.path_to_data_folder, args.class_names_folders, args.valid_percent, args.test_percent)