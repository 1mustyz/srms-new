const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const ClassSchema = new Schema({
    className: { 
        type: String, 
        unique: true
    },
    section: { 
        type: String, 
    },
})

const Class = model('class',ClassSchema);
module.exports = Class;