const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//Schema design
const StaffSchema = new Schema({
    username: { type: String, required: true, unique: [ true, 'ID Number already exist' ] },
    image: { type: String, default: '1.jpg' },
    email: { type: String },
    role: { type: Array, default: 'none'},
    teach: [{ class: String, subject: String }]
}, { timestamps: true });   

//plugin passport-local-mongoose to enable password hashing and salting and other things
StaffSchema.plugin(passportLocalMongoose);

//connect the schema with user table
const Staff = mongoose.model('staff', StaffSchema);

//export the model 
module.exports = Staff;