import os
import json
import argparse
import numpy as np
import tensorflow
from tensorflow.keras import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import SparseCategoricalCrossentropy
from tensorflow.keras.layers import Input, Dense, GRU, TimeDistributed
from tensorflow.keras.callbacks import Callback, ModelCheckpoint
from ML_Model_Serving.languageModelFolder.model.languageModelUtils import BatchGenerator, char_to_one_hot_vector


def create_char_gru_model(vocab_dim, hidden_dim, learning_rate):
    """
    This function creates a simple Keras language model with the input
    specifications
    """
    char_input = Input(shape=(None, vocab_dim), batch_size=1)
    GRU_cell = GRU(hidden_dim, return_sequences=True)(char_input)
    predicted_char = TimeDistributed(Dense(vocab_dim))(GRU_cell)
    model = Model(inputs=char_input, outputs=predicted_char)

    optimizer = Adam(learning_rate=learning_rate)
    loss = SparseCategoricalCrossentropy(from_logits=True)
    model.compile(loss=loss, optimizer=optimizer, metrics=loss)
    return model


def make_name(model,
              index_to_char,
              char_to_index,
              temperature=1,
              min_seq_len=3,
              max_seq_len=15):
    # start model off with a vector of zeros at timestep 0
    x = np.zeros((1, 1, len(index_to_char)))
    # we stop generating names when the max sequence length is hit
    # but in order to get a variety of different outputs we sample an int between
    # the low bound and high bound
    curr_seq_len = np.random.randint(min_seq_len, max_seq_len)
    generated_name = []
    for i in range(curr_seq_len):
        raw_logits = (model.predict(x)[0]) / temperature
        # get generated char at this timestep
        predicted_index = tensorflow.random.categorical(
            raw_logits, num_samples=1).numpy()[0][0]
        gen_char = index_to_char[str(predicted_index)]
        # append char to name we're making, and create a new vector to be input at the
        # next timestep
        generated_name.append(gen_char)
        x[0, :, :] = char_to_one_hot_vector(gen_char, char_to_index)
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
        if epoch % 5 == 0:
            print('\n')
            for i in range(5):
                generated_name = make_name(self.model, self.index_to_char,
                                           self.char_to_index)
                print(generated_name)
            print('\n')


def main(vocab_dim, hidden_dim, learning_rate, epochs=10):
    with open(
            os.path.abspath('') +
            '/jsonified_items/jsonified_preprocessed_data.json', 'r') as f:
        tokenized_data = json.load(f)

    with open(
            os.path.abspath('') +
            '/jsonified_items/jsonified_char_to_index.json', 'r') as f:
        char_to_index = json.load(f)

    with open(
            os.path.abspath('') +
            '/jsonified_items/jsonified_index_to_char.json', 'r') as f:
        index_to_char = json.load(f)

    model = create_char_gru_model(vocab_dim, hidden_dim, learning_rate)
    genNamesDuringTraining = train_callback_generate_names(
        model, index_to_char, char_to_index)
    modelCheckpointTraining = ModelCheckpoint(
        filepath=os.path.abspath('') +
        "/trained_models/model_saved_at_epoch.{epoch:02d}.hdf5",
        period=25)

    model.fit(BatchGenerator(tokenized_data, char_to_index),
              epochs=epochs,
              callbacks=[genNamesDuringTraining, modelCheckpointTraining])


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--vocab_dim",
        type=int,
        default=[],
    )

    parser.add_argument(
        "--hidden_dim",
        type=int,
    )

    parser.add_argument("--learning_rate", type=float)

    parser.add_argument('--epochs', type=int)

    args = parser.parse_args()

    main(args.vocab_dim, args.hidden_dim, args.learning_rate, args.epochs)
