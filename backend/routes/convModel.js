var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

router.use(fileUpload({
    createParentPath: true
}));

router.post('/', function(req, res) {
    console.log(req.files); 
    res.send({response:"placeholder"}); 
});

module.exports = router;