from keras.utils import Sequence
import numpy as np
import tensorflow as tf 
import re
import os 
import json 

def data_preprocess_pipeline():
    """
    Preprocessing pipeline that takes the raw text file, lowercases it, removes any extra spaces,
    and then tokenizes it into a list.
    """ 
    with open('pokemonNames.txt', 'r') as f:
        data = f.read()
    # remove spaces 
    tokenized = data.lower().split('\n')
    # remove empty spaces
    tokenized = list(filter(lambda x: x, tokenized))
    # for sentence in tokenized data
    for i,sentence in enumerate(tokenized):
        tokenized[i] = re.sub(r'\s+', '', sentence)
    return tokenized

def create_poke_maps(text):
    """
    Creates a mapping between characters and indices, and indices and characters
    """ 
    unique_chars = set(text) 
    char_to_index = {c:i for i,c in enumerate(unique_chars)}
    index_to_char = {i:c for i,c in enumerate(unique_chars)}
    return char_to_index, index_to_char

def char_to_one_hot_vector(char, char_to_index):
    vector = np.zeros((1, len(char_to_index)), dtype = "float32")
    vector[:,char_to_index[char]] = 1 
    return vector


def word_to_onehot_vectors(word, char_to_index):
    # timestep x dim_vocab matrix 
    matrix = np.empty((len(word), len(char_to_index)))
    # one hot encode every single char vector 
    for i,char in enumerate(word):
        matrix[i] = char_to_one_hot_vector(char, char_to_index) 
    return matrix 


def create_trainx_trainy(preprocessed_list, char_to_index):
    x = []
    y = []
    for name in preprocessed_list:
        # training language model - the labels at every time step t
        # is the char at time step t+1 
        x.append(word_to_onehot_vectors(name[:-1], char_to_index))
        y.append(label_to_int(name[1:], char_to_index))
    x = np.array(x) 
    return x,y


def label_to_int(word, char_to_index):
    labels = []
    for char in word:
        labels.append(char_to_index[char])
    return np.array(labels)


class BatchGenerator(Sequence):
    def __init__(self, tokenized_data, char_to_index, shuffle = True):
        self.x, self.y = create_trainx_trainy(tokenized_data, char_to_index)
        # training using SGD
        # otherwise would use padding and masking and process in parallel 
        self.batch_size = 1
        self.shuffle = shuffle
        self.on_epoch_end()
    
    def __len__(self):
        return int(np.floor(len(self.y)/self.batch_size))
    
    def __getitem__(self, index):
        return self.__data_generation(index)
    
    def on_epoch_end(self):
        self.indices = np.arange(len(self.y))
        if self.shuffle:
            np.random.shuffle(self.indices) 

    def __data_generation(self, index):
        sentence = self.x[index].reshape(1, *self.x[index].shape)
        labels = self.y[index].reshape(1, self.y[index].shape[0], 1)
        return sentence, labels 

def get_tokenized_data_get_maps():
    """
    Function preprocesses the scraped data and then prepares a char to index mapping,
    and index to char mapping and returns the data and the maps. 
    """ 
    tokenized_data = data_preprocess_pipeline() 
    char_to_index, index_to_char = create_poke_maps("".join(tokenized_data))
    return tokenized_data, char_to_index, index_to_char


if __name__ == "__main__":
    # load data and hashmaps once, and save them to disk, then won't have to keep repeating calls
    # to these functions 
    tokenized_data, char_to_index, index_to_char = get_tokenized_data_get_maps() 

    jsonified_preprocessed_data = json.dumps(tokenized_data)
    jsonified_char_to_index = json.dumps(char_to_index)
    jsonified_index_to_char = json.dumps(index_to_char)
    try:
        os.mkdir(os.path.abspath('') + "/jsonified_items")
    except:
        pass 
    with open('jsonified_items/jsonified_preprocessed_data.json', 'w') as f:
        f.write(jsonified_preprocessed_data)

    with open('jsonified_items/jsonified_char_to_index.json', 'w') as f:
        f.write(jsonified_char_to_index)

    with open('jsonified_items/jsonified_index_to_char.json', 'w') as f:
        f.write(jsonified_index_to_char)
    
