import base64
import io
import os 
import numpy as np
from flask import Blueprint, jsonify, request 
from keras.models import load_model
from PIL import Image
from keras.applications.resnet_v2 import preprocess_input
from keras.preprocessing.image import img_to_array
from keras.activations import softmax 

convBlueprint = Blueprint('Convolutional Blueprint', __name__)
model = load_model(os.path.join(os.path.abspath(''), 'convModelFolder/model/trained_models/model.50-0.21.h5'))
class_indices = {
    0:'Batman', 
    1:'Hulk', 
    2:'Spiderman', 
    3:'Superman'
}


@convBlueprint.route('/', methods = ['POST'])
def convModel_APIHandler(): 
    try:
        base64_image_string = request.form['image_data_buffer']
        base64_decoded = base64.b64decode(base64_image_string)
        image = Image.open(io.BytesIO(base64_decoded))
        preprocessed_img = prepare_image(image)
        raw_logits_tensor = model(preprocessed_img)
        prob_distribution = softmax(raw_logits_tensor)
        topPrediction = class_indices[prob_distribution.numpy().argmax()]
        allProbs = get_all_probs(prob_distribution)
        resp = jsonify({'MostLikelyClass': topPrediction, 'allProbs': {'Batman':0.52, 'Spiderman': 0.21, 'Black Panther': 0.21, 'Wolverine': 0.06}})
        resp.status_code = 200
        return resp
    except:
        resp = jsonify({'message': 'There was an error processing your image by the server. Try a different image?'})
        resp.status_code = 500 
        return resp 

def prepare_image(image):
    image = image.resize((224,224))
    image_tensor = img_to_array(image)
    preprocessed_img = preprocess_input(image_tensor)
    preprocessed_img = np.expand_dims(preprocessed_img, axis =0)
    print(preprocessed_img)
    print(preprocessed_img.shape)
    return preprocessed_img

def get_all_probs(prob_distribution):
    all_probs = {}
    