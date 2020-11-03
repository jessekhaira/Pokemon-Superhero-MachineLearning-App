from keras.utils import Sequence
import numpy as np
import tensorflow as tf 
import re

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


def create_char_gru_model(vocab_dim, hidden_dim, learning_rate):
    char_input = Input(shape = (None, vocab_dim), batch_size = 1)
    GRU_cell = GRU(hidden_dim, return_sequences=True)(char_input)
    
    predicted_char = keras.layers.TimeDistributed(Dense(vocab_dim, activation = 'softmax'))(GRU_cell)
    model = Model(inputs = char_input, outputs = predicted_char)
    optimizer = keras.optimizers.Adam(
        learning_rate = learning_rate
    )
    model.compile(
        loss='sparse_categorical_crossentropy', 
        optimizer = optimizer,
        metrics = ['sparse_categorical_crossentropy']
    )
    return model 


def make_name(model, index_to_char, char_to_index, min_seq_len = 3, max_seq_len = 15):
    # start model off with a vector of zeros at timestep 0
    x = np.zeros((1, 1, len(index_to_char)))
    # we stop generating names when the max sequence length is hit
    # but in order to get a variety of different outputs we sample an int between
    # the low bound and high bound
    curr_seq_len = np.random.randint(min_seq_len, max_seq_len)
    generated_name = [] 
    for i in range(curr_seq_len):
        raw_logits = model.predict(x)[0]
        # get generated char at this timestep 
        predicted_index = tf.random.categorical(raw_logits, num_samples=1).numpy()[0][0]
        gen_char = index_to_char[predicted_index]
        # append char to name we're making, and create a new vector to be input at the
        # next timestep
        generated_name.append(gen_char)
        x[0,:,:] = char_to_one_hot_vector(gen_char, char_to_index)
    return "".join(generated_name)

