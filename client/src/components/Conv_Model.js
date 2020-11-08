import React from 'react';


/**
 * This class represents the react component responsible for where images are uploaded and sent 
 * to the backend to the convolutional model, and results recieved and displayed to the user.
 * 
 * @class @public 
 */
class Conv_Model extends React.Component {
    constructor(props) {
        super(props); 

        this._isImgUploaded = this._isImgUploaded.bind(this); 
        this._requestPrediction = this._requestPrediction.bind(this); 
        this._startNewPrediction = this._startNewPrediction.bind(this); 
        this._seeInferenceResults = this._seeInferenceResults.bind(this);
        this._goBack = this._goBack.bind(this); 
    }

    _isImgUploaded(e) {
        e.preventDefault(); 
        const imgUploaded = e.target.files[0];
        const imageDisplayDiv = document.getElementById('imageDisplayDiv');
        const img = document.getElementById('imgLoaded');
        const reader = new FileReader();
        const props = this.props; 
        reader.onloadend = function() {
            img.src = reader.result; 
            props._showDisplays('block', imageDisplayDiv,document.getElementById('submitConv'));
            props._hideDisplays(document.getElementById('labelPokeImg')); 
        }
        reader.readAsDataURL(imgUploaded);
    }

    async _requestPrediction() {
        const convModel = document.getElementById('ConvModel');
        const convForm = document.getElementById('conv_form'); 
        try {
            const bodyInfo = document.getElementById('pokeImg'); 
            let formInfo = new FormData();
            formInfo.append('image', bodyInfo.files[0]);
            // data has been submitted, so hide all the form info and start showing the convResults instead
            this.props._hideDisplays(convForm, document.getElementsByClassName('ML_Model_Instructions')[0]); 
            // start up the async loader
            convModel.appendChild(this.props._addSpinnerAsync());
            let predictionData = await fetch('/convModel', {
                method: 'POST',
                body: formInfo 
            });
            let jsonPredictionData = await predictionData.json(); 
            // if there was an error with the server processing data,
            // either data of incorrect shape was passed in or error on our end
            // want to display appropriate message to user 
            if ('message' in jsonPredictionData) {
                throw Error(jsonPredictionData.message)
            }
            document.getElementById('topPrediction').innerHTML = "The AI predicted your image was most likely " +jsonPredictionData.MostLikelyClass;
            document.getElementById('allProbs').innerHTML = "Here's how likely the AI thought the image was each of the 4 superheros"+jsonPredictionData.allProbs;
            this.props._showDisplays('flex',document.getElementById('convResults')); 
        }
        catch (err) {
            console.log(err); 
        }
        finally {
            convModel.removeChild(convModel.lastChild); 
        }
    }

    _startNewPrediction(e) {
        this.props._hideDisplays(
            document.getElementById('convResults'), 
            document.getElementById('imageDisplayDiv'),
            document.getElementById('submitConv'));
        this.props._showDisplays('block', document.getElementById('labelPokeImg'));
        this.props._showDisplays('flex', document.getElementsByClassName('ML_Model_Instructions')[0]); 
        document.getElementById('pokeImg').value = ''; 
        const conv_form = document.getElementById('conv_form'); 
        this.props._showDisplays('flex', conv_form);
        conv_form.style.alignItems = 'center';
        conv_form.style.justifyContent = 'center';
        conv_form.style.flexDirection = 'column'; 
    }

    _seeInferenceResults(e) {
        const typeResultsToShow = (e.target.id.includes("Probs") ? "allProbs":"topPrediction");
        for (let i=0; i<3; i++) {
            this.props._hideDisplays(document.getElementById('convResults').children[i]);
        }
        document.getElementById('convResults').style.flexDirection = 'column';  
        this.props._showDisplays('flex',
            document.getElementById(typeResultsToShow),
            document.getElementById('goBackButton'));
    }

    _goBack() {
        const resultToHide = document.getElementById('topPrediction').style.display === 'flex' ? 'topPrediction': 'allProbs';
        for (let i=0; i<3; i++) {
            this.props._showDisplays('flex', document.getElementById('convResults').children[i]);
        }
        document.getElementById('convResults').style.flexDirection = 'row';  
        this.props._hideDisplays(
            document.getElementById(resultToHide),
            document.getElementById('goBackButton'));
    }
    
    render() {
        return(
            <div className = "Model_Div">
                <div id = "ConvModel">
                    <form id = "conv_form">
                        <label for="pokeImg" 
                        id = "labelPokeImg" 
                        className="button"
                        >

                            Submit a .png or .jpg pokemon image like those 
                            above! 

                        </label>
                        <input type="file"
                            id="pokeImg" name="pokeImg"
                            accept="image/png, image/jpeg"
                            onChange = {this._isImgUploaded}
                        >
                        </input>

                        <div id = "imageDisplayDiv">
                            <p>
                            This is the image you uploaded. Press submit if you would like to send the
                            image to the algorithm.
                            </p>
                            <img id = "imgLoaded" alt = "Your uploaded image"></img>
                        </div>
                        <div id = "submitConv" onClick = {this._requestPrediction} className = "button">Submit</div>
                    </form>
                </div>
                <div id = "serverError">
                    <p></p>
                    <div id = "startNew" className = "button">Try new image</div>
                </div>
                <div id = "convResults">
                    <div id = "seeTopPrediction" className = "button results" onClick ={this._seeInferenceResults}>See Top Prediction</div>
                    <div id = "startNewPrediction" className = "button results" onClick = {this._startNewPrediction}>Start New</div>
                    <div id = "seeAllProbs" className = "button results" onClick = {this._seeInferenceResults}>See All Probabilities</div>
                    <div id = "goBackButton" className = "button results" onClick = {this._goBack}>Go Back</div>
                    <div id = "topPrediction" className = "displayedResult"></div>
                    <div id = "allProbs" className = "displayedResult"></div>
                </div>
            </div>        
        );
    }
}

export default Conv_Model; 