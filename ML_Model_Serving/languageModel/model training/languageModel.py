import keras 
from keras.layers import Input 
from keras.layers import Dense 
from keras.layers import GRU
from keras import Model
from languageModelUtils import * 
import argparse

class languageModel:
    def __init__(self, vocab_dim, hidden_dim, learning_rate):
        self.tokenized_data = data_preprocess_pipeline()
        self._char_to_index, self.index_to_char = create_poke_maps("".join(tokenized_data))
        self.model = self.create_char_gru_model(vocab_dim, hidden_dim, learning_rate)

    def create_char_gru_model(self, vocab_dim, hidden_dim, learning_rate):
        char_input = Input(shape = (None, vocab_dim), batch_size = 1)
        GRU_cell = GRU(hidden_dim, return_sequences=True)(char_input)
        predicted_char = keras.layers.TimeDistributed(Dense(vocab_dim))(GRU_cell)
        model = Model(inputs = char_input, outputs = predicted_char)


        optimizer = keras.optimizers.Adam(
            learning_rate = learning_rate
        )
        loss = keras.losses.SparseCategoricalCrossentropy(
            from_logits=True
        )
        model.compile(
            loss=loss, 
            optimizer = optimizer,
            metrics = loss
        )
        return model 

    def make_name(self, min_seq_len = 3, max_seq_len = 15):
        # start model off with a vector of zeros at timestep 0
        x = np.zeros((1, 1, len(self.index_to_char)))
        # we stop generating names when the max sequence length is hit
        # but in order to get a variety of different outputs we sample an int between
        # the low bound and high bound
        curr_seq_len = np.random.randint(min_seq_len, max_seq_len)
        generated_name = [] 
        for i in range(curr_seq_len):
            raw_logits = self.model.predict(x)[0]
            # get generated char at this timestep 
            predicted_index = tf.random.categorical(raw_logits, num_samples=1).numpy()[0][0]
            gen_char = self.index_to_char[predicted_index]
            # append char to name we're making, and create a new vector to be input at the
            # next timestep
            generated_name.append(gen_char)
            x[0,:,:] = char_to_one_hot_vector(gen_char, char_to_index)
        return "".join(generated_name)

    def train_callback_generate_names(self, epoch, logs):
        # check progress every 27 epochs
        pass 

    def fit(self, epochs):
        self.model.fit(MyBatchGenerator(self.tokenized_data, self._char_to_index), epochs = epochs)

