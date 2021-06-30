const mongoose = require('mongoose');
const {Schema,model} = mongoose;


const CognitiveSchema = new Schema({
    username: {type:String},
    studentId: {type:String},
    firstName: {type:String},
    lastName: {type:String},
    neatness: {type:String, default: 'A'},
    punctuality: {type:String, default: 'A'},
    hardWorking: {type:String, default: 'A'},
    remarks: {type:String, default: 'none'},
    term: {type:Number},
    session: {type:String}

})

const Cognitive = model('cognitive', CognitiveSchema)
module.exports = Cognitive;