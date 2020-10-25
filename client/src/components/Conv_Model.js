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
    }

    _isImgUploaded(e) {
        const imgUploaded = e.target.files[0];
        const imageDisplayDiv = document.getElementById('imageDisplayDiv');
        const img = document.getElementById('imgLoaded');
        const reader = new FileReader();

        reader.onloadend = function() {
            imageDisplayDiv.style.display = 'block'; 
            img.src = reader.result; 
            document.getElementById('submitConv').style.display = 'block'; 
            document.getElementById('labelPokeImg').style.display = 'none';
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
            this.props._hideDisplays(convForm); 
            // start up the async loader
            convModel.appendChild(this.props._addSpinnerAsync());
            let predictionData = await fetch('/convModel', {
                method: 'POST',
                body: formInfo 
            });
            let jsonPredictionData = await predictionData.json(); 
            this.props._showDisplays('flex',document.getElementById('convResults')); 
            convModel.removeChild(convModel.lastChild); 
        }
        catch (err) {
            console.log(err); 
        }
    }

    _startNewPrediction(e) {
        this.props._hideDisplays(document.getElementById('convResults'));
        this.props._showDisplays('block', document.getElementById('ConvModel'));
    }


    
    render() {
        return(
            <div className = "Model_Div">
                <div id = "ConvModel">
                    <form id = "conv_form">
                        <label for="pokeImg" 
                        id = "labelPokeImg" 
                        className="button"
                        onChange = {this._isImgUploaded}>

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
                <div id = "convResults">
                    <div id = "seeTopPrediction" className = "button results">See Top Prediction</div>
                    <div id = "startNewPrediction" className = "button results" onClick = {this._startNewPrediction}>Start New</div>
                    <div id = "seeTopTenPredictions" className = "button results">See All Probabilities</div>
                </div>
            </div>        
        );
    }
}

export default Conv_Model; 