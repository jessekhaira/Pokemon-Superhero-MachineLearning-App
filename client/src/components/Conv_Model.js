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
                        <label for="pokeImg">Upload a .png pokemon image or a .jpg pokemon image like
                        those shown above</label>
                        <input type="file"
                            id="pokeImg" name="pokeImg"
                            accept="image/png, image/jpeg"></input>
                    </form>
                </div>
                <div id = "ResultsLanguageModel"></div>
            </div>        
        );
    }
}

export default Conv_Model; 