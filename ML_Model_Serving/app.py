from flask import Flask, jsonify, request
from convModelTraining.convBlueprint import convBlueprint

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def rootResponse():
    return jsonify({'msg': 
    'Try sending a HTTP POST request to the /convModel endpoint with a RGB image attachment, or a GET request to /languageModel endpoint'})

app.register_blueprint(convBlueprint, url_prefix = '/convModel')

@app.route('/languageModel', methods = ['GET'])
def languageModel_APIHAndler():
    return jsonify({'predictedName': 'Currently Not Implemented'})

if __name__ == "__main__":
    app.run(host='localhost', port=3002)
