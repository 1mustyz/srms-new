const mongoose = require('mongoose');
const {Schema,model} = mongoose;


const CognitiveSchema = new Schema({
    username: String,
    studentId: String,
    firstName: String,
    lastName: String,
    cognitive: Object
})

const Cognitive = model('cognitive', CognitiveSchema)
module.exports = Cognitive;