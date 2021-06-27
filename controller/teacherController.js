const Staff = require('../models/Staff')
const Score = require('../models/Score')
const TermResult = require('../models/TermResult')
const TermSetter = require('../models/TermSetter')
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
    const value = req.body.value
    const username = req.body.username
    const currentClass = req.body.currentClass
    const termAndSession = await TermSetter.find()
    
    
    const score = await Score.findByIdAndUpdate(req.body.id, {
        [field]: req.body.value
    }, {new: true, useFindAndModify: false})
    
    const result = await Score.findById(req.body.id)
    let ca1 = result.ca1;
    let ca2 = result.ca2;
    let ca3 = result.ca3;
    let ca4 = result.ca4;
    let exam = result.exam;

    let total = ca1 + ca2 + ca3 + ca4 + exam;
    await Score.findByIdAndUpdate(req.body.id, {total: total})
    const upScore = await Score.findById(req.body.id)
    
    
    const allStudentTotal = await Score.find({username: username},{total: 1})

    let sumTotal = allStudentTotal.reduce((a,b)=>(a.total+b.total))
    let noOfCourses = allStudentTotal.length;
    let average = sumTotal/noOfCourses
    console.log(average,sumTotal,noOfCourses)
    
    await TermResult.findOneAndUpdate({
        username: req.body.username
    },{
        total: sumTotal, average: average
    })
        
    const allStudentInAclass = await TermResult.find({
        class: currentClass
    },{
        average: 1
    })

    allStudentInAclass.sort((a,b) => {
        return b.average - a.average 
    })
    
 const currentPosition = allStudentInAclass.map((students,ind)=>{
        return studentIdentity={
           average:students.average,
           id:students.id,
           position:ind+1
        }
        
    })
    const finalResult = currentPosition.map( async (students,ind)=>{
        await TermResult.findByIdAndUpdate(students.id, {position: students.position})
    })
            // console.log(finalResult)
            res.json({ success: true, upScore})


    
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

