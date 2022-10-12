const TermSetter = require('../models/TermSetter');
const Student = require('../models/Student')
const Curriculum = require('../models/Curriculum');
const Score = require('../models/Score');
const TermResult = require('../models/TermResult');
const SessionResult = require('../models/SessionResult')
const Payment = require('../models/Payment');
const Cognitive = require('../models/Cognigtive');
const AddSession = require('../models/AddSession')

exports.setNewTerm = async (req,res,next) => {

    const result = await TermSetter.find()

    console.log(result[0].termNumber)

    result.length == 0
     ? await TermSetter.collection.insertOne({currentTerm: 'First Term', termNumber: 1})
     : ''

    if (result.length > 0){

        switch (result[0].termNumber) {
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

    const students = await Student.find({ status: 'Active', suspend: false })
    let subjects = await Curriculum.find({ })
    students.forEach( async (student) => {

        // get the student subject
        const studentSubjects = await Curriculum.find(
            { 'name': student.currentClass, 'category': student.category},
            { 'subject': 1, _id: 0})
     

        const termAndSession = await TermSetter.find()

        // create score document for each student's subject
        const scoreDocuments = studentSubjects[0]?.subject?.map(async (subject) => {
           
               await Score.collection.insertOne({
                subject, 
                username: student.username,
                studentId: student._id,
                class: student.currentClass,
                category: student.category,
                firstName: student.firstName,
                lastName: student.lastName,
                username: student.username,
                term: termAndSession[0].termNumber,
                session: termAndSession[0].session.year,
                suspend: false
            })
           
        })

    //     // console.log('----------------',scoreDocuments)


          // creating a new school payment
          await Payment.collection.insertOne({
            studentId: student._id,
            username: student.username,
            firstname: student.firstName,
            lastName: student.lastName,
            paid: false,
            term: termAndSession[0].termNumber,
            session: termAndSession[0].session.year,
            className: student.currentClass,
            suspend: false
          })

        //   creating a new cognitive data
        await Cognitive.collection.insertOne({
            username: student.username,
            studentId: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            class: student.currentClass,
            category: student.category,
            suspend: false,
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

    const newTermResult = students.filter(std => {
        const studentSubjects = subjects.filter( currentELement => {
            return (currentELement.name === std.currentClass) &&
             (currentELement.category === std.category)
         })

         if(studentSubjects.length > 0){

             return {
                username: std.username,
                studentId: std._id,
                class: std.currentClass,
                category: std.category,
                noOfCourse: studentSubjects[0]?.subject?.length,
                term: termAndSession[0].termNumber,
                session: termAndSession[0].session.year,
                suspend: false
            }
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

    const termAndSession = await TermSetter.find()

    // adding a session value for the front end

    // await AddSession.collection.insertOne({session: termAndSession[0].session.year})

    // souley's code starts here
    // // graduate some students
    const students = await Student.find({ status: 'Active' })
    const seniors = students.filter( student => 
           student.currentClass === 'JSS3' 
        || student.currentClass === 'SSS3' 
        || student.currentClass ==='Grade5' 
        || student.currentClass ==='Kindergarten3'
        || student.currentClass ==='Playclass')
        || student.currentClass ==='Daycare'

        
    seniors.forEach( async (senior) => {
        await Student.findOneAndUpdate(
            { username: senior.username }, 
            { status: 'graduated' },
            { useFindAndModify: false })
        })
    const promotedStudents = await Student.find({ status: 'Active', suspend: false })

    // // // // promote some students 
    // students.filter( student => 
    //     student.currentClass !== 'JSS3' 
    //     || student.currentClass !== 'SSS3' 
    //     || student.currentClass !=='Grade5' 
    //     || student.currentClass !=='Kindergarten3'
    //     || student.currentClass !=='Playclass'
    //     || student.currentClass !=='Daycare')

        // incrementing promoted student className and classNumber
        
        await (async function(){
           
            const sessionResultPromotedStudent = await SessionResult.find({status: 'Promoted',session: termAndSession[0].session.year, suspend:false })

            const newPromoted = promotedStudents.filter( async (std) => {
                let student
                await sessionResultPromotedStudent.forEach(sStd => {
                   if(std.username == sStd.username) student =std
                })
                return student
            })

            
            newPromoted.forEach(async (student) => {
               
                   await Student.updateOne({ 
                   username: student.username }, 
                   { $inc: { classNumber: 1 }}, 
                   { new: true }) 
               
            //    const singleStudent = await Student.find({username: student.username })
               
               switch (student.section) {
                   case 'Grade':
                       className = `Grade${student.classNumber + 1}`
                       await Student.updateOne({ username: student.username }, 
                           { $set: {currentClass: className } }, { new: true })  
                       break;
               
                   case 'JSS':
                       className = `JSS${student.classNumber + 1}`
                       await Student.updateOne({ username: student.username }, 
                           { $set: {currentClass: className } }, { new: true })  
                       break;
               
                   case 'SSS':    
                       className = `SSS${student.classNumber + 1}`
                       await Student.updateOne({ username: student.username }, 
                           { $set: {currentClass: className } }, { new: true })  
                       break;
                              
                   case 'Kindergartens':    
                       className = `Kindergarten${student.classNumber + 1}`
                       await Student.updateOne({ username: student.username }, 
                           { $set: {currentClass: className } }, { new: true })  
                       break;    
                             
               
                   default:
                       break;
               }
              
                   
           })
        
        })()
  
   
await (async () => {
            // // create all the necessary records for the promoted student
            
    const {session} = req.body
    // // update session here 
    await TermSetter.updateOne({
        session: session,
        termNumber: 1,
        currentTerm: 'First Term'

    
    })

    const newTermAndSession = await TermSetter.find()

    // create new score sheets for all active students
    const subjects = await Curriculum.find({ })
    const newStudents1 = await Student.find({ status: 'Active', suspend: false  })
    
    newStudents1.forEach( async (student) => {
        console.log(student)
        // find student class and subjects
        const studentSubjects = subjects.filter( currentELement => {
           
           return currentELement.name === student.currentClass &&
            currentELement.category === student.category
        })

        // create score document for each student's subject
        const scoreDocuments = studentSubjects[0]?.subject?.map(subject => ({
            subject,
            username: student.username,
            studentId: student._id,
            class: student.currentClass,
            category: student.category,
            firstName: student.firstName,
            lastName: student.lastName,
            username: student.username,
            term: newTermAndSession[0].termNumber,
            session: newTermAndSession[0].session.year,
            suspend: false
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
            className: student.currentClass,
            suspend: false
          })

        // creating a new cognitive data
        await Cognitive.collection.insertOne({
            username: student.username,
            studentId: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            class: student.currentClass,
            category: student.category,
            Neatness:'',
            Punctuality:'',
            Attentiveness:'',
            Attitude:'',
            Emotion:'',
            Initiative:'',
            TeamWork:'',
            Perseverance:'',
            Speaking:'',
            Leadership:'',
            Acceptance:'',
            Honesty:'',
            Follows:'',
            Participation:'',
            remarks: '',
            term: newTermAndSession[0].termNumber,
            session: newTermAndSession[0].session.year,
            suspend: false
        })  

        const noOfCourse = await Curriculum.find(
            {'name': student.currentClass, 'category': student.category},
            { 'subject': 1}
          )
            // creating a new term result
        noOfCourse[0] && await TermResult.collection.insertOne({
            studentId: student._id,
            username: student.username,
            class: student.currentClass,
            category: student.category,
            noOfCourse: noOfCourse[0].subject.length,
            term: newTermAndSession[0].termNumber,
            session: newTermAndSession[0].session.year,
            suspend: false
        })
    })



    // Souley's code ends here
    
})();

res.json({ success: true, message: 'session set successfully' })

    
}

exports.getSession = async (req,res,next) => {
    const result = await TermSetter.findOne({},{session: 1})
    res.json({success: true, result})

}

exports.getAddSession = async (req,res,next) => {
    const result = await AddSession.find()
    res.json({success: true, result})

}

// ************************************************************
// pls understand the code before using
exports.deleteAllStudentPresentTermResult = async (req,res,next) => {
    try {
        const newTermAndSession = await TermSetter.find()

        await TermResult.deleteMany({
            term: newTermAndSession[0].termNumber,
            session: newTermAndSession[0].session.year,
        })
        res.json({"success":true, message: "All present term result deleted"})
    } catch (error) {
        console.log(error)
    }   
}