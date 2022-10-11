const Staff = require('../models/Staff')
const Score = require('../models/Score')
const TermResult = require('../models/TermResult')
const TermSetter = require('../models/TermSetter')
const SessionResult = require('../models/SessionResult')
const studentBroadSheetPdf = require('../pdf_generator/student_broad_sheet')


exports.fetchTeacherSubjects = async (req, res) => {
    const teacher = await Staff.findById(req.query.id)
    res.json({subjects: teacher.teach})
}

exports.fetchStudentsInClass = async (req, res) => {
    const termAndSession = await TermSetter.find()
    const students = 
       await Score.find({ 
        class: req.body.class,
        subject: req.body.subject,
        category: req.body.category,
        session: termAndSession[0].session.year,
        term: termAndSession[0].termNumber

     })
    res.json({ success: true, students })
}

exports.liveSaveResult = async (req, res) => {
    const field = req.body.key
    const value = req.body.value
    const username = req.body.username
    const currentClass = req.body.currentClass
    const subject = req.body.subject
    const category = req.body.category
    const termAndSession = await TermSetter.find() 

    // update the score field sent from front end
    const score = await Score.findByIdAndUpdate(req.body.id, {
        [field]: value
    }, {new: true, useFindAndModify: false})
    
    // get total by adding all ca and exam value if they exist
    const ca1 = score.ca1 === undefined ? 0 : score.ca1
    const ca2 = score.ca2 === undefined ? 0 : score.ca2
    const ca3 = score.ca3 === undefined ? 0 : score.ca3
    const ca4 = score.ca4 === undefined ? 0 : score.ca4
    const exam = score.exam === undefined ? 0 : score.exam
    const total = ca1 + ca2 + ca3 + ca4 + exam

    // use if else to find grade based on score value 
    let grade
    if(total >= 91) {
        grade = 'A1'
    } else if(total >= 81) {
        grade = 'B2'
    } else if(total >= 71) {
        grade = 'B3'
    } else if(total >= 65) {
        grade = 'C4'
    } else if(total >= 60) {
        grade = 'C5'
    } else if(total >= 50) {
        grade = 'C6'
    } else if(total >= 45) {
        grade = 'D7'
    } else if(total >= 40) {
        grade = 'E8'
    } 
    else {
        grade = 'F9'
    }

    // update grade and total field
    await Score.findByIdAndUpdate(score._id, {
        total,
        grade
    }, {new: true, useFindAndModify: false})

    // calculate position for a specific subject
    const allStudentScoreInAClass = await Score.find(
        {
            class: currentClass, 
            subject: subject, 
            category: category, 
            term: termAndSession[0].termNumber,
            session: termAndSession[0].session.year
        },
        {total: 1, username: 1}
        )

    allStudentScoreInAClass.sort((a,b) => {
        return b.total - a.total 
    })    

    const currentSubjectPosition = allStudentScoreInAClass.map((students,ind)=>{
        return studentIdentity={
            id:students.id,
            position:ind+1,
            username: students.username
        }
            
    })    

    currentSubjectPosition.map( async (students,ind)=>{
        await Score.findByIdAndUpdate(students.id, {subjectPosition: students.position})
    })    
    // End of calculating subject position in a class

    // calculating student term result in class 
    const allStudentTotal = await Score.find({
        username: username,
        term: termAndSession[0].termNumber,
        session: termAndSession[0].session.year
        },{total: 1})
  
    let sumTotal = allStudentTotal.reduce((a,b)=> (+a +  +b.total),0 )
    
    let noOfCourses = allStudentTotal.length;
    let average = sumTotal/noOfCourses
    
    await TermResult.findOneAndUpdate({
        username: req.body.username,
        term: termAndSession[0].termNumber,
        session: termAndSession[0].session.year,

    },{
        total: sumTotal, average: average
    })  

// end of calculating student term result

const upScore3 = await Score.findById(req.body.id)
    
/* START OF SESSION RESULT CALCULATION */

// check if the term is third term 
if(termAndSession[0].termNumber === 3) {

    // get student term results
    const termAverages = await TermResult.find({
        username,
        session: termAndSession[0].session.year 
    })
    const lengthOfAverages = termAverages.length

    // calculate session average based on term averages
    if (lengthOfAverages == 1){
        const termAverage1 = termAverages[0].average === undefined ? 0 : termAverages[0].average
        // calculate how many term results the student have
    
        const sessionAverage = termAverage1/1

        // calculate student status based on average
        const status = sessionAverage >= 40 ? 'Promoted' : 'Demoted'

        // save the result in the DB
        await SessionResult.collection.update(
        { username },
        { average: sessionAverage,
            status,
            username,
            session: termAndSession[0].session.year,
            class: currentClass,
            suspend: false
         },
            { upsert: true }) 

    }else if (lengthOfAverages == 2){
        const termAverage1 = termAverages[0].average === undefined ? 0 : termAverages[0].average
        const termAverage2 = termAverages[1].average === undefined ? 0 : termAverages[1].average

        // calculate how many term results the student have
        
        const sessionAverage = (termAverage1 + termAverage2)/2

        // calculate student status based on average
        const status = sessionAverage >= 40 ? 'Promoted' : 'Demoted'

        // save the result in the DB
        await SessionResult.collection.update(
        { username },
        { average: sessionAverage,
            status,
            username,
            session: termAndSession[0].session.year,
            class: currentClass,
            suspend: false
         },
            { upsert: true }) 

    }else {
        const termAverage1 = termAverages[0].average === undefined ? 0 : termAverages[0].average
        const termAverage2 = termAverages[1].average === undefined ? 0 : termAverages[1].average
        const termAverage3 = termAverages[2].average === undefined ? 0 : termAverages[2].average

        // calculate how many term results the student have
        
        const sessionAverage = (termAverage1 + termAverage2 + termAverage3)/3

        // calculate student status based on average
        const status = sessionAverage >= 40 ? 'Promoted' : 'Demoted'

        // save the result in the DB
        await SessionResult.collection.update(
        { username },
        { average: sessionAverage,
            status,
            username,
            session: termAndSession[0].session.year,
            class: currentClass,
            suspend: false
         },
            { upsert: true }) 

    }
    
    // CALCULATE POSITION FOR STUDENTS IN THE CLASS
    // get the session results for the students in the class
    const sessionRecords = await SessionResult.find(
        { session: termAndSession[0].session.year, class: currentClass, category },
        { average: 1, username: 1 })
    
    // sort the results
    sessionRecords.sort((a,b) => {
    return b.average - a.average 
    }) 

    // giving positions to students by adding 1 to index
    const currentSessionPosition = sessionRecords.map((students,ind)=>{
    return studentIdentity={
        id:students.id,
        position:ind+1,
        username: students.username
    }
})
    // enter the students result in DB
    currentSessionPosition.map( async (students,ind)=>{
    await SessionResult.findByIdAndUpdate(students.id, { position: students.position })
}) 
    res.json({ success: true, upScore3}) 
}else{

    res.json({ success: true, upScore3})   
}
/* END OF SESSION RESULT CALCULATION */


}

// update teacher priviledge on result
exports.finalSubmision = async (req,res,next) => {
    const {submitButton, value, id} = req.body

    await Staff.findByIdAndUpdate(id, {
        [submitButton]: value
    }, {new: true, useFindAndModify: false})
    
    res.json({success: true, message: `you have submitted ${submitButton}`})

} 

/**
 * Getting a particular class broad sheet report
 * the result will only contain a comprehensive list result of student in a class
 * @className: class parameter will be used to filter a specific class
 * @category: will be used to filter class category such as science and art
 * @term and @session: will be used to get result for that particular term and session  
 */

exports.getStudentBroadSheet = async (req,res,next) => {
    const header = {className, category, term, session} = req.query
    const intergerTerm =  Number(term)

    // getting all student id from the class
    const studentId = await Score.aggregate([
        {$match: {"class":className, "category":category, "term":intergerTerm, session}},
        {$group: {_id: {username:"$username", firstName:"$firstName", lastName:"$lastName"}}}
    ])

    // getting all courses from the class
    const courses = await Score.aggregate([
        {$match: {"class":className, "category":category, "term":intergerTerm, session}},
        {$group: {_id:"$subject"}},
        {$sort: {_id:1}}
    ])

    // get all student each subject result from Score collection
    const studentResult = await Score.aggregate([
        {$match: {"class":className, "category":category, "term":intergerTerm, session}},
        {$project: {_id:0, isActive:0, subjectPosition:0, isfinalSubmitted:0, createdAt:0, updatedAt:0 }},
        {$sort: {subject:1}}
    ])

     // get each student term result from Term collection
    const studentTermResult = await TermResult.aggregate([
        {$match: {"class":className, "term":intergerTerm, session, suspend: false}},
        {$project: {_id:0, class:0, term:0, session:0, noOfCourse:0, position:0 }},
        // {$sort: {subject:1}}
    ])    

    

    const result = studentId.map(std=> {
        let stdResult = []
        let stdTermResult 

        // asign all score belonging to a student to himself
        studentResult.forEach((str)=>{
            if (str.username === std._id.username) {
             stdResult.push( {
                        subject: str.subject,
                        total: str.total === undefined ? 0 : str.total
                })
            }
        })

        // asign term result belonging to a student to himself
        studentTermResult.forEach((str)=>{
            if (str.username === std._id.username) {
             stdTermResult =  {
                        total: str.total === undefined ? 0 : str.total,
                        average: str.average === undefined ? 0 : str.average
                }
            }
        })
        return {
            user: std._id,
            stdResult,
            stdTermResult
        }
    })

    // generate pdf report
  const data = { result,courses,studentId,header }

  const pdf = await studentBroadSheetPdf(data)
  // then send to frontend to download
  res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
  res.send(pdf)

//   console.log(result)
//   console.log(studentTermResult)
//   console.log(studentId,courses)


    
    
}