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
        try {
            const bodyInfo = document.getElementById('pokeImg'); 
            let formInfo = new FormData();
            formInfo.append('image', bodyInfo.files[0]);
            // data has been submitted, so hide all the form info and start showing the convResults instead
            document.getElementById('conv_form').style.display = 'none'; 
            let predictionData = await fetch('/convModel', {
                method: 'POST',
                body: formInfo 
            })
            let jsonPredictionData = await predictionData.json(); 
            console.log(jsonPredictionData); 
        }
        catch (err) {
            console.log(err); 
        }
    }


    
    render() {
        return(
            <div className = "Model_Div">
                <div id = "ConvModel">
                    <form id = "conv_form">
                        <label for="pokeImg" 
                        id = "labelPokeImg" 
                        className="buttonSubmitModel"
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
                        <div id = "submitConv" onClick = {this._requestPrediction} className = "buttonSubmitModel">Submit</div>
                    </form>
                </div>
                <div id = "convResults">
                    <div id = "seeTopPrediction"></div>
                    <div id = "startNewPrediction"></div>
                    <div id = "seeTopTenPredictions"></div>
                </div>
            </div>        
        );
    }
}

export default Conv_Model; 