import React from 'react';


class LanguageModel extends React.Component {
    constructor(props) {
        super(props); 
    }
    
    render() {
        return(
            <div className = "Model_Div">
                <div id = "LanguageModel" className = "buttonSubmitModel">Generate New Pokémon Name</div>
                <div id = "ResultsLanguageModel"></div>
            </div>
        );
    }
}

export default LanguageModel; 