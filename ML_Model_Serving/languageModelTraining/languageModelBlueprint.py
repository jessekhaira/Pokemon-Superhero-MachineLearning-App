from flask import Blueprint
from flask import jsonify

languageModelBlueprint = Blueprint('Language Model Blueprint',__name__)

@languageModelBlueprint.route('/', methods = ['GET'])
def languageModel_rootAPIHandler(): 
    return jsonify({'predictedName': 'Currently Not Implemented'})


