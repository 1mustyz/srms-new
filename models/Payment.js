const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaySchema = new Schema({

    studentId: {type:String},
    username: {type:String},
    firstName: {type:String},
    lastName: {type:String},
    term : {type:Number},
    teller: {type:Array},
    session: {type:String},
    paid: {type:Boolean},
    className: {type:String},
    purposeOfPayment: {type:Array},


},{timestamps: true})

const Payment = mongoose.model('pay', PaySchema);

module.exports = Payment;