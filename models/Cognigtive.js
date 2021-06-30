const mongoose = require('mongoose');
const {Schema,model} = mongoose;


const CognitiveSchema = new Schema({
    username: String,
    studentId: String,
    firstName: String,
    lastName: String,
    neatness: String,
    punctuality: String,
    hardWorking: String,
    remarks: String,
    term: Number,
    session: String

})

const Cognitive = model('cognitive', CognitiveSchema)
module.exports = Cognitive;