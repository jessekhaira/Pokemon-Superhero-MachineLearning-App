import React from 'react';


class LanguageModel extends React.Component {
    constructor(props) {
        super(props); 
        this._generateNewName = this._generateNewName.bind(this); 
    }

    async _generateNewName(e) {
        const resultsLM = document.getElementById("ResultsLanguageModel");
        const LM_ModelDiv = document.getElementById("LM_ModelDiv");
        const LanguageModelDiv = document.getElementById("LanguageModel");
        try {
            this.props._hideDisplays(resultsLM, LanguageModelDiv);  
            LM_ModelDiv.appendChild(this.props._addSpinnerAsync());
            let fetchedData = await fetch('/languageModel', {
                method: 'GET'
            });
            let jsonData = await fetchedData.json(); 
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
                <div id = "LanguageModel" className = "button" 
                onClick = {this._generateNewName}>Generate New Pokémon Name</div>
            </div>
        );
    }
}

export default LanguageModel; 