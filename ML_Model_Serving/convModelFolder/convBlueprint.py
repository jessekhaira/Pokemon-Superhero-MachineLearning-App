from flask import Blueprint
from flask import jsonify
from keras.models import load_model
import os 
from PIL import Image
import base64
import io
import numpy as np
import matplotlib.pyplot as plt 
from flask import request

convBlueprint = Blueprint('Convolutional Blueprint', __name__)
model = load_model(os.path.join(os.path.abspath(''), 'convModelFolder/model/trained_models/model.50-0.21.h5'))
class_indices = {
    0:'batman', 
    1:'hulk', 
    2:'spiderman', 
    3:'superman'
}


@convBlueprint.route('/', methods = ['POST'])
def convModel_APIHandler(): 
    try:
        base64_image_string = request.form['image_data_buffer']
        base64_decoded = base64.b64decode(base64_image_string)
        image = Image.open(io.BytesIO(base64_decoded))
        image_np = np.array(image)
        resp = jsonify({'MostLikelyClass': 'Batman', 'allProbs': {'Batman':0.52, 'Spiderman': 0.21, 'Black Panther': 0.21, 'Wolverine': 0.06}})
        resp.status_code = 200
        return resp
    except:
        resp = jsonify({'message': 'There was an error processing your image by the server. Try a different image?'})
        resp.status_code = 500 
        return resp 


