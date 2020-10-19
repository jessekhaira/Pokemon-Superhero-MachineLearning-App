import React from 'react';


class Conv_Model extends React.Component {
    constructor(props) {
        super(props); 

        this._isImgUploaded = this._isImgUploaded.bind(this); 
    }

    _isImgUploaded(e) {
        const imgUploaded = e.target.files[0];
        const imageDisplayDiv = document.getElementById('imageDisplayDiv');
        const img = document.getElementById('imgLoaded');
        const reader = new FileReader();

        reader.onloadend = function() {
            imageDisplayDiv.style.display = 'block'; 
            img.src = reader.result; 
            document.getElementById('submitConv').style.display = 'block'; 
            document.getElementById('labelPokeImg').style.display = 'none';
        }

        reader.readAsDataURL(imgUploaded);
    }
    
    render() {
        return(
            <div className = "Model_Div">
                <div id = "ConvModel">
                    <form action="/conv_model" method = "get" id = "conv_form">
                        <label for="pokeImg" 
                        id = "labelPokeImg" 
                        className="buttonSubmitModel"
                        onChange = {this._isImgUploaded}>

                            Submit a .png or .jpg pokemon image like those 
                            above! 

                        </label>
                        <input type="file"
                            id="pokeImg" name="pokeImg"
                            accept="image/png, image/jpeg"
                            onChange = {this._isImgUploaded}
                        >
                        </input>

                        <div id = "imageDisplayDiv">
                            <p>
                            This is the image you uploaded. Press submit if you would like to send the
                            image to the algorithm.
                            </p>
                            <img id = "imgLoaded" alt = "Your uploaded image"></img>
                        </div>
                        <input id = "submitConv" type = "submit" className = "buttonSubmitModel"></input>
                    </form>
                </div>
                <div id = "convResults"></div>
            </div>        
        );
    }
}

export default Conv_Model; 