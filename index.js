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
const Schedule = require('./models/Schedules');
const Review = require('./models/Reviews');
const { time } = require('console');
const e = require('express');

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

secure.put('/Schedule/Create', verifyToken, (req,res) =>{
    var name = req.sanitize(req.body.name);
    var desc = req.sanitize(req.body.desc);
    var pairs = req.body.pairs;
    console.log(pairs);
    var ownerName = req.sanitize(req.body.owner);
    var visibility = req.body.visibility;
    Schedule.count({owner: req.email}, (err, count)=>{
        if(err){
            res.status(404);
        }else if(count<20){
            Schedule.findOne({name:name}, (err, doc)=>{
                if(err){
                    res.status(404);
                }else if(doc){
                    res.status(400).send({msg: 'Schedule with this name already exists'})
                }else{
                    let flags = [];
                    let invPairs = []; 
                    let j=0;
                    let message ='pairs do not exist';
                    i=0;

                    pairs.forEach((pair,i)=>{
                        flags[i] = contains(timetableData, "subject", "catalog_nbr", req.sanitize(pair.Subject), req.sanitize(pair.Course));
                        if(!flags[i]){
                            invPairs[j] = {"subject":req.sanitize(pair.Subject), "catalog_nbr":req.sanitize(pair.Course)}
                            j++;
                        }
                        i++
                    });
                    var count = 0;
                    for(let i in invPairs){
                        count++;
                    }
                    if(count>0){
                        invPairs.forEach(pair=>{
                            message = ' "'+pair.subject + ' ' + pair.catalog_nbr + '" ' + message;
                        });
                        console.log(message)
                        return res.status(400).send({msg:`${message}`})
                    }
                    const schedule = new Schedule({
                        owner:req.email,
                        ownerName: ownerName,
                        name: name,
                        courses: pairs,
                        description: desc,
                        visibility: visibility,
                        lastmodified: Date.now()
                    })
                    schedule.save((err, doc)=>{
                        if(err){
                            return res.status(500).send({ msg: err });
                        }else{
                            return res.send({msg: 'Schedule created successfully'});
                        }
                    })
                }
            })
        }else{
            res.status(401).send({msg: 'Maximum number of schedules reached'})
        }
    });
});

secure.post('/Schedule/Modify',verifyToken, (req,res)=>{
    res.send('secured')
})

secure.get('/Schedules', verifyToken, (req,res)=>{
    owner = req.email;
    console.log(owner)
    Schedule.find({owner: owner}, (err, docs)=>{
        if(err){
            res.status(404);
        }else if(docs.length<1){
            res.status(400).send({msg: "You don't have any course lists"})
        }else{
            res.send(docs)
        }
    })
})

secure.get('Courses/Schedule/:Schedule', verifyToken, (req,res)=>{
    res.send('secure')
})
secure.post('/Schedule/Delete/:schedule', verifyToken, (req, res)=>{
    res.send('secure')
})
secure.post('/Review/add', verifyToken, (req,res)=>{
    var reviewer = req.body.reviewer;
    var review = req.body.review;
    var subject = req.body.subject;
    var course = req.body.course;

    flag = contains(timetableData, "subject", "catalog_nbr", subject, course);
    if(flag){
        res.status(400).send({msg:'Course does not exist'})
    }else{
        const doc = new Review({
            review:review,
            reviewer: reviewer,
            subject: subject,
            course: course,
            visibile: true,
            datePosted: Date.now()
        })
        doc.save((err)=>{
            if(err){
                return res.status(500).send({ msg: err });
            }else{
                return res.send({msg: 'Review successfully posted'});
            }
        })
    }
})

restricted.post('/Review/hide',[verifyToken, isAdmin], (req, res)=>{
    res.send('admin')
})
restricted.post('/UpdateUser', [verifyToken, isAdmin], (req, res)=>{
    email=req.body.email;
    admin=req.body.admin;
    deactivated=req.body.deactivated;

    if(deactivated=="true"){
        deactivated=true;
    }else{
        deactivated=false;
    }
    if(admin=="true"){
        admin=true;
    }else{
        admin=false;
    }
    User.findOne({email:email},(err, user)=>{
        if(err){
            res.send('error')
        }else{
            user.deactivated=deactivated;
            user.admin=admin;
            user.save()
            res.send('User updated successfully')
        }
    })
})

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
    res.send(result)
});

open.get('/Review/:course/:subject', async(req,res)=>{
    subject = req.params.subject;
    course = req.params.course;
    Review.find({subject: subject, course:course, visibile:true}, (err, review)=>{
        if(err){
            res.send('error')
        }else{
            res.json(review)
        }
    })
})
open.get('/Users', (req,res)=>{
    User.find({}, (err, users)=>{
        res.send(users)
    })
})
open.get('/Keywords/:course/:class', (req, res)=>{
})

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
                        admin: user.admin,
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

function verifyToken(req, res, next){
    if (!req.headers.authorization) {
      return res.status(400).send({ message: "No token provided!" });
    }else{
        jwt.verify(req.headers.authorization, JWT_SECRET, (err, decoded) => {
            if (err) {
              return res.status(400).send({ message: "Unauthorized! Login required" });
            }
            req.email = decoded.email;
            next();
        });
    }
}

function isAdmin(req, res, next){
    User.findOne({email: req.email}).exec((err, user)=>{
        if (err) {
            res.status(500).send({ message: err });
            return;
        }else if(!user.admin){
            return res.status(403).send({ message: "Unautharized! Requires admin privelages" });
        }else{
            next();
        }
    });
}

function contains(arr, key1, key2, val1, val2) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i][key1] === val1 && arr[i][key2] === val2) return true;
    }
    return false;
}