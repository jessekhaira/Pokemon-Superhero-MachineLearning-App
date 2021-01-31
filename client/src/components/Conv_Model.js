import React from 'react';
import {animateWidthGrowing} from '../utils/utilityFunctions';
/**
 * This class represents the react component responsible for where images are uploaded and sent 
 * to the backend to the convolutional model, and results recieved and displayed to the user.
 * 
 * @class @public 
 */
class Conv_Model extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allProbs: null
        };

        this._isImgUploaded = this._isImgUploaded.bind(this); 
        this._requestPrediction = this._requestPrediction.bind(this); 
        this._startNewPrediction = this._startNewPrediction.bind(this); 
        this._seeInferenceResults = this._seeInferenceResults.bind(this);
        this._populateAllProbs = this._populateAllProbs.bind(this); 
        this._goBack = this._goBack.bind(this); 
        this._errorStartAgain = this._errorStartAgain.bind(this); 
    }


    /**
     * This method is the event handler for the change event that occurs to the input tag that accepts the user images. If the user
     * has uploaded an image, this event handler will load that image onto the page. 
     * @param {Event} e Change event 
     */
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

    /**
     * This method is the asynchronous event handler for click events for the DOM element with id 'submitConv', responsible  
     * for sending the uploaded image currently showing in the image tag with id 'pokeImg' to the server to be processed. 
     */
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
            const mostLikelyClass = jsonPredictionData.MostLikelyClass;
            const allProbs_new = jsonPredictionData.allProbs;
            this.setState((state, props) => ({
                allProbs: allProbs_new
            }));
            document.getElementById('pred_info').innerHTML = `With a probability of ${(this.state.allProbs[mostLikelyClass] * 100).toPrecision(3)}%, the AI says your image is of the superhero:`;
            document.getElementById('pred_result').innerHTML = jsonPredictionData.MostLikelyClass;
            this.props._showDisplays('flex',document.getElementById('convResults')); 
        }

        catch (err) {
            this.props._showDisplays('flex',document.getElementById('convServErr')); 
            let err_msg = 'There was an error processing your image by the server. Try a different image?'; 
            document.getElementById('error_message').innerHTML = err_msg; 
        }
        finally {
            convModel.removeChild(convModel.lastChild); 
        }
    }

    /**
     * This method is used to insert the probabilities for the input imgee returned by the neural network into the appropriate 
     * DOM elements. A function used to animate the width of the DOM elements growing in proportion to the probability
     * assigned to them is then called. 
     */
    _populateAllProbs() {
        const batmanProb = Math.round(this.state.allProbs["Batman"] * 100);
        const spidermanProb = Math.round(this.state.allProbs["Spiderman"] * 100);
        const hulkProb = Math.round(this.state.allProbs["Hulk"]* 100);
        const supermanProb = Math.round(this.state.allProbs["Superman"]*100);
        document.getElementById('batman_descr').innerHTML = `Batman: ${batmanProb}%`;
        document.getElementById('spiderman_descr').innerHTML = `Spiderman: ${spidermanProb}%`;
        document.getElementById('hulk_descr').innerHTML = `Hulk: ${hulkProb}%`;
        document.getElementById('superman_descr').innerHTML = `Superman: ${supermanProb}%`;
        animateWidthGrowing(
            [document.getElementById('batman'), batmanProb],
            [document.getElementById('spiderman'), spidermanProb],
            [document.getElementById('superman'), supermanProb],
            [document.getElementById('hulk'), hulkProb]
        );
    }

    /**
     * This method is the event handler for click events for the DOM element with id startNewPrediction, that has the 
     * responsibility of resetting the view to the original convForm so the user can submit more predictions. 
     */
    _startNewPrediction() {
        this.props._hideDisplays(
            document.getElementById('convResults')
        )
        this._showConvForm(); 
    }

    _showConvForm() {
        this.props._hideDisplays(
            document.getElementById('imageDisplayDiv'),
            document.getElementById('submitConv')
        )
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


        // if we're showing all the probabilities, we're going to play a dynamic JS animation
        if (typeResultsToShow === "allProbs") {
            this._populateAllProbs(); 
        }
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

    _errorStartAgain() {
        this.props._hideDisplays(
            document.getElementById('convServErr'),
        );
        this._showConvForm(); 
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

                            Submit a .png or .jpg superhero image of the 4 heros above! 

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
                <div id = "convServErr" className = "serverError">
                    <p id = "error_message"></p>
                    <div id = "startNew" className = "button" onClick = {this._errorStartAgain}>Try new image</div>
                </div>
                <div id = "convResults">
                    <div id = "seeTopPrediction" className = "button results" onClick ={this._seeInferenceResults}>See Top Prediction</div>
                    <div id = "startNewPrediction" className = "button results" onClick = {this._startNewPrediction}>Start New</div>
                    <div id = "seeAllProbs" className = "button results" onClick = {this._seeInferenceResults}>See All Probabilities</div>
                    <div id = "goBackButton" className = "button results" onClick = {this._goBack}>Go Back</div>
                    <div id = "topPrediction" className = "displayedResult">
                        <p id = "pred_info"></p>
                        <p id = "pred_result"></p>
                    </div>
                    <div id = "allProbs" className = "displayedResult">
                        <p id = "descr_allprobs">Here's how likely the AI thought the image was each of the 4 superheros:</p>
                        <div id = "container_bar_graph">

                            <div id ="batman_holder" className = "superhero_holder">
                                <p id ="batman_descr" className = "superhero_prob_descr"></p>
                                <div id = "batman" className = "probsSuperheros"></div>
                            </div>

                            <div id ="spiderman_holder" className = "superhero_holder">
                                <p id = "spiderman_descr" className = "superhero_prob_descr"></p>
                                <div id = "spiderman" className = "probsSuperheros"></div>
                            </div>

                            <div id ="hulk_holder" className = "superhero_holder">
                                <p id = "hulk_descr" className = "superhero_prob_descr"></p>
                                <div id = "hulk" className = "probsSuperheros"></div>
                            </div>

                            <div id ="superman_holder" className = "superhero_holder">
                                <p id = "superman_descr" className = "superhero_prob_descr"></p>
                                <div id = "superman" className = "probsSuperheros"></div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>        
        );
    }
}

export default Conv_Model; 