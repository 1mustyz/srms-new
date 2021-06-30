const mongoose = require('mongoose');
const {Schema,model} = mongoose;


const CognitiveSchema = new Schema({
    username: String,
    studentId: String,
    firstName: String,
    lastName: String,
    neatness: {type:String, default: 'A'},
    punctuality: {type:String, default: 'A'},
    hardWorking: {type:String, default: 'A'},
    remarks: {type:String, default: 'none'},
    term: Number,
    session: String

})

const Cognitive = model('cognitive', CognitiveSchema)
module.exports = Cognitive;