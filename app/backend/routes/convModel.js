var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
var fileUpload = require("express-fileupload");
var FormData = require("form-data");
require("dotenv").config();

router.use(
  fileUpload({
    createParentPath: true,
  })
);

/**
 * This endpoint responds to POST requests to the /convModel endpoint of the server. This endpoint expects the
 * request body to contain a file containing a jpg or png image, which is then sent to the flask server.
 */
router.post("/", async function (req, res) {
  try {
    var form = new FormData();
    form.append("image_data_buffer", req.files.image.data.toString("base64"));
    let recievedData = await fetch(process.env.ML_Server + "/convModel/", {
      method: "POST",
      body: form,
    });
    let jsonData = await recievedData.json();
    res.status(201).json(jsonData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
