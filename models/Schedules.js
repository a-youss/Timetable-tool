var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    courses:{
        type: Array
    },
    access:{
        type: String
    }

});

  var Schedule = mongoose.model('Schedule', ScheduleSchema);
  module.exports = Schedule;