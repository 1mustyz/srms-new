const PaymentType = require('../models/PaymentReason');
const Student = require('../models/Student');
const Payment = require('../models/Payment');

exports.addPaymentTypes = async (req,res,next) => {
    await PaymentType.collection.insertOne(req.body);
    res.json({success: true, message: 'payment type added successfull'})
}

exports.updatePaymentTypes = async (req,res,next) => {
    const {payType} = req.body;
    await PaymentType.collection.updateOne({payType: payType}, {payType: payType});
    res.json({success: true, message: 'payment type updated successfull'})
}

exports.verifyPayment = async (req,res,next) => {
    
    await Payment.collection.insertOne(req.body)
    res.json({success: true, message: 'payment made'})

}

exports.getPayment = async (req,res,next) => {
    const result = await PaymentType.find()
    result
     ? res.json({success: true, message: result})
     : res.json({success: false, message: 'no payment type added'})
    

}