var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    course:{
        type: String,
        required: true
    },
    subject:{
        type: Array,
        required: true
    }
});

  var Schedule = mongoose.model('Schedule', ScheduleSchema);
  module.exports = Schedule;