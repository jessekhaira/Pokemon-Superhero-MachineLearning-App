var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fetch = require('node-fetch'); 
const { json } = require('express');
require('dotenv').config();

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