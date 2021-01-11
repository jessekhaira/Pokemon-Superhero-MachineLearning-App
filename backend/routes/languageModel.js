var express = require('express');
var router = express.Router();
var fetch = require('node-fetch'); 
const { json } = require('express');
require('dotenv').config();

/**
 * This endpoint responds to POST requests to the /languageModel endpoint of the server. This endpoint expects the
 * request body to contain two Numbers: a value for the temperature, and a value for the number of names to generate.
 * These values are then included in a request to the Flask server. 
 */
router.post('/', async function(req, res) {
    try {
        let recievedData = await fetch(process.env.ML_Server + '/languageModel', {
            method: 'POST',
            body: JSON.stringify({
                temperature: req.body.temperature,
                number_to_generate: req.body.number_to_generate
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        let jsonData = await recievedData.json(); 
        res.send(jsonData); 
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;