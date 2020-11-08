from flask import Blueprint
from flask import jsonify
from keras.models import load_model
import os 
with open(os.path.join(os.path.abspath(''), 'convModelFolder/model/trained_models/model.50-0.21.h5')) as f:
    model = load_model(f)


convBlueprint = Blueprint('Convolutional Blueprint',__name__)
@convBlueprint.route('/', methods = ['POST'])
def convModel_APIHandler(): 
    return jsonify({'MostLikelyClass': 'Batman', 'allProbs': {'Batman':0.52, 'Spiderman': 0.21, 'Black Panther': 0.21, 'Wolverine': 0.06}})

