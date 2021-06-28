const TermSetter = require('../models/TermSetter');
const Student = require('../models/Student')
const Curriculum = require('../models/Curriculum');
const Score = require('../models/Score');

exports.setNewTerm = async (req,res,next) => {

    const result = await TermSetter.find()

    console.log(result.length)

    result.length == 0
     ? await TermSetter.collection.insertOne({currentTerm: 'First Term', termNumber: 1})
     : ''

    if (result.length > 0){
        const result = await TermSetter.findOne()

        switch (result.termNumber) {
            case 1:
                await TermSetter.updateOne({currentTerm: 'Second Term', termNumber: 2})
                break;
            case 2:
                await TermSetter.updateOne({currentTerm: 'Third Term', termNumber: 3})
                break;
            case 3:
                await TermSetter.updateOne({currentTerm: 'First Term', termNumber: 1})
                break;
            
            default:
                await TermSetter.updateOne({currentTerm: 'First Term', termNumber: 1})
                break;
        }
    }
    
    // find all students that have not graduate 
    const students = await Student.find({ status: 'Active' })
    let subjects = await Curriculum.find({ })
    
    students.forEach( async (student) => {
        // find student class and subjects
        const studentSubjects = subjects.filter( currentELement => {
           return currentELement.name === student.currentClass &&
            currentELement.category === student.category
        })
        // create score document for each student's subject
        const scoreDocuments = studentSubjects[0].subject.map(subject => ({
            subject,
            username: student.username,
            studentId: student._id,
            class: student.currentClass,
            category: student.category,
            firstName: student.firstName,
            lastName: student.lastName,
            username: student.username
        }))
        await Score.insertMany(scoreDocuments)
    })

    res.json({success: true, message: 'new term has been set successfully'})
}

exports.getCurrentTerm = async (req,res,next) => {
    const result = await TermSetter.find()
    res.json({success: true, result})
}

exports.setSession = async (req,res,next) => {
    const {session} = req.body
    const result = await TermSetter.findOne({},{session: 1})
    console.log(result)
    await TermSetter.updateOne({session: session})
    res.json({success: true, message: 'new session has been set successfully'})

}

exports.getSession = async (req,res,next) => {
    const result = await TermSetter.findOne({},{session: 1})
    res.json({success: true, result})

}