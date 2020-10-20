import React from 'react';


class LanguageModel extends React.Component {
    constructor(props) {
        super(props); 
    }

    _generateNewName(e) {
        // Asynchronous action. Display a spinner when request 
        // is first sent in the results box, then remove the spinner once
        // the data has been recieved 
        fetch('/languageModel', {
            method: 'GET'
        }).
        then(data => data.json()).
        then(data => console.log(data));
    }
    
    render() {
        return(
            <div className = "Model_Div">
                <div id = "LanguageModel" className = "buttonSubmitModel" 
                onClick = {this._generateNewName}>Generate New Pokémon Name</div>
                <div id = "ResultsLanguageModel"></div>
            </div>
        );
    }
}

export default LanguageModel; 