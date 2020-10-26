from flask import Blueprint
from flask import jsonify

convBlueprint = Blueprint('Convolutional Blueprint',__name__)
@convBlueprint.route('/', methods = ['POST'])
def convModel_APIHandler(): 
    return jsonify({'MostLikelyClass': 'Batman', 'allProbs': {'Batman':0.52, 'Spiderman': 0.21, 'Black Panther': 0.21, 'Wolverine': 0.06}})

