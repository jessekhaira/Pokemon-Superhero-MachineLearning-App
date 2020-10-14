var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json([{
      id: 1,
      username: "h1"
    }, {
      id: 2,
      username: "h2"
    }]);
});

module.exports = router;
