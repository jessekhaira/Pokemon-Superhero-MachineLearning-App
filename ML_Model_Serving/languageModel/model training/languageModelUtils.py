import re 
import numpy as np 

def data_preprocess_pipeline(text):
    with open('pokemonNames.txt', 'r') as f:
        data = f.read()
    # remove spaces 
    tokenized = text.lower().split('\n')
    # remove empty spaces
    tokenized = list(filter(lambda x: x, tokenized))
    # for sentence in tokenized data
    for i,sentence in enumerate(tokenized):
        tokenized[i] = re.sub(r'\s+', '', sentence)
    return tokenized

def create_poke_maps(text):
    unique_chars = set(text) 
    char_to_index = {c:i for i,c in enumerate(unique_chars)}
    index_to_char = {i:c for i,c in enumerate(unique_chars)}
    return char_to_index, index_to_char


def char_to_one_hot_vector(char, char_to_index):
    vector = np.zeros((len(char_to_index),1))
    vector[char_to_index[char]] = 1 
    return vector

def word_to_OHvectors(word, char_to_index):
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
        x.append(word_to_OHvectors(name[:-1], char_to_index))
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
        self.x, self.y = create_x_y(tokenized_data, char_to_index)
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