const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const ClassSchema = new Schema({
    class: String,
    section: String
})

const Class = model('class',ClassSchema);
module.exports = Class;