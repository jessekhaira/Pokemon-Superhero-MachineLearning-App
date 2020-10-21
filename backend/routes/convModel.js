var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fetch = require('node-fetch'); 
var fileUpload = require('express-fileupload');
const { json } = require('express');
require('dotenv').config();

router.use(fileUpload({
    createParentPath: true
}));

router.post('/', async function(req, res) {
    try {
        let recievedData = await fetch(process.env.ML_Server + '/convModel', {
            method: "POST"
        });
        let jsonData = await recievedData.json(); 
        res.status(201).json(jsonData); 
    }
    catch (err) {
        res.status(500).json({'message':err.message});
    }
});

module.exports = router;