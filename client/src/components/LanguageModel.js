import React from 'react';


class LanguageModel extends React.Component {
    constructor(props) {
        super(props); 
        this._generateNewName = this._generateNewName.bind(this); 
        this._resetLM = this._resetLM.bind(this); 
    }

    componentDidMount() {
        this._setTempLabelInnerHTML(); 
    }
    async _generateNewName(e) {
        e.preventDefault(); 
        const temperatureVal = document.getElementById('temperatureVal').value;
        if(temperatureVal>5 || temperatureVal <0.5 ) {
            document.getElementById('temperatureVal').setCustomValidity(`Value must be a number between 0.5 and 5, and ${document.getElementById('temperatureVal').value} does not meet those conditions`);
            document.getElementById('tempLabel').innerHTML = document.getElementById('temperatureVal').validationMessage; 
            return; 
        }
        const resultsLM = document.getElementById("ResultsLanguageModel");
        const LM_ModelDiv = document.getElementById("LM_ModelDiv");
        const LanguageModelDiv = document.getElementById("temperatureForm");
        try {
            this.props._hideDisplays(document.getElementById('temperatureForm')); 
            LM_ModelDiv.appendChild(this.props._addSpinnerAsync());
            let fetchedData = await fetch('/languageModel', {
                method: 'POST',
                body: JSON.stringify({
                    temperature: temperatureVal
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });
            let jsonData = await fetchedData.json(); 
            this.props._showDisplays('block', resultsLM, document.getElementById('generateAgain')); 
            resultsLM.innerHTML = jsonData.predictedName;
        }
        catch(err) {
            resultsLM.innerHTML = "Sorry, there was an error getting your new pokémon name. Try again?";
        }

        finally {
            LM_ModelDiv.removeChild(LM_ModelDiv.lastChild); 
        }

    }

    _resetLM() {
        const resultsLM = document.getElementById("ResultsLanguageModel");
        this.props._showDisplays('flex',document.getElementById('temperatureForm'));
        this.props._hideDisplays(resultsLM, document.getElementById('generateAgain')); 
        // reset the temperature val to be nothing, and reset the string in the label to be the original string because 
        // there may still be an error message displayed there 
        document.getElementById('temperatureVal').value = '';
        this._setTempLabelInnerHTML();
    }

    _setTempLabelInnerHTML() {
        document.getElementById('tempLabel').innerHTML = `How random do you want your generated names to be? Setting the temperature above 1
        will cause the predicted names to be more random, while below 1 will cause the predicted names 
        to be more conservative. The number has to be between 0.5 and 5 though (inclusive)!`; 
    }

   
    render() {
        return(
            <div className = "Model_Div" id = "LM_ModelDiv">
                <div id = "ResultsLanguageModel"></div>
                <form id = "temperatureForm">
                    <label for = "temperature" id = "tempLabel"></label>
                    <input type = "number" id = "temperatureVal" name = "temperature" min = "0.5" max = "5" step = "any"></input>
                    <input type= "submit" className = "button" id = "submitLM" onClick = {this._generateNewName} value = "Generate New Pokémon Name"></input>
                </form>
                <div id = "generateAgain" className = "button" onClick = {this._resetLM}>Generate Again</div>
            </div>
        );
    }
}

export default LanguageModel; 