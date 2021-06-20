const Staff = require('../models/Staff')
const Score = require('../models/Score')

exports.fetchTeacherSubjects = async (req, res) => {
    const teacher = await Staff.findById(id)
    res.json({ subjects: teacher.teach})
}

exports.fetchStudentsInClass = async (req, res) => {
   const students = 
       await Score.find({ 
       term: 'term', class: 'class',
       subject: 'subject', status: 'active' })

   res.json({ success: true, students })
}

exports.insertResult = async (req, res) => {
    const field = req.body.key
    const score = await Score.findByIdAndUpdate(req.body.id, {
        [field]: req.body.value
    })

    res.json({ success: true, score })
}

exports.insertManyResults = async (req, res) => {
    const input = req.body
    let bulkArr = [];

    for (const i of input) {
        bulkArr.push({
            updateOne: {
                "filter": { "_id": i._id },
                "update": { ca1: i.ca1, ca2: i.ca2, ca3: i.ca3, exam: i.exam }
            }
        })
    }

    const scores = await Score.bulkWrite(bulkArr)
    res.json({ success: true, scores })

}

