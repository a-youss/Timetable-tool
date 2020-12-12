const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
 });
 