from flask import Blueprint
from flask import jsonify
from flask import request
import os 
import json 
from keras.models import load_model
from ML_Model_Serving.languageModelFolder.model.languageModel import make_name

languageModelBlueprint = Blueprint('Language Model Blueprint',__name__)

with open(os.path.abspath('') + '/languageModelFolder/model/jsonified_items/jsonified_char_to_index.json', 'r') as f:
    char_to_index = json.load(f) 

with open(os.path.abspath('') +'/languageModelFolder/model/jsonified_items/jsonified_index_to_char.json', 'r') as f:
    index_to_char = json.load(f)

model = load_model(os.path.abspath('') + '/languageModelFolder/model/trained_models/model_saved_at_epoch.250.hdf5', compile = False)

@languageModelBlueprint.route('/', methods = ['POST'])
def languageModel_rootAPIHandler(): 
    dataRecieved = request.get_json()
    temperature = round(float(dataRecieved["temperature"]),2)
    predictedName = make_name(model, index_to_char, char_to_index, temperature = temperature, max_seq_len = 10)
    print(predictedName)
    return jsonify({'predictedName': predictedName})

