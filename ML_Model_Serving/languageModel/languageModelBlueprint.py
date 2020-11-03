from flask import Blueprint
from flask import jsonify
from flask import request
from keras.models import load_model
from model.languageModel import get_tokenized_data_get_maps, make_name
languageModelBlueprint = Blueprint('Language Model Blueprint',__name__)

_, char_to_index, index_to_char = get_tokenized_data_get_maps() 

@languageModelBlueprint.route('/', methods = ['POST'])
def languageModel_rootAPIHandler(): 
    dataRecieved = request.get_json()
    temperature = round(float(dataRecieved["temperature"]),2)
    model = load_model()
    predictedName = make_name(model, index_to_char, char_to_index, temperature = temperature, max_seq_len = 10)
    return jsonify({'predictedName': predictedName})


