const PaymentType = require('../models/PaymentReason');
const Student = require('../models/Student');
const Payment = require('../models/Payment');
const TermSetter = require('../models/TermSetter')

exports.addPaymentTypes = async (req,res,next) => {
    await PaymentType.collection.insertOne(req.body);
    res.json({success: true, message: 'payment type added successfull'})
}

exports.updatePaymentTypes = async (req,res,next) => {
    const {paymentTypes, newPaymentTypes} = req.body;
    await PaymentType.collection.updateOne(
        { paymentTypes: paymentTypes }, 
        { $set: { paymentTypes: newPaymentTypes } });
    res.json({success: true, message: 'payment type updated successfull'})
}

exports.verifyPayment = async (req,res,next) => {
    const termAndSession = await TermSetter.find()
    const { purposeOfPayment } = req.body.pays;
    const { username } = req.query
    let query = {}

    // find if purpose of payment has tuition fee or all to add paid for the student
    const found = purposeOfPayment.find(payment => payment.purposeOfPayment == "Tution" || payment.purposeOfPayment == "All");
  
   if (found)
   {
    query.data = [{
        username,
        term: termAndSession[0].termNumber,
        session:
        termAndSession[0].session.year
     },
     {
        $set: { paid: true }, $addToSet: { "pays": { $each: purposeOfPayment } }
     }
]
   } 
   else
   {
    query.data = [{
        username,
        term: termAndSession[0].termNumber,
        session:
        termAndSession[0].session.year
     },
    {
        $addToSet: { "pays" : { $each: purposeOfPayment } }
    }
    ]
   }

   await Payment.collection.updateOne(query.data[0], query.data[1])
   res.json({success: true, message: 'payment made'})

}

exports.getSingleStudentPayment = async (req,res,next) => {
    const {username,term} = req.query
    const termAndSession = await TermSetter.find()

    const result = await Payment.findOne({
        username,
        term,
        session: termAndSession[0].session.year
    })


    res.json({success: true, result})
}

exports.getAllPaidStudent = async (req,res,next) => {
    const termAndSession = await TermSetter.find()
    console.log(termAndSession)

    const {studentId} = req.query;

    const result = await Payment.find({paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false})

    res.json({success: true, message: result})
}

exports.getAllUnPaidStudent = async (req,res,next) => {
    const termAndSession = await TermSetter.find()

    const {studentId} = req.query;

    const result = await Payment.find({
        paid: false,
        suspend: false,
        session: termAndSession[0].session.year, 
        term: termAndSession[0].termNumber, 
        })

    res.json({success: true, message: result})
     
}

exports.getPayment = async (req,res,next) => {
    const result = await PaymentType.find()
    result.length > 0
     ? res.json({success: true, message: result})
     : res.json({success: false, message: result})

}

exports.getAllPaidAndUnPaidStudent = async (req,res,next) => {
    const termAndSession = await TermSetter.find()

    const unPaid = await Payment.find({paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false})
    const paid = await Payment.find({paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false})

    unPaid.length > 0 && paid.length > 0
     ? res.json({success: true, message: [...unPaid,...paid]})
     : res.json({success: false, message: [...unPaid,...paid]})
}
exports.getPaidAndUnPaidStudent = async (req,res,next) => {
    const termAndSession = await TermSetter.find()

    const allDaycarePaidStudent = await Payment.find({className: 'Daycare', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allDaycareUnpaidStudent = await Payment.find({className: 'Daycare', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allPlayclassPaidStudent = await Payment.find({className: 'Playclass', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allPlayclassUnpaidStudent = await Payment.find({className: 'Playclass', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allKindergartens1PaidStudent = await Payment.find({className: 'Kindergarten1', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allKindergartens1UnpaidStudent = await Payment.find({className: 'Kindergarten1', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allKindergartens2PaidStudent = await Payment.find({className: 'Kindergarten2', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allKindergartens2UnpaidStudent = await Payment.find({className: 'Kindergarten2', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allKindergartens3PaidStudent = await Payment.find({className: 'Kindergarten3', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allKindergartens3UnpaidStudent = await Payment.find({className: 'Kindergarten3', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();



    const allGrade1PaidStudent = await Payment.find({className: 'Grade1', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allGrade1UnpaidStudent = await Payment.find({className: 'Grade1', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allGrade2PaidStudent = await Payment.find({className: 'Grade2', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allGrade2UnpaidStudent = await Payment.find({className: 'Grade2', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allGrade3PaidStudent = await Payment.find({className: 'Grade3', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allGrade3UnpaidStudent =  await Payment.find({className: 'Grade3', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allGrade4PaidStudent = await Payment.find({className: 'Grade4', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allGrade4UnpaidStudent = await Payment.find({className: 'Grade4', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allGrade5PaidStudent = await Payment.find({className: 'Grade5', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allGrade5UnpaidStudent = await Payment.find({className: 'Grade5', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();;

    const allJSS1PaidStudent = await Payment.find({className: 'JSS1', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allJSS1UnpaidStudent = await Payment.find({className: 'JSS1', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allJSS2PaidStudent = await Payment.find({className: 'JSS2', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allJSS2UnpaidStudent = await Payment.find({className: 'JSS2', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allJSS3PaidStudent = await Payment.find({className: 'JSS3', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allJSS3UnpaidStudent = await Payment.find({className: 'JSS3', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allSSS1PaidStudent = await Payment.find({className: 'SSS1', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allSSS1UnpaidStudent = await Payment.find({className: 'SSS1', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allSSS2PaidStudent = await Payment.find({className: 'SSS2', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allSSS2UnpaidStudent = await Payment.find({className: 'SSS2', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();

    const allSSS3PaidStudent = await Payment.find({className: 'SSS3', paid: true, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();
    const allSSS3UnpaidStudent =  await Payment.find({className: 'SSS3', paid: false, session: termAndSession[0].session.year, term: termAndSession[0].termNumber, suspend: false}).countDocuments();



    

    res.json([
        {class: 'Daycare', paid: allDaycarePaidStudent, unPaid: allDaycareUnpaidStudent},
        {class: 'Playclass', paid: allPlayclassPaidStudent, unPaid: allPlayclassUnpaidStudent},

        {class: 'Kindergarten1', paid: allKindergartens1PaidStudent, unPaid: allKindergartens1UnpaidStudent},
        {class: 'Kindergarten2', paid: allKindergartens2PaidStudent, unPaid: allKindergartens2UnpaidStudent},
        {class: 'Kindergarten3', paid: allKindergartens3PaidStudent, unPaid: allKindergartens3UnpaidStudent},
        
        {class: 'Grade1', paid: allGrade1PaidStudent, unPaid: allGrade1UnpaidStudent},
        {class: 'Grade2', paid: allGrade2PaidStudent, unPaid: allGrade2UnpaidStudent},
        {class: 'Grade3', paid: allGrade3PaidStudent, unPaid: allGrade3UnpaidStudent},
        {class: 'Grade4', paid: allGrade4PaidStudent, unPaid: allGrade4UnpaidStudent},
        {class: 'Grade5', paid: allGrade5PaidStudent, unPaid: allGrade5UnpaidStudent},
        {class: 'JSS1', paid: allJSS1PaidStudent, unPaid: allJSS1UnpaidStudent},
        {class: 'JSS2', paid: allJSS2PaidStudent, unPaid: allJSS2UnpaidStudent},
        {class: 'JSS3', paid: allJSS3PaidStudent, unPaid: allJSS3UnpaidStudent},
        {class: 'SSS1', paid: allSSS1PaidStudent, unPaid: allSSS1UnpaidStudent},
        {class: 'SSS2', paid: allSSS2PaidStudent, unPaid: allSSS2UnpaidStudent},
        {class: 'SSS3', paid: allSSS3PaidStudent, unPaid: allSSS3UnpaidStudent}



    ]);
}