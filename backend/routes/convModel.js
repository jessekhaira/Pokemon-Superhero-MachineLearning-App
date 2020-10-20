var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


var fileUpload = require('express-fileupload');
var Jimp = require('jimp')
router.use(fileUpload({
    createParentPath: true
}));

router.post('/', async function(req, res) {
    const image = await Jimp.read(req.files.image.data);
    let file = `new_name2.${image.getExtension()}`;

    return image.write(file); 
});

module.exports = router;