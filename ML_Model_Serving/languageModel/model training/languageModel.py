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

