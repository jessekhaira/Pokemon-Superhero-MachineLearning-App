from flask import Blueprint
from flask import jsonify
from flask import request

languageModelBlueprint = Blueprint('Language Model Blueprint',__name__)

@languageModelBlueprint.route('/', methods = ['POST'])
def languageModel_rootAPIHandler(): 
    dataRecieved = request.get_json()
    temperature = round(float(dataRecieved["temperature"]),2)
    return jsonify({'predictedName': 'Currently Not Implemented'})


