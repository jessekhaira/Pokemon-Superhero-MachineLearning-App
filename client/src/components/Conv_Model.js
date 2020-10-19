import React from 'react';


class Conv_Model extends React.Component {
    constructor(props) {
        super(props); 
    }
    
    render() {
        return(
            <div className = "Model_Div">
                <div id = "ConvModel">
                    <form action="/conv_model" method = "post" id = "conv_form">
                        <label for="pokeImg" id = "labelPokeImg" className="buttonSubmitModel">Submit a .png or .jpg pokemon image like those 
                        above! </label>
                        <input type="file"
                            id="pokeImg" name="pokeImg"
                            accept="image/png, image/jpeg">
                        </input>
                        <input id = "submitConv" type = "submit" className = "buttonSubmitModel"></input>
                        <div id = "convResults"></div>
                    </form>
                </div>
                <div id = "ResultsLanguageModel"></div>
            </div>        
        );
    }
}

export default Conv_Model; 