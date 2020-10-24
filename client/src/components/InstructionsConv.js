import React from 'react';

/**
 * This class is a React component that is meant to be a presentational component containing
 * instructions for how to use the convolutional model.
 * 
 * @class
 * @public 
 */
class InstructionsConv extends React.Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return(
            <div className = "ML_Model_Instructions">
                <div id = "instructionsConv">
                <p>This algorithm was trained to specifically recognize the following 4 superheros:</p>
                <ul id = "superhero_list">
                    <li>Spiderman</li>
                    <li>Batman</li>
                    <li>Wolverine</li>
                    <li>Black Panther </li> 
                </ul>
                <p>So upload a .png or .jpeg image of any of the 4 superheros above and the algorithm will
                hopefully recognize it! </p>
                </div>
                <div id = "randomImgs">
                </div>
            </div>
        );
    }
}

export default InstructionsConv; 