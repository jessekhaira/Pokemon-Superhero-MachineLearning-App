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
                <p>Upload a .png or .jpeg image of one of the following four superheros, and the algorithm will hopefully correctly recognize
                    it!</p>
                <ul id = "superhero_list">
                    <li>Spiderman</li>
                    <li>Batman</li>
                    <li>Hulk</li>
                    <li>Superman </li> 
                </ul>
                </div>
                <div id = "randomImgs">
                </div>
            </div>
        );
    }
}

export default InstructionsConv; 