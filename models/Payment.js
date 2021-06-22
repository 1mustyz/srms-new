const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaySchema = new Schema({

    studentId: {type: String, default: 'my id'},
    studentName: String,
    term : String,
    teller: String,
    className: String,
    purposeOfPayment: Array,


},{timestamps: true})

const Payment = mongoose.model('pay', PaySchema);

module.exports = Payment;