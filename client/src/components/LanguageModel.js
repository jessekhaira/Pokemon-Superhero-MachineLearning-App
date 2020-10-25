import React from 'react';


class LanguageModel extends React.Component {
    constructor(props) {
        super(props); 
        this._generateNewName = this._generateNewName.bind(this); 
    }

    async _generateNewName(e) {
        e.preventDefault(); 
        const temperatureVal = document.getElementById('temperatureVal').value;
        if(temperatureVal>5 || temperatureVal <0.5 ) {
            console.log('yippe');
            document.getElementById('temperatureVal').setCustomValidity(`Value must be a number between 0.5 and 5, and ${document.getElementById('temperatureVal').value} does not meet those conditions`);
            document.getElementById('tempLabel').innerHTML = document.getElementById('temperatureVal').validationMessage; 
            return; 
        }
        const resultsLM = document.getElementById("ResultsLanguageModel");
        const LM_ModelDiv = document.getElementById("LM_ModelDiv");
        const LanguageModelDiv = document.getElementById("temperatureForm");
        try {
            this.props._hideDisplays(resultsLM, LanguageModelDiv);  
            LM_ModelDiv.appendChild(this.props._addSpinnerAsync());
            let fetchedData = await fetch('/languageModel', {
                method: 'GET',
            });
            let jsonData = await fetchedData.json(); 
            console.log(jsonData); 
            resultsLM.innerHTML = jsonData.predictedName;
        }
        catch(err) {
            resultsLM.innerHTML = "Sorry, there was an error getting your new pokémon name. Try again?";
        }

        finally {
            this.props._showDisplays('block', resultsLM, LanguageModelDiv);
            LM_ModelDiv.removeChild(LM_ModelDiv.lastChild); 
        }

    }

   
    render() {
        return(
            <div className = "Model_Div" id = "LM_ModelDiv">
                <div id = "ResultsLanguageModel"></div>
                <form id = "temperatureForm">
                    <label for = "temperature" id = "tempLabel">How random do you want your generated names to be? Setting the temperature above 1
                    will cause the predicted names to be more random, while below 1 will cause the predicted names 
                    to be more conservative. The number has to be between 0.5 and 5 though (inclusive)!</label>
                    <input type = "number" id = "temperatureVal" name = "temperature" min = "0.5" max = "5" step = "any"></input>
                    <input type= "submit" className = "button" id = "submitLM" onClick = {this._generateNewName} value = "Generate New Pokémon Name"></input>
                </form>
            </div>
        );
    }
}

export default LanguageModel; 