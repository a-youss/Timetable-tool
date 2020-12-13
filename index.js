const express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const expressSanitizer = require('express-sanitizer');
const jwt = require('jsonwebtoken');
const open = express.Router();
const secure = express.Router();
const restricted = express.Router();
const bcrypt = require('bcrypt');
//const stringSimilarity = require('string-similarity');
const fs = require('fs');
const User = require('./models/Users');
const nodemailer = require('nodemailer');

const subjectData = parseData('Lab5-subject-data.json');
const timetableData = parseData('Lab3-timetable-data.json');
const JWT_SECRET = crypto.randomBytes(64).toString('hex');

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

app.use(expressSanitizer());
app.use(bodyParser.json());
app.use(cors());
app.use('/admin', restricted);
app.use('/secure', secure);
app.use('/open', open);
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});
app.use(function(req, res) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
});

open.get('/Search/:subject/:course', (req,res) => {
    let subjects = [];
    let result = [];
    let i = 0;
    let subject = req.sanitize(req.params.subject);
    let course = req.sanitize(req.params.course);

    timetableData.forEach(e => {
    if(e.subject==subject){
        subjects[i] = e;
        i++;
    }});
    if(subjects.length<1){
        return res.status(404).send({"message":'Subject not found'});
    }
    if(course == "NA"){
        result=subjects;
    }else{
        i=0;
        subjects.forEach(e => {
            if(e.catalog_nbr.includes(course.toUpperCase())){
                result[i] = e;
                i++;
            }
        });
    }
    if(result.length<1){
        return res.status(404).send({"message":"No matches were found"});
    }
    return res.send(result)
});

open.put('/register', (req,res)=>{
    const {body}=req;
    const {
        email,
        name,
        password,
        passwordConf
    } = body;
    if (!name || !email || !password || !passwordConf) {
        return res.status(404).send({ msg: 'Please enter all fields' });
    }else if (password !== passwordConf) {
        return res.status(404).send({msg:'Passwords do not match'});
    }else{
        User.findOne({email: email}).then(user=>{
            if(user){
                return res.status(404).send({msg: 'User already registered'})
            }else{
                const doc = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    verified: false,
                    deactivated: false,
                    admin: false
                });
                doc.save((err, user)=>{
                    if(err){
                        return res.status(500).send({ msg: err });
                    }else{
                        const token = jwt.sign({ email }, JWT_SECRET);
                        return res.send({accessToken: token});
                    }
                });
                
            }
        })
    }
});

// open.get('/verification/:token', async(req,res)=>{
//     const token = jwt.verify(req.params.token, JWT_SECRET);
//     User.findOne({email: token.email}).then((err,user)=>{
//         if(err){
//             return res.status(404);
//         }else{
//             //res.send(user)
//             // user.verified=true;
//             // user.save()
//             //res.send('E-mail verified successfully')
//         }
//     })
// });

open.post('/login', (req,res)=>{
    const {body}=req;
    const {
        email,
        password
    } = body;
    if(!email ||!password){
        return res.status(404).send({ msg: "E-mail and password cannot be empty" });
    }else{
        User.findOne({email: email}).then(user=>{
            if(user){
                var passwordIsValid = bcrypt.compareSync(password,user.password);
                if (!passwordIsValid){
                    return res.status(401).send({
                        accessToken: null,
                        msg: "Invalid Password!"
                    });
                }else if(user.deactivated){
                    return res.status(401).send({
                        accessToken: null,
                        msg: "User deactivated, Contact admin@uwo.ca"
                    });
                }else{
                    var token = jwt.sign({ email: user.email }, JWT_SECRET);
                    res.send({
                        name: user.name,
                        accessToken: token
                    })
                }
            }else{
                return res.status(401).send({
                    accessToken: null,
                    msg: "User Not Found!"
                });
            }

        })
    }
});

function parseData(filePath) {
    file = fs.readFileSync(filePath)
    return JSON.parse(file);
}

function verifyToken(req, res){
    let token = req.headers["Authorization"];
  
    if (!token) {
      return res.status(400).send({ message: "No token provided!" });
    }else{
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
              return res.status(400).send({ message: "Unauthorized! Login required" });
            }
            req.email = decoded.email;
        });
    }
}

function isAdmin(req, res){
    User.findOne({email: req.email}).exec((err, user)=>{
        if (err) {
            res.status(500).send({ message: err });
            return;
        }else if(!user.admin){
            return res.status(403).send({ message: "Unautharized! Requires admin privelages" });
        }else{
            return;
        }
    });
}
  