const Staff = require('../models/Staff')
const Score = require('../models/Score')
const { updateMany } = require('../models/Staff')

exports.fetchTeacherSubjects = async (req, res) => {
    const teacher = await Staff.findById(req.query.id)
    res.json({subjects: teacher.teach})
}

exports.fetchStudentsInClass = async (req, res) => {
   const students = 
       await Score.find({ 
        class: req.body.class,
        subject: req.body.subject,
        category: req.body.category
     })

   res.json({ success: true, students })
}

exports.liveSaveResult = async (req, res) => {
    const field = req.body.key
    const score = await Score.findByIdAndUpdate(req.body.id, {
        [field]: req.body.value
    }, {new: true, useFindAndModify: false})

    res.json({ success: true, score })
}

// exports.saveAndContinue = async (req, res) => {
//     const input = req.body
//     let bulkArr = [];

//     for (const i of input) {
//         bulkArr.push({
//             updateOne: {
//                 "filter": { "_id": i._id },
//                 "update": { 
//                      ca1: i.ca1, ca2: i.ca2,
//                      ca3: i.ca3, exam: i.exam }
//             }
//         })
//     }

//     const scores = await Score.bulkWrite(bulkArr)
//     res.json({ success: true, scores })

// }

// exports.finalSaveResult = async (req, res) => {
//     const input = req.body
//     let bulkArr = [];

//     for (const i of input) {
//         bulkArr.push({
//             updateOne: {
//                 "filter": { "_id": i._id },
//                 "update": { 
//                     ca1: i.ca1, ca2: i.ca2,
//                     ca3: i.ca3, exam: i.exam, 
//                     finalSubmitted: true }
//             }
//         })
//     }

//     const scores = await Score.bulkWrite(bulkArr)
//     res.json({ success: true, scores })
// }

// todo 
// insertMany({condition}, {isFinalSubmitted: true})

