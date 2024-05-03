const mongoose = require('mongoose');
// const Subject = require('./subjectModel');
const classSchema = new mongoose.Schema({

    classCode: {
        type: String,
        required: [true, 'Please provide the class name'],
        unique: true
    },
    classTitle:{
        type:String,
        required: [true, 'Please provide the class title'],
    },
    subjects: [{
        subjectName: {
            type: String,
            required: [true, 'Please provide the subject name']
        },
        subjectCode: {
            type: String,
            required: [true, 'Please provide the subject code'],
        }
    }],

})

module.exports = mongoose.model('Class', classSchema)