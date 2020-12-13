var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    course:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    reviewer:{
        type: String,
        required: true
    },
    visibile:{
        type: Boolean,
        required: true
    },
    datePosted:{
        type: Date,
        required: true
    }
});

  var Review = mongoose.model('Review', ReviewSchema);
  module.exports = Review;