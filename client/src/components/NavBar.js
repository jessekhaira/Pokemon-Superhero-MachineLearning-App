import React from 'react';
import {Link} from "react-router-dom";


class NavBar extends React.Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return(
            <div id = "NavBar_Container">
                <div id = "NavBar">
                    <div id = "DescriptionInfo">
                        <h2>Pokémon Machine Learning</h2>
                    </div>
                    <div id = "NavigationLinks">
                        <Link to = "/" id="Recognize">Recognize Images</Link>
                        <Link to = "/getName" id="GenerateNames">Generate Names</Link>
                    </div>
                </div>
                {/* Div to space out rest of content of page from the navbar */}
                <div id = "spacingDiv"></div>
            </div>
        );
    }
}

export default NavBar; 