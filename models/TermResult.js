const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TermResultSchema = new Schema({
    username: { type:String},
    studentId: { type:String},
    class: { type:String},
    average: { type: Number, default: 0},
    total: { type: Number, default: 0},
    noOfCourse: { type: Number, default: 0},
    position: { type:String},
    term: { type:String},
    session: { type:String}
})

const TermResult = model('termResult',TermResultSchema)
module.exports = TermResult