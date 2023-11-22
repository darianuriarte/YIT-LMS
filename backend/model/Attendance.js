const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
    required: true
  },
  term1: {
    present: Number,
    absent: Number,
    percentageAttended: Number,
    totalSessions: Number,
    hoursOfTutoringReceived: Number
  },
  term2: {
    present: Number,
    absent: Number,
    percentageAttended: Number,
    totalSessions: Number,
    hoursOfTutoringReceived: Number
  },
  term3: {
    present: Number,
    absent: Number,
    percentageAttended: Number,
    totalSessions: Number,
    hoursOfTutoringReceived: Number
  },
  term4: {
    present: Number,
    absent: Number,
    percentageAttended: Number,
    totalSessions: Number,
    hoursOfTutoringReceived: Number
  },
  overallAttendance: {
    present: Number,
    absent: Number,
    percentageAttended: Number,
    totalSessions: Number,
    totalHoursOffered: Number,
    hoursOfTutoringReceived: Number
  },
  weeklyAttendance: {
    absent: Number,
    percentageAttended: Number,
    present: Number,
    totalSessions: Number,
    hoursOfTutoringReceived: Number,
  }
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
