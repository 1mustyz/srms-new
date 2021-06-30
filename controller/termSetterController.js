const TermSetter = require('../models/TermSetter');
const Student = require('../models/Student')
const Curriculum = require('../models/Curriculum');
const Score = require('../models/Score');
const TermResult = require('../models/TermResult');
const SessionResult = require('../models/SessionResult')

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

    // souley's code starts here
    let bulkArr
    const currentSession = await TermSetter.findOne({}, {session: 1})
    // graduate some students
    const students = await Student.find({ status: 'Active' })
    const seniors = students.filter( student => 
        student.currentClass === 'JSS3' || 'SS3' || 'Grade6' || 'Kindergarten3')
    const graduates = seniors.forEach( async (senior) => {
        await Student.findOneAndUpdate(
            { username: senior.username }, 
            { status: 'graduated' })
    })

    // promote some students 
    const juniors = students.filter( student => 
        student.currentClass !== 'Grade6' || 'JSS3' || 'SS3')
    const sessionRecords = juniors.forEach( async (junior) => {
        const termAverages = await TermResult.find({ username: junior.username, session: currentSession.year })
        const average = (termAverages[0].average + termAverages[1].average + termAverages[2].average)/3
        const position = (termAverages[0].position + termAverages[1].position + termAverages[2].position)/3
        const status = average >= 40 ? 'Promoted' : 'Demoted'
        const result = await SessionResult.insertOne({
            average,
            status,
            username: junior.username,
            session: currentSession.year,
            class: junior.currentClass,
            position: position 
        })

        bulkArr.push(result)
    })

    // update student model, to reflect new class for promoted students
    const promotedStudents = await SessionResult.find({
         status: 'Promoted', session: currentSession.year 
        })
    promotedStudents.forEach(async (student) => {
        const newClass = await Student.updateOne({ username: student.username }, 
            { $inc: { classNumber: 1 }}, { new: true })
        const className = 
        newClass.category === 'Grade' ? `Grade${newClass.classNumber}` 
        : newClass.category === 'JSS' ? `JSS${newClass.classNumber}` 
        : newClass.category === 'SSS' ? `SSS${newClass.classNumber}`
        : newClass.category === 'Kindergarten' ? `Kindergarten${newClass.classNumber}`
        : ''
        
        const newClass1 = await Student.updateOne({ username: newClass.username }, 
            { currentClass: className})
    })

    // update session here 

    // create new score sheets for all active students
    let subjects = await Curriculum.find({ })
    const newStudents1 = Student.find({ status: 'Active' })
    newStudents1.forEach( async (student) => {
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
    // Souley's code ends here

}

exports.getSession = async (req,res,next) => {
    const result = await TermSetter.findOne({},{session: 1})
    res.json({success: true, result})

}