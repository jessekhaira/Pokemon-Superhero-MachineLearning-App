import React from 'react';


class LanguageModel extends React.Component {
    constructor(props) {
        super(props); 
        this._generateNewName = this._generateNewName.bind(this); 
    }

    async _generateNewName(e) {
        const resultsLM = document.getElementById("ResultsLanguageModel");
        try {
            const LanguageModel = document.getElementById("LanguageModel"); 
            this.props._hideDisplays(resultsLM, LanguageModel); 
            document.getElementById("LM_ModelDiv").appendChild(this.props._addSpinnerAsync());
            let fetchedData = await fetch('/languageModel', {
                method: 'GET'
            });
            let jsonData = await fetchedData.json(); 
            console.log(jsonData);
        }
        catch(err) {
            console.log(err); 
            resultsLM.innerHTML = "Sorry, there was an error getting your new pokémon name. Try again?";
        }

    }

   
    render() {
        return(
            <div className = "Model_Div" id = "LM_ModelDiv">
                <div id = "ResultsLanguageModel"></div>
                <div id = "LanguageModel" className = "buttonSubmitModel" 
                onClick = {this._generateNewName}>Generate New Pokémon Name</div>
            </div>
        );
    }
}

export default LanguageModel; 