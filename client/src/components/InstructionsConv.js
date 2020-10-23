import React from 'react';


class InstructionsConv extends React.Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return(
            <div className = "ML_Model_Instructions">
                <div id = "instructionsConv">
                    To use the algorithm, upload a image of a SINGLE pokémon from the first
                    150 pokémon like those shown below (IE: not sprites), and a prediction will 
                    be returned by the algorithm for which pokémon it thinks it most likely is! 
                </div>
                <div id = "randomPokeImgs">
                </div>
            </div>
        );
    }
}

export default InstructionsConv; 