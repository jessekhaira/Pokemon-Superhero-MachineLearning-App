import React from 'react';


class InstructionsConv extends React.Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return(
            <div className = "ML_Model_Instructions">
                <div id = "instructionsConv">
                    The algorithm was trained to recognize pokémon from the first
                    150 pokémon. 
                    
                    This means you should ideally insert images from those 150 pokémon,
                    like those shown below. 
                </div>
                <div id = "randomPokeImgs">
                </div>
            </div>
        );
    }
}

export default InstructionsConv; 