const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//Schema design
const TermSchema = new Schema({
        term: [{
            number: Number,
            subject: [{
                title: String,
                ca1: Number,
                ca2: Number,
                ca3: Number,
                ca4: Number,
                exam: Number,
                grade: String
            }]
        }]
})

const StudentSchema = new Schema({
    username: { type: String, required: true, unique: [ true, 'ID Number already exist' ] },
    image: { type: String, default: '1.jpg' },
    currentClass: { type: String },
    section: { type: String }, // specifies type of student primary, junior or senior
    category: { type: String }, // specifies category for senior school students Science, Art or Null for primary & junior pupils
    
    class: [{
        number: Number,
        term: TermSchema,
    }]
}, { timestamps: true });

//plugin passport-local-mongoose to enable password hashing and salting and simpligy other things
StudentSchema.plugin(passportLocalMongoose);

//connect the schema with user table
const Student = mongoose.model('student', StudentSchema);

//export the model 
module.exports = Student;