const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaySchema = new Schema({

    studentId: {type: String, default: 'my id'},

    payment: {
        name:{
            paid:Boolean
        }},
})

const Payment = mongoose.model('pay', PaySchema);

module.exports = Payment;