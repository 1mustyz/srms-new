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

        const termAndSession = await TermSetter.find()
        // create score document for each student's subject
        console.log(studentSubjects[0])
        const scoreDocuments = studentSubjects[0].subject.map(subject => ({
            subject, 
            username: user.username,
            studentId: user._id,
            class: user.currentClass,
            category: user.category,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            term: termAndSession[0].termNumber,
            session: termAndSession[0].session.year
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

    // souley's code starts here
    const currentSession = await TermSetter.findOne({}, {session: 1})
    // graduate some students
    const students = await Student.find({ status: 'Active' })
    const seniors = students.filter( student => 
           student.currentClass === 'JSS3' 
        || student.currentClass === 'SSS3' 
        || student.currentClass ==='Grade6' 
        || student.currentClass ==='Kindergarten3')

    seniors.forEach( async (senior) => {
        await Student.findOneAndUpdate(
            { username: senior.username }, 
            { status: 'graduated' },
            { useFindAndModify: false })
        })

    // promote some students 
    const juniors = students.filter( student => 
        student.currentClass !== 'JSS3' 
        || student.currentClass !== 'SSS3' 
        || student.currentClass !=='Grade6' 
        || student.currentClass !=='Kindergarten3')

    juniors.forEach( async (junior) => {
        const termAverages = await TermResult.find({
              username: junior.username,
              session: currentSession.session.year 
            })
        const termAverage1 = termAverages[0].average === undefined ? 0 : termAverages[0].average
        const termAverage2 = termAverages[1].average === undefined ? 0 : termAverages[1].average
        const termAverage3 = termAverages[2].average === undefined ? 0 : termAverages[2].average
        const average = (termAverage1 + termAverage2 + termAverage3)/3
        const position = (termAverages[0].position + termAverages[1].position + termAverages[2].position)/3
        const status = average >= 40 ? 'Promoted' : 'Demoted'
        const result = await SessionResult.collection.insertOne({
            average,
            status,
            username: junior.username,
            session: currentSession.session.year,
            class: junior.currentClass,
            position: position 
        })     
    })

    // update student model, to reflect new class for promoted students
    const promotedStudents = await SessionResult.find({
         status: 'Promoted', session: currentSession.session.year 
        })

    promotedStudents.forEach(async (student) => {
        await Student.updateOne({ 
            username: student.username }, 
            { $inc: { classNumber: 1 }}, 
            { new: true })      
    })

    const allStudent = await Student.find()

    const newPromotedStudents1 = promotedStudents.map(student => {
        return allStudent.filter(promoted => student.username === promoted.username)
        })

    newPromotedStudents1.forEach(async (student) => {
        const className = 
        student[0].section === 'Grade' ? `Grade${student[0].classNumber}` 
      : student[0].section === 'JSS' ? `JSS${student[0].classNumber}` 
      : student[0].section === 'SSS' ? `SSS${student[0].classNumber}`
      : student[0].section === 'Kindergarten' ? `Kindergarten${student[0].classNumber}`
      : ''
  
    await Student.updateOne({ username: student[0].username }, 
          { $set: {currentClass: className } }, { new: true })  
        })

    // update session here 
    const {session} = req.body
    await TermSetter.updateOne({session: session})

    // create new score sheets for all active students
    let subjects = await Curriculum.find({ })
    const newStudents1 = await Student.find({ status: 'Active' })

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
            username: student.username,
            term: currentSession.term,
            session: currentSession.session.year
        }))
        await Score.insertMany(scoreDocuments)
    })

    res.json({ success: true, message: 'session set successfully' })
    // Souley's code ends here

}

exports.getSession = async (req,res,next) => {
    const result = await TermSetter.findOne({},{session: 1})
    res.json({success: true, result})

}