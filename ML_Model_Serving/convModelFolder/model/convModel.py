import keras
import os 
from keras.preprocessing.image import ImageDataGenerator
import argparse

def configure_data_generators(batch_size):
    train_datagen = ImageDataGenerator(
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip = True,
        preprocessing_function = keras.applications.resnet_v2.preprocess_input
    )
    
    train_generator = train_datagen.flow_from_directory(
        os.path.abspath('') + '/data/train',
        target_size=(224,224),
        batch_size = batch_size,
        class_mode='categorical'
    )

    test_datagen = ImageDataGenerator(
        preprocessing_function = keras.applications.resnet_v2.preprocess_input
    )

    test_generator = test_datagen.flow_from_directory(
        os.path.abspath('') + '/data/test',
        target_size = (224,224),
        batch_size=batch_size,
        class_mode='categorical'
    )

    val_generator = test_datagen.flow_from_directory(
        os.path.abspath('') + '/data/valid',
        target_size = (224,224),
        batch_size=batch_size,
        class_mode='categorical'
    )

    return train_generator, val_generator, test_generator


def ResNet50V2_transfer_learned_model(learn_rate, dropout_fraction):
    # not including the top softmax layer - re-training softmax classifier on top of the
    # existing net and treating the net as a fixed feature extractor 
    base_model = keras.applications.ResNet50V2(
        include_top = False, 
        weights = 'imagenet',
        input_shape = (224,224,3)
    )
    
    base_model.trainable = False

    inputs = keras.Input(shape = (224, 224, 3))
    base_res_net = base_model(inputs, training = False)
    # need 2d output to feed to softmax classifer IE [batch_size, features]
    max_pooled_2D = keras.layers.GlobalMaxPooling2D()(base_res_net)
    dropped_out = keras.layers.Dropout(dropout_fraction)(max_pooled_2D)
    logits = keras.layers.Dense(4)(dropped_out)
    model = keras.Model(inputs, logits)

    loss_fn = keras.losses.CategoricalCrossentropy(
        from_logits = True
    )

    optim = keras.optimizers.Adam(
        learning_rate = learn_rate,
    )

    model.compile(
        loss = loss_fn,
        optimizer = optim,
        metrics = [keras.metrics.CategoricalAccuracy()]

    )

    return model


def main(batch_size, epochs, learn_rate, dropout_fraction):
    train_generator, val_generator, test_generator = configure_data_generators(batch_size)

    model = ResNet50V2_transfer_learned_model(learn_rate, dropout_fraction)
    
    my_callbacks = [
        keras.callbacks.EarlyStopping(patience=5),
        keras.callbacks.ModelCheckpoint(filepath='model.{epoch:02d}-{val_loss:.2f}.h5', period = 15),
        keras.callbacks.TensorBoard(log_dir='./logs'),
        keras.callbacks.ReduceLROnPlateau(
            patience=6,
            verbose=1,
            min_delta=0.0001,
            cooldown=0
        )
    ]
    
    model.fit(train_generator, epochs=epochs, steps_per_epoch = len(train_generator), 
        validation_data = val_generator, validation_steps= len(val_generator), callbacks = my_callbacks)

if __name__ == "__main__":
    argparse_obj = argparse.ArgumentParser()

    argparse_obj.add_argument(
        "--batch_size",
        default = 32,
        type = int
    )

    argparse_obj.add_argument(
        "--epochs",
        default = 60,
        type = int 
    )

    argparse_obj.add_argument(
        "--learn_rate",
        default = 0.001,
        type = float 
    )

    argparse_obj.add_argument(
        "--dropout_fraction",
        default = 0.3,
        type = float 
    )

    main(argparse_obj.batch_size, argparse_obj.epochs, argparse_obj.learn_rate, argparse_obj.dropout_fraction)