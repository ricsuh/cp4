const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true
});

// Configure multer so that it will upload to '../front-end/public/images'
// const multer = require('multer')
// const upload = multer({
//    dest: '../front-end/public/images/',
//    limits: {
//       fileSize: 10000000
//    }
// });

app.listen(3000, () => console.log('Server listening on port 3000!'));