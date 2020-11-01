import keras 
from keras.layers import Input 
from keras.layers import Dense 
from keras.layers import GRU
from keras import Model
from languageModelUtils import * 
import agrparse

def create_char_gru_model(batch_size, vocab_dim, hidden_dim, learning_rate):
    char_input = Input(shape = (vocab_dim,1), batch_size=batch_size)
    GRU_cell = GRU(hidden_dim)(char_input)
    softmax_layer = Dense(vocab_dim, activation = 'softmax')(GRU_cell)
    model = Model(inputs = char_input, outputs = softmax_layer)
    loss = keras.losses.CategoricalCrossentropy()
    optimizer = keras.optimizers.Adam(
        learning_rate = learning_rate
    )
    model.compile(
        loss = loss,
        optimizer = optimizer
    )
    return model 

