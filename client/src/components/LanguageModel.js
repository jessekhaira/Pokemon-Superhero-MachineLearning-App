import React from 'react';


class LanguageModel extends React.Component {
    constructor(props) {
        super(props); 
        this._generateNewName = this._generateNewName.bind(this); 
        this._resetLM = this._resetLM.bind(this); 
    }

    componentDidMount() {
        this._setTempLabelInnerHTML(); 
        this._addLabelsClasses();
    }

    _addLabelsClasses() {
        const labels = document.getElementById('temperatureForm').getElementsByTagName('label');
        for (let i=0; i<labels.length; i++) {
            labels[i].className = '';
            labels[i].classList.add('formLabel');
        }
    }
    async _generateNewName(e) {
        e.preventDefault(); 
        if (this._validateTemperature()) {
            return; 
        }
        const temperatureVal = document.getElementById('temperatureVal').value;
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
            // if the node backend has an error, it will be passed to client in message
            resultsLM.innerHTML = jsonData.predictedName || "Sorry, there was an error getting your new pokémon name. Try again?";
        }
        catch(err) {
            resultsLM.innerHTML = "Sorry, there was an error getting your new pokémon name. Try again?";
        }

        finally {
            this.props._showDisplays('block', resultsLM, document.getElementById('generateAgain')); 
            LM_ModelDiv.removeChild(LM_ModelDiv.lastChild); 
        }
    }

    _validateTemperature() {
        const temperatureVal = document.getElementById('temperatureVal').value;
        const tempLabel = document.getElementById('tempLabel');
        if(temperatureVal>5 || temperatureVal <0.5 ) {
            const validation_value_msg = temperatureVal? `${temperatureVal} does not meet those conditions `:`no value was provided at all!`;
            document.getElementById('temperatureVal').setCustomValidity(`**Value must be a number between 0.5 and 5, and ${validation_value_msg}`);
            tempLabel.innerHTML = document.getElementById('temperatureVal').validationMessage; 
            tempLabel.className = '';
            tempLabel.classList.add('validationErrorLabel');
            return true; 
        }
        return false; 
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
        document.getElementById('tempLabel').innerHTML = `Provide a value between 0.5 and 5. The higher
        the number the more random the names:`
    }

   
    render() {
        return(
            <div className = "Model_Div" id = "LM_ModelDiv">
                <div id = "ResultsLanguageModel"></div>
                <form id = "temperatureForm">
                    <label for = "temperature" id = "tempLabel">Temperature:</label>
                    <input type = "number" id = "temperatureVal" className = "formInputNumber" name = "temperature" min = "0.5" max = "5" step = "any"></input>
                    <label for = "numGenerate" id = "numGenerateLabel">Pick a number of names to generate between 1 and 15 (inclusive)!</label>
                    <input type = "number" name = "numGenerate" className ="formInputNumber" id = "numGenerateInput" min = "1" max = "15" step = "any"></input>
                    <input type= "submit" className = "button" id = "submitLM" onClick = {this._generateNewName} value = "Generate!"></input>
                </form>
                <div id = "generateAgain" className = "button" onClick = {this._resetLM}>Generate Again</div>
            </div>
        );
    }
}

export default LanguageModel; 