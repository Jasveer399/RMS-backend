const mongoose = require("mongoose");
const Subject = require("./subjectModel");
const Class = require("./classModel")
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the 'Name' field."],
  },
  rollNo: {
    type: String,
    unique: true,
    required: [true, "Please provide the 'rollNo' field."],
  },
  email: {
    type: String,
    required: [true, "Please provide the 'email' field."],
  },
  className: {
    type: String,
    required: [true, "Please provide the 'class' field."],
  },
  gender: {
    type: String,
    required: [true, "Please provide the 'gender' field."],
  },
  phone: {
    type: Number,
    required: [true, "Please provide the 'phone' field."],
  },
  password: {
    type: String,
    required: [true, "Please provide the 'password' field."],
  },
  classCode: {
    type: String,
    ref: Class,
  },
  subjects: {
    type: [String],
    ref: Subject,
  },
  results: {
    type: Array,
  },
});

module.exports = mongoose.model("Student", studentSchema);
