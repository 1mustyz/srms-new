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
    const {purposeOfPayment,teller} = req.body;
    const {studentId} = req.query;
    let paid = false

    const result = await Payment.findOne({studentId:studentId},{paid: 1})

    // if (result.paid )

    if(purposeOfPayment.includes('tuition fee')) paid = true

    await Payment.findOneAndUpdate({studentId:studentId},{teller: teller, paid: paid})
    await Payment.findOneAndUpdate({studentId:studentId},
        {$push:{purposeOfPayment: purposeOfPayment.toString()}})
    res.json({success: true, message: 'payment made'})

}

exports.getAllPaidStudent = async (req,res,next) => {
    const result = await Payment.find()

    result.length > 0
     ? res.json({success: true, message: result})
     : res.json({success: true, message: result})
}

exports.getPayment = async (req,res,next) => {
    const result = await PaymentType.find()
    result.length > 0
     ? res.json({success: true, message: result})
     : res.json({success: false, message: result})

}

exports.getPaidAndUnPaidStudent = async (req,res,next) => {

    const allDaycare = await Student.find({currentClass: 'Daycare'}).countDocuments();
    const allDaycarePaidStudent = await Payment.find({className: 'Daycare', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allDaycareUnpaidStudent = allDaycare - allDaycarePaidStudent;


    const allPlayclass = await Student.find({currentClass: 'Playclass'}).countDocuments();
    const allPlayclassPaidStudent = await Payment.find({className: 'Playclass', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allPlayclassUnpaidStudent = allPlayclass - allPlayclassPaidStudent;


    const allKindergartens1 = await Student.find({currentClass: 'Kindergartens1'}).countDocuments();
    const allKindergartens1PaidStudent = await Payment.find({className: 'Kindergartens1', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allKindergartens1UnpaidStudent = allKindergartens1 - allKindergartens1PaidStudent;

    const allKindergartens2 = await Student.find({currentClass: 'Kindergartens2'}).countDocuments();
    const allKindergartens2PaidStudent = await Payment.find({className: 'Kindergartens2', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allKindergartens2UnpaidStudent = allKindergartens2 - allKindergartens2PaidStudent;

    const allKindergartens3 = await Student.find({currentClass: 'Kindergartens3'}).countDocuments();
    const allKindergartens3PaidStudent = await Payment.find({className: 'Kindergartens3', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allKindergartens3UnpaidStudent = allKindergartens3 - allKindergartens3PaidStudent;



    const allGrade1 = await Student.find({currentClass: 'Grade1'}).countDocuments();
    const allGrade1PaidStudent = await Payment.find({className: 'Grade1', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allGrade1UnpaidStudent = allGrade1 - allGrade1PaidStudent;

    const allGrade2 = await Student.find({currentClass: 'Grade2'}).countDocuments();
    const allGrade2PaidStudent = await Payment.find({className: 'Grade2', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allGrade2UnpaidStudent = allGrade2 - allGrade2PaidStudent;

    const allGrade3 = await Student.find({currentClass: 'Grade3'}).countDocuments();
    const allGrade3PaidStudent = await Payment.find({className: 'Grade3', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allGrade3UnpaidStudent = allGrade3 - allGrade3PaidStudent;

    const allGrade4 = await Student.find({currentClass: 'Grade4'}).countDocuments();
    const allGrade4PaidStudent = await Payment.find({className: 'Grade4', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allGrade4UnpaidStudent = allGrade4 - allGrade4PaidStudent;

    const allGrade5 = await Student.find({currentClass: 'Grade5'}).countDocuments();
    const allGrade5PaidStudent = await Payment.find({className: 'Grade5', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allGrade5UnpaidStudent = allGrade5 - allGrade5PaidStudent;

    const allGrade6 = await Student.find({currentClass: 'Grade6'}).countDocuments();
    const allGrade6PaidStudent = await Payment.find({className: 'Grade6', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allGrade6UnpaidStudent = allGrade6 - allGrade6PaidStudent;

    const allJSS1 = await Student.find({currentClass: 'JSS1'}).countDocuments();
    const allJSS1PaidStudent = await Payment.find({className: 'JSS1', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allJSS1UnpaidStudent = allJSS1 - allJSS1PaidStudent;

    const allJSS2 = await Student.find({currentClass: 'JSS2'}).countDocuments();
    const allJSS2PaidStudent = await Payment.find({className: 'JSS2', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allJSS2UnpaidStudent = allJSS2 - allJSS2PaidStudent;

    const allJSS3 = await Student.find({currentClass: 'JSS3'}).countDocuments();
    const allJSS3PaidStudent = await Payment.find({className: 'JSS3', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allJSS3UnpaidStudent = allJSS3 - allJSS3PaidStudent;

    const allSSS1 = await Student.find({currentClass: 'SSS1'}).countDocuments();
    const allSSS1PaidStudent = await Payment.find({className: 'SSS1', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allSSS1UnpaidStudent = allSSS1 - allSSS1PaidStudent;

    const allSSS2 = await Student.find({currentClass: 'SSS2'}).countDocuments();
    const allSSS2PaidStudent = await Payment.find({className: 'SSS2', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allSSS2UnpaidStudent = allSSS2 - allSSS2PaidStudent;

    const allSSS3 = await Student.find({currentClass: 'SSS3'}).countDocuments();
    const allSSS3PaidStudent = await Payment.find({className: 'SSS3', purposeOfPayment: 'tuition fee'}).countDocuments();
    const allSSS3UnpaidStudent = allSSS3 - allSSS3PaidStudent;



    

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