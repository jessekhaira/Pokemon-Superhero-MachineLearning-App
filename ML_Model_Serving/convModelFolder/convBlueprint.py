from flask import Blueprint
from flask import jsonify
from keras.models import load_model
import os 

convBlueprint = Blueprint('Convolutional Blueprint', __name__)
model = load_model(os.path.join(os.path.abspath(''), 'convModelFolder/model/trained_models/model.50-0.21.h5'))
class_indices = {
    'batman': 0, 
    'hulk': 1, 
    'spiderman': 2, 
    'superman': 3
}
@convBlueprint.route('/', methods = ['POST'])
def convModel_APIHandler(): 

    return jsonify({'MostLikelyClass': 'Batman', 'allProbs': {'Batman':0.52, 'Spiderman': 0.21, 'Black Panther': 0.21, 'Wolverine': 0.06}})

