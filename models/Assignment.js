const mongoose = require('mongoose');
const {Shcema, model} = mongoose;


const AssignmentSchema = new Schema({
    username: {type: String},
    staffId: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    class: {type: String},
    category: {type: String},
    
})