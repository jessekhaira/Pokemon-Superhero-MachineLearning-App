import keras 
from keras.layers import Input 
from keras.layers import Dense 
from keras.layers import GRU
from keras.callbacks import Callback
from keras.callbacks import ModelCheckpoint
from keras import Model
from languageModelUtils import * 
import os 
import argparse


def create_char_gru_model(vocab_dim, hidden_dim, learning_rate):
    """
    This function creates a simple Keras language model with the input
    specifications
    """ 
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

def make_name(model, index_to_char, char_to_index, temperature=1, min_seq_len = 3, max_seq_len = 15):
    # start model off with a vector of zeros at timestep 0
    x = np.zeros((1, 1, len(index_to_char)))
    # we stop generating names when the max sequence length is hit
    # but in order to get a variety of different outputs we sample an int between
    # the low bound and high bound
    curr_seq_len = np.random.randint(min_seq_len, max_seq_len)
    generated_name = [] 
    for i in range(curr_seq_len):
        raw_logits = (model.predict(x)[0])/temperature
        # get generated char at this timestep 
        predicted_index = tf.random.categorical(raw_logits, num_samples=1).numpy()[0][0]
        gen_char = index_to_char[predicted_index]
        # append char to name we're making, and create a new vector to be input at the
        # next timestep
        generated_name.append(gen_char)
        x[0,:,:] = char_to_one_hot_vector(gen_char, char_to_index)
    return "".join(generated_name)


class train_callback_generate_names(Callback):
    """
    Callback that generates names after a certain number of epochs when training the language model
    so that the models performance can be assessed.
    """ 
    def __init__(self, model, index_to_char, char_to_index):
        self.model = model
        self.index_to_char = index_to_char
        self.char_to_index = char_to_index
    
    def on_epoch_end(self, epoch, logs):
        if epoch % 27 == 0:
            print('\n')
            for i in range(5):
                generated_name = make_name(self.model, self.index_to_char, self.char_to_index)
                print(generated_name)
            print('\n')

def get_tokenized_data_get_maps():
    """
    Function preprocesses the scraped data and then prepares a char to index mapping,
    and index to char mapping and returns thed data and those maps. Done in multiple 
    different places so a function was made for this.
    """ 
    tokenized_data = data_preprocess_pipeline() 
    char_to_index, index_to_char = create_poke_maps("".join(tokenized_data))
    return tokenized_data, char_to_index, index_to_char


def main(vocab_dim, hidden_dim, learning_rate, epochs=10):
    tokenized_data, char_to_index, index_to_char = get_tokenized_data_get_maps() 
    model = create_char_gru_model(vocab_dim, hidden_dim, learning_rate)

    genNamesDuringTraining = train_callback_generate_names(model, index_to_char, char_to_index)
    modelCheckpointTraining = ModelCheckpoint(
        filepath = os.path.abspath('') + "/trained_models/model_saved_at_epoch.{epoch:02d}.hdf5",
        period = 1
    )

    model.fit(BatchGenerator(tokenized_data, char_to_index), 
            epochs = epochs, callbacks = [genNamesDuringTraining, modelCheckpointTraining])


if __name__ == "__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument(
        "--vocab_dim",  
        type=int,
        default=[], 
    )

    parser.add_argument(
        "--hidden_dim",
        type=int,  
    )

    parser.add_argument(
        "--learning_rate",
        type = float
    )

    parser.add_argument(
        '--epochs',
        type = int
    )

    args = parser.parse_args()

    main(args.vocab_dim, args.hidden_dim, args.learning_rate, args.epochs)


    # python3 languageModel.py --vocab_dim 34 --hidden_dim 320 --learning_rate 0.001 --epochs 250