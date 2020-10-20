var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    // will eventually be a response that contains the prediction
    // info from the ml model 
    res.send({response:'placeholder'}); 
});

module.exports = router;