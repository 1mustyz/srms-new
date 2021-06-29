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
    const {purposeOfPayment,teller} = req.body.pays;
    const {username} = req.query;
    let paid = false

    const result = await Payment.findOne({"username": username})

    if (result.paid && (purposeOfPayment.includes('tuition fee') || purposeOfPayment.includes('all'))){
    res.json({success: true, message: 'you have paid for tuition fee'})

    }else{
        console.log(result)
    if(purposeOfPayment.includes('tuition fee') || purposeOfPayment.includes('all')) paid = true

    await Payment.findOneAndUpdate({"username": username},{"pays": req.body.pays})
    await Payment.findOneAndUpdate({"username": username},{"paid": paid})

    
    res.json({success: true, message: 'payment made'})
    }
    

}

exports.getAllPaidStudent = async (req,res,next) => {
    const {studentId} = req.query;

    const result = await Payment.find({paid: true})

    result.length > 0
     ? res.json({success: true, message: result})
     : res.json({success: false, message: result})
}

exports.getAllUnPaidStudent = async (req,res,next) => {
    const {studentId} = req.query;

    const result = await Payment.find({paid: false})

    result.length > 0
     ? res.json({success: true, message: result})
     : res.json({success: false, message: result})
}

exports.getPayment = async (req,res,next) => {
    const result = await PaymentType.find()
    result.length > 0
     ? res.json({success: true, message: result})
     : res.json({success: false, message: result})

}

exports.getAllPaidAndUnPaidStudent = async (req,res,next) => {
    const unPaid = await Payment.find({paid: false})
    const paid = await Payment.find({paid: true})

    unPaid.length > 0 && paid.length > 0
     ? res.json({success: true, message: [...unPaid,...paid]})
     : res.json({success: false, message: [...unPaid,...paid]})
}
exports.getPaidAndUnPaidStudent = async (req,res,next) => {

    const allDaycarePaidStudent = await Payment.find({className: 'Daycare', paid: true}).countDocuments();
    const allDaycareUnpaidStudent = await Payment.find({className: 'Daycare', paid: false}).countDocuments();

    const allPlayclassPaidStudent = await Payment.find({className: 'Playclass', paid: true}).countDocuments();
    const allPlayclassUnpaidStudent = await Payment.find({className: 'Playclass', paid: false}).countDocuments();

    const allKindergartens1PaidStudent = await Payment.find({className: 'Kindergartens1', paid: true}).countDocuments();
    const allKindergartens1UnpaidStudent = await Payment.find({className: 'Kindergartens1', paid: false}).countDocuments();

    const allKindergartens2PaidStudent = await Payment.find({className: 'Kindergartens2', paid: true}).countDocuments();
    const allKindergartens2UnpaidStudent = await Payment.find({className: 'Kindergartens2', paid: false}).countDocuments();

    const allKindergartens3PaidStudent = await Payment.find({className: 'Kindergartens3', paid: true}).countDocuments();
    const allKindergartens3UnpaidStudent = await Payment.find({className: 'Kindergartens3', paid: false}).countDocuments();



    const allGrade1PaidStudent = await Payment.find({className: 'Grade1', paid: true}).countDocuments();
    const allGrade1UnpaidStudent = await Payment.find({className: 'Grade1', paid: false}).countDocuments();

    const allGrade2PaidStudent = await Payment.find({className: 'Grade2', paid: true}).countDocuments();
    const allGrade2UnpaidStudent = await Payment.find({className: 'Grade2', paid: false}).countDocuments();

    const allGrade3PaidStudent = await Payment.find({className: 'Grade3', paid: true}).countDocuments();
    const allGrade3UnpaidStudent =  await Payment.find({className: 'Grade3', paid: false}).countDocuments();

    const allGrade4PaidStudent = await Payment.find({className: 'Grade4', paid: true}).countDocuments();
    const allGrade4UnpaidStudent = await Payment.find({className: 'Grade4', paid: false}).countDocuments();

    const allGrade5PaidStudent = await Payment.find({className: 'Grade5', paid: true}).countDocuments();
    const allGrade5UnpaidStudent = await Payment.find({className: 'Grade5', paid: false}).countDocuments();;

    const allGrade6PaidStudent = await Payment.find({className: 'Grade6', paid: true}).countDocuments();
    const allGrade6UnpaidStudent = await Payment.find({className: 'Grade6', paid: false}).countDocuments();

    const allJSS1PaidStudent = await Payment.find({className: 'JSS1', paid: true}).countDocuments();
    const allJSS1UnpaidStudent = await Payment.find({className: 'JSS1', paid: false}).countDocuments();

    const allJSS2PaidStudent = await Payment.find({className: 'JSS2', paid: true}).countDocuments();
    const allJSS2UnpaidStudent = await Payment.find({className: 'JSS2', paid: false}).countDocuments();

    const allJSS3PaidStudent = await Payment.find({className: 'JSS3', paid: true}).countDocuments();
    const allJSS3UnpaidStudent = await Payment.find({className: 'JSS3', paid: false}).countDocuments();

    const allSSS1PaidStudent = await Payment.find({className: 'SSS1', paid: true}).countDocuments();
    const allSSS1UnpaidStudent = await Payment.find({className: 'SSS1', paid: false}).countDocuments();

    const allSSS2PaidStudent = await Payment.find({className: 'SSS2', paid: true}).countDocuments();
    const allSSS2UnpaidStudent = await Payment.find({className: 'SSS2', paid: false}).countDocuments();

    const allSSS3PaidStudent = await Payment.find({className: 'SSS3', paid: true}).countDocuments();
    const allSSS3UnpaidStudent =  await Payment.find({className: 'SSS3', paid: false}).countDocuments();



    

    res.json([
        {class: 'Daycare', paid: allDaycarePaidStudent, unPaid: allDaycareUnpaidStudent},
        {class: 'Playclass', paid: allPlayclassPaidStudent, unPaid: allPlayclassUnpaidStudent},

        {class: 'Kindergartens1', paid: allKindergartens1PaidStudent, unPaid: allKindergartens1UnpaidStudent},
        {class: 'Kindergartens2', paid: allKindergartens2PaidStudent, unPaid: allKindergartens2UnpaidStudent},
        {class: 'Kindergartens3', paid: allKindergartens3PaidStudent, unPaid: allKindergartens3UnpaidStudent},
        
        {class: 'Grade1', paid: allGrade1PaidStudent, unPaid: allGrade1UnpaidStudent},
        {class: 'Grade2', paid: allGrade2PaidStudent, unPaid: allGrade2UnpaidStudent},
        {class: 'Grade3', paid: allGrade3PaidStudent, unPaid: allGrade3UnpaidStudent},
        {class: 'Grade4', paid: allGrade4PaidStudent, unPaid: allGrade4UnpaidStudent},
        {class: 'Grade5', paid: allGrade5PaidStudent, unPaid: allGrade5UnpaidStudent},
        {class: 'Grade6', paid: allGrade6PaidStudent, unPaid: allGrade6UnpaidStudent},
        {class: 'JSS1', paid: allJSS1PaidStudent, unPaid: allJSS1UnpaidStudent},
        {class: 'JSS2', paid: allJSS2PaidStudent, unPaid: allJSS2UnpaidStudent},
        {class: 'JSS3', paid: allJSS3PaidStudent, unPaid: allJSS3UnpaidStudent},
        {class: 'SSS1', paid: allSSS1PaidStudent, unPaid: allSSS1UnpaidStudent},
        {class: 'SSS2', paid: allSSS2PaidStudent, unPaid: allSSS2UnpaidStudent},
        {class: 'SSS3', paid: allSSS3PaidStudent, unPaid: allSSS3UnpaidStudent}



    ]);
}