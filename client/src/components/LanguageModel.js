import React from 'react';


class LanguageModel extends React.Component {
    constructor(props) {
        super(props); 
        this._generateNewName = this._generateNewName.bind(this); 
        this._resetLM = this._resetLM.bind(this); 
        this._sendRequestForNames = this._sendRequestForNames.bind(this); 
    }

    componentDidMount() {
        this._addClassesLabels(document.getElementById('tempLabel'), document.getElementById('numGenerateLabel'));
        this._addHTML_tempLabel();
        this._addHTML_numLabel();
    }

    _addClassesLabels(...args) {
        for (let arg of args) {
            console.log(arg);
            arg.className = '';
            arg.classList.add('formLabel');
        }
    }

    _addHTML_tempLabel() {
        document.getElementById('tempLabel').innerHTML = `Provide a value between 0.5 and 5. The higher
        the number the more random the names:`;
    }

    _addHTML_numLabel() {
        document.getElementById('numGenerateLabel').innerHTML = `Pick a number of names to generate between 1 and 15 (inclusive)!`;
    }

    async _generateNewName(e) {
        e.preventDefault(); 
        const temperatureInputNode = document.getElementById('temperatureVal');
        const tempLabelNode = document.getElementById('tempLabel');
        const numNamesInputNode = document.getElementById('numGenerateInput');
        const numberNamesLabelNode = document.getElementById('numGenerateLabel'); 
        // validate the inputs and make sure they are in an acceptable range 
        if (this._validateInputs(0.5, 5,temperatureInputNode, tempLabelNode)) {
            return; 
        }
        else {
            this._addClassesLabels(tempLabelNode); 
            this._addHTML_tempLabel(); 
        }
        if (this._validateInputs(1, 15, numNamesInputNode, numberNamesLabelNode)) {
            return; 
        }

        const resultsLM = document.getElementById("ResultsLanguageModel");
        const LM_ModelDiv = document.getElementById("LM_ModelDiv");
        const LanguageModelDiv = document.getElementById("temperatureForm");
        try {
            await this._sendRequestForNames(LM_ModelDiv, temperatureInputNode, numNamesInputNode, resultsLM); 
        }
        catch(err) {
            resultsLM.innerHTML = "Sorry, there was an error getting your new pokémon name. Try again?";
        }

        finally {
            this.props._showDisplays('block', resultsLM, document.getElementById('generateAgain'));
            this._setGridDisplayResults(resultsLM);
            LM_ModelDiv.removeChild(LM_ModelDiv.lastChild); 
        }
    }

    _setGridDisplayResults(resultsLM) {

    }

    async _sendRequestForNames(LM_ModelDiv, temperatureInputNode, numNamesInputNode, resultsLM) {
        this.props._hideDisplays(document.getElementById('temperatureForm')); 
        LM_ModelDiv.appendChild(this.props._addSpinnerAsync());
        let fetchedData = await fetch('/languageModel', {
            method: 'POST',
            body: JSON.stringify({
                temperature: temperatureInputNode.value,
                number_to_generate: numNamesInputNode.value 
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        let jsonData = await fetchedData.json();
        resultsLM.innerHTML = jsonData.predictedName || "Sorry, there was an error getting your new pokémon name. Try again?";
    }

    _validateInputs(minVal, maxVal, inputNode, labelNode) {
        const value = inputNode.value; 
        if(value>maxVal || value <minVal ) {
            const validation_value_msg = value ? `${value} does not meet those conditions `:`no value was provided at all!`;
            inputNode.setCustomValidity(`**Value must be a number between ${minVal} and ${maxVal}, and ${validation_value_msg}`);
            labelNode.innerHTML = inputNode.validationMessage; 
            labelNode.className = '';
            labelNode.classList.add('validationErrorLabel');
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
        document.getElementById('numGenerateInput').value = '';
        this._addClassesLabels(document.getElementById('numGenerateLabel'));
        this._addHTML_numLabel();
    }

   
    render() {
        return(
            <div className = "Model_Div" id = "LM_ModelDiv">
                <div id = "ResultsLanguageModel"></div>
                <form id = "temperatureForm">
                    <label for = "temperature" id = "tempLabel">Temperature:</label>
                    <input type = "number" id = "temperatureVal" className = "formInputNumber" name = "temperature" min = "0.5" max = "5" step = "any"></input>
                    <label for = "numGenerate" id = "numGenerateLabel"></label>
                    <input type = "number" name = "numGenerate" className ="formInputNumber" id = "numGenerateInput" min = "1" max = "15" step = "any"></input>
                    <input type= "submit" className = "button" id = "submitLM" onClick = {this._generateNewName} value = "Generate!"></input>
                </form>
                <div id = "generateAgain" className = "button" onClick = {this._resetLM}>Generate Again</div>
            </div>
        );
    }
}

export default LanguageModel; 