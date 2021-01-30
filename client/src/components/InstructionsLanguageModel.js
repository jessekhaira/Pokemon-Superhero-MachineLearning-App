import React from 'react';
import {getRndInteger} from '../utils/utilityFunctions';


/**
 * This class is a stateful React component containing instructions for how to use the language model to generate new names.
 * @class
 * @public 
 */
class InstructionsLM extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {cachedQuotes: null}
        this._fetchQuoteAndDisplay = this._fetchQuoteAndDisplay.bind(this); 
        this._addQuote = this._addQuote.bind(this); 
    }
    
    componentDidMount() {
        this._fetchQuoteAndDisplay(); 
    }

    /**
     * This method is the event handler for when the get new quote button is clicked by the user.
     * The rationale behind adding this extra wrapper method is for performance reasons. We don't need
     * to keep requesting data from the API and getting quotes if they are already present in our state storage.
     * So whenever we do request data from the API, when we recieve the response, we can cache values in storage. 
     */
    _addQuote() {
        if (this.state.cachedQuotes === null) {
            this._fetchQuoteAndDisplay();
        }

        else {
            this._addQuoteToPage(this.state.cachedQuotes); 
        }
    }


    /**
     * This function is an asynchronous function that sends a GET request to an external API to obtain inspirational quotes,
     * and then templates the quotes on the page if the request is sucessful. If the fetch fails, then an error is shown on 
     * the page. 
     */
    async _fetchQuoteAndDisplay() {
        const quoteBox = document.getElementById("quoteBox");
        try {
            this.props._hideDisplays(
                document.getElementById("quoteDisplay"),  
                document.getElementById("authorDisplay"),
                document.getElementById("newQuote")); 
            // add a spinning element to the div to indicate we are waiting on a response from an api
            // that will either succeed or fail, at which point spinnerDiv is removed 
            quoteBox.appendChild(this.props._addSpinnerAsync());
            const fetchedQuotesRaw = await fetch('https://type.fit/api/quotes');
            const fetchedQuotesJSON = await fetchedQuotesRaw.json(); 
            // cache the values we just got from the API in the storage 
            this.setState((state, props) => {
                return {cachedQuotes: fetchedQuotesJSON};
            });
            this._addQuoteToPage(this.state.cachedQuotes);
        }

        catch(err) {
            document.getElementById("quoteDisplay").innerHTML = "Sorry, there was an error fetching your quote :(";
        }
        finally {
            this.props._showDisplays('block',
                document.getElementById("quoteDisplay"),  
                document.getElementById("authorDisplay"),
                document.getElementById("newQuote")); 
            quoteBox.removeChild(quoteBox.lastChild); 
        }
    }

    /**
     * This method accepts a HashMap mapping indices to inspirational quotes, pulls a quote out of the HashMap and 
     * displays it on the page. 
     * 
     * @param {Map<Number, String>} quotes 
    */
    _addQuoteToPage(quotes) {
        this._cleanUpInnerHTML();
        const randomIdx = getRndInteger(0, 1643); 
        const randomQuote = quotes[randomIdx]; 
        this._addQuoteInfo(randomQuote); 
    }

    /**
     * This method cleans up the inner html contained with the div that holds the quotes, and the div that holds
     * the authors, to get the divs ready for displaying a new random quote within them. 
     */
    _cleanUpInnerHTML() {
        document.getElementById("quoteDisplay").innerHTML = null; 
        document.getElementById("authorDisplay").innerHTML = null; 
    }

    /**
     * This method takes a string as input that represents an inspirational quote, and adds that quote to the 
     * appropriate divs on the page.  
     * @param {String} randomQuote 
     */
    _addQuoteInfo(randomQuote) {
        // have to clone the nodes so the animation can start again sucessfully 
        let quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.parentNode.replaceChild(quoteDisplay.cloneNode(true), quoteDisplay);

        let authorDisplay = document.getElementById('authorDisplay');
        authorDisplay.parentNode.replaceChild(authorDisplay.cloneNode(true), authorDisplay);

        const [quotePNode, authorPNode] = this._makeQuoteAuthorDisplay(randomQuote); 
        document.getElementById("quoteDisplay").appendChild(quotePNode); 
        document.getElementById("authorDisplay").appendChild(authorPNode);

    }

    /**
     * This method makes and inserts the appropriate information into 2 DOM elements representing the author
     * of a given quote and the text of a given quote. 
     */
    _makeQuoteAuthorDisplay(randomQuote) {
        const authorPNode = document.createElement('p'); 
        const quotePNode = document.createElement('p'); 

        quotePNode.innerHTML = randomQuote.text; 
        authorPNode.innerHTML = "-"+(randomQuote.author ? randomQuote.author: "Unknown");
        return [quotePNode, authorPNode]; 
    }

    render() {
        return(
            <div className = "ML_Model_Instructions">
                <div id = "instructionsLM">
                </div>
                <div id = "quoteBox">
                    <div id = "quoteDisplay"></div>
                    <div id = "authorDisplay"></div>
                    <div id = "newQuote" className = "button" onClick = {this._addQuote}>Get New Quote</div>
                </div>
            </div>
        );
    }
}

export default InstructionsLM; 