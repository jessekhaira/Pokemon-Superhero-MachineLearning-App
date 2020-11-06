from keras.preprocessing.image import ImageDataGenerator
import os 
def configure_data_generators(batch_size):
    train_datagen = ImageDataGenerator(
            rescale=1./255,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True
    )
    
    train_generator = train_datagen.flow_from_directory(
        os.path.abspath('') + '/data/train',
        target_size=(150,150),
        batch_size = 32,
        class_mode='categorical'
    )

    test_datagen = ImageDataGenerator(rescale=1./255)
    test_generator = test_datagen.flow_from_directory(
        os.path.abspath('') + '/data/test',
        target_size = (150,150),
        batch_size=batch_size,
        class_mode='categorical'
    )

    val_generator = test_datagen.flow_from_directory(
        os.path.abspath('') + '/data/valid',
        target_size = (150,150),
        batch_size=batch_size,
        class_mode='categorical'
    )

    return train_generator, val_generator, test_generator