const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const SubjectSchema = new Schema({
    subject: {
        type: String, 
        unique: true
    }
})

const Subject = model('subject', SubjectSchema)
module.exports = Subject;