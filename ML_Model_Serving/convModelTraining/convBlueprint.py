from flask import Blueprint
from flask import jsonify

convBlueprint = Blueprint('Convolutional Blueprint',__name__)
@convBlueprint.route('/', methods = ['GET'])
def convModel_APIHandler(): 
    return jsonify({'MostLikelyClass': 'Currently Not Implemented', 'Top5ProbSorted': 'Currently Not Implemented'})

