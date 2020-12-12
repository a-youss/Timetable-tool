const express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const crypto = require('crypto');
const expressSanitizer = require('express-sanitizer');
const jwt = require('jsonwebtoken');
const open = express.Router();
const secure = express.Router();
const restricted = express.Router();
//const stringSimilarity = require('string-similarity');
const fs = require('fs');
const subjectData = parseData('Lab5-subject-data.json');
const timetableData = parseData('Lab3-timetable-data.json');


const port = process.env.PORT || 3000;
const app = express();

var db = mongoose.connect('mongodb+srv://db_user:Secretpassw0rd@cluster0.63jsz.mongodb.net/ece-9065-project?retryWrites=true&w=majority', {useNewUrlParser: true}, function(err,response){
  if(err){
    console.log('There is error connecting with mongodb');
  }else{
    console.log('Connection with mongodb successful');
  } 
});

mongoose.Promise = global.Promise;

User=require('./models/Users');

app.use('/admin', restricted);
app.use('/secure', secure);
app.use('/open', open);

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
 });

function parseData(filePath) {
    file = fs.readFileSync(filePath)
    return JSON.parse(file);
}