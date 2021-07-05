const TermSetter = require('../models/TermSetter');
const Student = require('../models/Student')
const Curriculum = require('../models/Curriculum');
const Score = require('../models/Score');
const TermResult = require('../models/TermResult');
const SessionResult = require('../models/SessionResult')
const Payment = require('../models/Payment');
const Cognitive = require('../models/Cognigtive');

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
        // console.log('1111111111111111111',studentSubjects)
        // console.log('----------------',students)

        const scoreDocuments = studentSubjects[0].subject.map(subject => {
           students.map(async (std) => {
            //    console.log('///////////////',subject)
               await Score.collection.insertOne({
                subject, 
                username: std.username,
                studentId: std._id,
                class: std.currentClass,
                category: std.category,
                firstName: std.firstName,
                lastName: std.lastName,
                username: std.username,
                term: termAndSession[0].termNumber,
                session: termAndSession[0].session.year
            })

            })
           
        })

          // creating a new school payment
          await Payment.collection.insertOne({
            studentId: student._id,
            username: student.username,
            firstname: student.firstName,
            lastName: student.lastName,
            paid: false,
            term: termAndSession[0].termNumber,
            session: termAndSession[0].session.year,
            className: student.currentClass
          })

          // creating a new cognitive data
        await Cognitive.collection.insertOne({
            username: student.username,
            studentId: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            class: student.currentClass,
            category: student.category,
            neatness: '',
            punctuality: '',
            hardWorking: '',
            remarks: '',
            term: termAndSession[0].termNumber,
            session: termAndSession[0].session.year,
        })
    })

    // creating a term result
    const termAndSession = await TermSetter.find()

    const newTermResult = students.map(std => {
        const studentSubjects = subjects.filter( currentELement => {
            return currentELement.name === std.currentClass &&
             currentELement.category === std.category
         })
        return {
            username: std.username,
            studentId: std._id,
            class: std.currentClass,
            noOfCourse: studentSubjects[0].subject.length,
            term: termAndSession[0].termNumber,
            session: termAndSession[0].session.year
        }
    })
    await TermResult.insertMany(newTermResult)


    res.json({success: true, message: 'new term has been set successfully'})
}

exports.getCurrentTerm = async (req,res,next) => {
    const result = await TermSetter.find()
    res.json({success: true, result})
}

exports.setSession = async (req,res,next) => {

    // souley's code starts here
    const termAndSession = await TermSetter.find()
    // // graduate some students
    const students = await Student.find({ status: 'Active' })
    const seniors = students.filter( student => 
           student.currentClass === 'JSS3' 
        || student.currentClass === 'SSS3' 
        || student.currentClass ==='Grade5' 
        || student.currentClass ==='Kindergarten3')

        
    seniors.forEach( async (senior) => {
        await Student.findOneAndUpdate(
            { username: senior.username }, 
            { status: 'graduated' },
            { useFindAndModify: false })
        })

    // // // promote some students 
    const juniors = students.filter( student => 
        student.currentClass !== 'JSS3' 
        || student.currentClass !== 'SSS3' 
        || student.currentClass !=='Grade5' 
        || student.currentClass !=='Kindergarten3')

    // console.log(juniors)    

    juniors.forEach( async (junior) => {
        const termAverages = await TermResult.find({
              username: junior.username,
              session: termAndSession[0].session.year 
            })
            const termAverage1 = termAverages[0].average === undefined ? 0 : termAverages[0].average
            const termAverage2 = termAverages[1].average === undefined ? 0 : termAverages[1].average
            const termAverage3 = termAverages[2].average === undefined ? 0 : termAverages[2].average
            const average = (termAverage1 + termAverage2 + termAverage3)/3
            
            const position1 = termAverages[0].position === undefined ? 0 : parseInt(termAverages[0].position)
            const position2 = termAverages[1].position === undefined ? 0 : parseInt(termAverages[1].position)
            const position3 = termAverages[2].position === undefined ? 0 : parseInt(termAverages[2].position)

            const position = (position1 + position2 + position3)/3
            // console.log(position)
            
        const status = average >= 40 ? 'Promoted' : 'Demoted'
        await SessionResult.collection.insertOne({
            average,
            status,
            username: junior.username,
            session: termAndSession[0].session.year,
            class: junior.currentClass,
            position 
        })     
    })

    // // update student model, to reflect new class for promoted students

    const promotedStudents = await SessionResult.find({
         status: 'Promoted', session: termAndSession[0].session.year 
        })

    promotedStudents.forEach(async (student) => {
        await Student.updateOne({ 
            username: student.username }, 
            { $inc: { classNumber: 1 }}, 
            { new: true }) 
        
        const singleStudent = await Student.find({username: student.username })
        console.log(singleStudent)

        
        switch (singleStudent[0].section) {
            case 'Grade':
                className = `Grade${singleStudent[0].classNumber}`
                break;
        
            case 'JSS':
                className = `JSS${singleStudent[0].classNumber}`
                break;
        
            case 'SSS':    
                className = `SSS${singleStudent[0].classNumber}`
                break;
                       
            case 'Kindergarten':    
                className = `Kindergarten${singleStudent[0].classNumber}`
                break;    
                      
        
            default:
                break;
        }
        console.log(className)
        await Student.updateOne({ username: singleStudent[0].username }, 
                  { $set: {currentClass: className } }, { new: true })  
            
    })


    
    // // update session here 
    const {session} = req.body
    await TermSetter.updateOne({
        session: session,
        termNumber: 1,
        currentTerm: 'First Term'

    
    })

    const newTermAndSession = await TermSetter.find()
    console.log(newTermAndSession)

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
            term: newTermAndSession[0].termNumber,
            session: newTermAndSession[0].session.year
        }))
        await Score.insertMany(scoreDocuments)

        // creating a new school payment
        await Payment.collection.insertOne({
            studentId: student._id,
            username: student.username,
            firstname: student.firstName,
            lastName: student.lastName,
            paid: false,
            term: newTermAndSession[0].termNumber,
            session: newTermAndSession[0].session.year,
            className: student.currentClass
          })

        // creating a new cognitive data
        await Cognitive.collection.insertOne({
            username: student.username,
            studentId: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            class: student.currentClass,
            category: student.category,
            neatness: '',
            punctuality: '',
            hardWorking: '',
            remarks: '',
            term: newTermAndSession[0].termNumber,
            session: newTermAndSession[0].session.year,
        })  

            // creating a new term result
        await TermResult.collection.insertOne({
            studentId: student._id,
            username: student.username,
            class: student.currentClass,
            noOfCourse: 0,
            term: newTermAndSession[0].termNumber,
            session: newTermAndSession[0].session.year,
        })
    })

    




    res.json({ success: true, message: 'session set successfully' })
    // Souley's code ends here

}

exports.getSession = async (req,res,next) => {
    const result = await TermSetter.findOne({},{session: 1})
    res.json({success: true, result})

}