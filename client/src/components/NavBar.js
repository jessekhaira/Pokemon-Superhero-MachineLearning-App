import React from 'react';
import {Link} from "react-router-dom";


class NavBar extends React.Component {
    constructor(props) {
        super(props); 
    }
    render() {
        return(
            <div id = "NavBar">
                <div id = "DescriptionInfo">
                    <h2>Pokemon Machine Learning</h2>
                </div>
                <div id = "NavigationLinks">
                    <Link to = "/">Recognize Images</Link>
                    <Link to = "/getName">Generate Names</Link>
                </div>
            </div>
        );
    }
}

export default NavBar; 