var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
    },
    deactivated: {
        type: Boolean,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true,
    }

});

//hash password before saving it to the database

  var User = mongoose.model('User', UserSchema);
  module.exports = User;