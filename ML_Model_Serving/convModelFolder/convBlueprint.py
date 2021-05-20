import base64
import io
import os
import numpy as np
from flask import Blueprint, jsonify, request
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.activations import softmax

convBlueprint = Blueprint('Convolutional Blueprint', __name__)
model = load_model(
    os.path.join(os.path.abspath(''),
                 'convModelFolder/model/trained_models/model.50-0.21.h5'))
class_indices = {0: 'Batman', 1: 'Hulk', 2: 'Spiderman', 3: 'Superman'}


@convBlueprint.route('/', methods=['POST'])
def convModel_APIHandler():
    """
    This function represents a Flask API endpoint that serves a Keras image classifier.
    If the input data is valid, this function will return the models top prediction for the
    image, along with all of the probabilities for the classes. 
    """
    try:
        # image is expected to be recieved in a base64 encoded string which will be decoded
        # and converted to a tensor and then preprocessed
        base64_image_string = request.form['image_data_buffer']
        base64_decoded = base64.b64decode(base64_image_string)
        image = Image.open(io.BytesIO(base64_decoded))
        preprocessed_img = prepare_image(image)
        raw_logits_tensor = model(preprocessed_img)
        prob_distribution = softmax(raw_logits_tensor)
        topPrediction = class_indices[prob_distribution.numpy().argmax()]
        allProbsDict = get_all_probs(prob_distribution)
        resp = jsonify(MostLikelyClass=topPrediction, allProbs=allProbsDict)
        resp.status_code = 200
        return resp
    except:
        resp = jsonify({
            'message':
            'There was an error processing your image by the server. Try a different image?'
        })
        resp.status_code = 500
        return resp


def prepare_image(image):
    if image.mode != 'RGB':
        image = image.convert("RGB")
    image = image.resize((224, 224))
    image_tensor = img_to_array(image)
    preprocessed_img = preprocess_input(image_tensor)
    preprocessed_img = np.expand_dims(preprocessed_img, axis=0)
    return preprocessed_img


def get_all_probs(prob_distribution):
    all_probs = {}
    for i, val in enumerate(prob_distribution.numpy()[0]):
        all_probs[class_indices[i]] = round(float(val), 2)
    return all_probs
