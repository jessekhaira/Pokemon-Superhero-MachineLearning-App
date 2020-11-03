import keras 
from keras.layers import Input 
from keras.layers import Dense 
from keras.layers import GRU
from keras import Model
from languageModelUtils import * 
import agrparse

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

