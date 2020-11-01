import keras 
from keras.layers import Input 
from keras.layers import Dense 
from keras.layers import GRU
from keras import Model

def create_char_gru_model(batch_size, vocab_dim, hidden_dim):
    char_input = Input(shape = (vocab_dim,1), batch_size=batch_size)
    GRU_cell = GRU(hidden_dim)(char_input)
    softmax_layer = Dense(vocab_dim, activation = 'softmax')(GRU_cell)
    model = Model(inputs = char_input, outputs = softmax_layer)
    return model 