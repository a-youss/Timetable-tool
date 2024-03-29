var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    ownerName:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    name:{
        type: String,
        required: true
    },
    courses:[{
        type: Object,
        required:true
    }],
    visibility:{
        type: String,
        required: true

    },
    lastmodified:{
        type: Date
    }

});

  var Schedule = mongoose.model('Schedule', ScheduleSchema);
  module.exports = Schedule;