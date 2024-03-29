const passport = require('passport')
const Staff = require('../models/Staff')
const Student = require('../models/Student')
const Score = require('../models/Score')
const Curriculum = require('../models/Curriculum')
const multer = require('multer')
const { singleUpload } = require('../middlewares/filesMiddleware')
const TermSetter = require('../models/TermSetter')
const Cognitive = require('../models/Cognigtive')
const TermResult = require('../models/TermResult')
const Payment = require('../models/Payment')
const Assignment = require('../models/Assignment')
const SessionResult = require('../models/SessionResult')
const cloudinaryUplouder = require('./helper/uploadCloudinary')
const createDosierPdf = require('../pdf_generator/dosier_generate')
const createStudentPdf = require('../pdf_generator/view_student_class')

// student registration controller
exports.registerStudent = async function (req, res, next) {
  try {
    // fetch current term and session
    const termAndSession = await TermSetter.find({}, { termNumber: 1, session: 1 })
    // extract class number from current class
    if (req.body.currentClass !== 'Daycare' && req.body.currentClass !== 'Playclass') {
      const classNumber = req.body.currentClass.split('')
      req.body.classNumber = classNumber[classNumber.length - 1]
    }

    req.body.term = termAndSession[0].termNumber
    req.body.session = termAndSession[0].session.year
    // req.body.term = term[0].termNumber
    user = new Student(req.body)
    const password = req.body.password ? req.body.password : 'password'
    // save the user to the DB
    Student.register(user, password, async (error, user) => {
      if (error) return res.json({ success: false, error })
      // add subjects to the student
      const subjects = await Curriculum.find(
        { name: user.currentClass, category: user.category },
        { subject: 1, _id: 0 })

      console.log('-------------------', subjects)

      const studentSubjects = subjects[0].subject.map(subject => ({
        subject,
        username: user.username,
        studentId: user._id,
        class: user.currentClass,
        category: user.category,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        term: termAndSession[0].termNumber,
        session: termAndSession[0].session.year,
        suspend: false
      }))

      // console.log(user.currentClass, user.category)

      const noOfCourse = await Curriculum.find(
        { name: user.currentClass, category: user.category },
        { subject: 1 }
      )

      console.log('-----------------', termAndSession)
      const cognitiveData = {
        username: user.username,
        studentId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        class: user.currentClass,
        category: user.category,
        Neatness: '',
        Punctuality: '',
        Attentiveness: '',
        Attitude: '',
        Emotion: '',
        Initiative: '',
        TeamWork: '',
        Perseverance: '',
        Speaking: '',
        Leadership: '',
        Acceptance: '',
        Honesty: '',
        Follows: '',
        Participation: '',
        remarks: '',
        term: termAndSession[0].termNumber,
        session: termAndSession[0].session.year,
        suspend: false
      }

      await Score.collection.insertMany(studentSubjects)
      await Cognitive.collection.insertOne(cognitiveData)

      await TermResult.collection.insertOne({
        studentId: user._id,
        username: user.username,
        class: user.currentClass,
        category: user.category,
        noOfCourse: noOfCourse[0].subject.length,
        term: termAndSession[0].termNumber,
        session: termAndSession[0].session.year,
        suspend: false
      })

      await Payment.collection.insertOne({
        studentId: user._id,
        username: user.username,
        firstname: user.firstName,
        lastName: user.lastName,
        paid: false,
        term: termAndSession[0].termNumber,
        session: termAndSession[0].session.year,
        className: user.currentClass,
        suspend: false
      })

      res.json({ success: true, user })
    })
  } catch (error) {
    res.json({ success: false, error })
  }
}
// student login controller
exports.loginStudent = (req, res, next) => {
  // perform authentication
  passport.authenticate('student', (error, user, info) => {
    if (error) return res.json({ success: false, error })
    if (!user) {
      return res.json({
        success: false,
        message: 'username or password is incorrect'
      })
    }
    // login the user
    req.login(user, (error) => {
      if (error) { res.json({ success: false, message: 'something went wrong pls try again' }) }
      req.session.user = user
      res.json({ success: true, message: 'student login success', user })
    })
  })(req, res, next)
}

exports.setProfilePic = async (req, res, next) => {
  singleUpload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.json(err.message)
    } else if (err) {
      return res.json(err)
    } else if (!req.file) {
      return res.json({success: false,"file": req.file, "msg":'Please select file to upload'});
    }else if (req.file.size > 5000000) {
      return res.json({success: false, "file": req.file, "msg":'File size too large, file should no be greater than 5mb '});
    }
    else if (!req.file) {
      return res.json({"image": req.file, "msg":'Please select an image to upload'});
    }
    if(req.file){
        console.log(req.query.username)

       // before uploading image check for previous image and delete from cloud
       let studentImage = await Student.findOne({username: req.query.username})

        
       let isImageDeleted 
       if (studentImage.image != '1.jpg' && studentImage.image != null) isImageDeleted = await cloudinaryUplouder.delete(studentImage.image)
       else isImageDeleted = true 
       // sending image to claudinary and saving the link to database
       let mediaImage 
       if(isImageDeleted) mediaImage = await cloudinaryUplouder.upload(req.file.path)
       
        await Student.findOneAndUpdate({username: req.query.username},{$set: {image: mediaImage}},{useFindAndModify:false})
        let singleStudent = await Student.findOne({username: req.query.username})
        
        return  res.json({success: true,
        message: singleStudent,
                   },
        
    );
    }
    });          
  
}
// reset password by parent / student
exports.resetPassword = async (req, res, next) => {
  try {
    const user = await Student.findById(req.params.id)
    await user.changePassword(req.body.oldPassword, req.body.newPassword)
    await user.save()
    res.json({ user })
  } catch (error) {
    res.json({ message: 'something went wrong', error })
  }
}
// reset password for student by admin
exports.adminResetStudentPassword = async (req, res, next) => {
  try {
    const user = await Student.findById(req.params.id)
    await user.setPassword('password')
    await user.save()
    res.json({ user })
  } catch (error) {
    res.json({ message: 'something went wrong', error })
  }
}

exports.findAllStudent = async (req, res, next) => {
  const students = await Student.find().sort({suspend: false})

  students
    ? res.json({ success: true, students })
    : res.json({ success: true, message: students })
}

exports.findAllStudentAccordinToSection = async (req, res, next) => {
  const { section } = req.query

  const students = await Student.find({ section:section, status:'Active', suspend: false })

  res.json({ success: true, students })
}

exports.findAllStudentAccordinToClassAndCategory = async (req, res, next) => {
  const { currentClass, category } = req.query

  const students = await Student.find({ currentClass, category, status:'Active', suspend: false })

  res.json({ success: true, students })
}

exports.updateSingleStudent = async (req, res, next) => {
  const { id } = req.query
  const {
    studentId,
    currentClass,
    section,
    category,
    classNumber
  } = req.body

  console.log(classNumber)

  await Student.findByIdAndUpdate(id, {
    currentClass,
    section,
    category,
    'class[0].number': classNumber
  })

  res.json({ success: true, message: `user with the ${id} is updated successfully` })
}

exports.findOneStudent = async (req, res, next) => {
  const { id } = req.query

  const student = await Student.findById(id)

  student
    ? res.json({ success: true, student })
    : res.json({ success: true, student })
}

exports.removeStudent = async (req,res,next) => {
  const {id,username} = req.query;

  // before uploading image check for previous image and delete from cloud
  let studentImage = await Student.findOne({_id: id})
  console.log(studentImage)
  let isImageDeleted
  if (studentImage != '1.jpg' && studentImage != null) isImageDeleted = await cloudinaryUplouder.delete(studentImage.image)
  else isImageDeleted = true
  
  if(isImageDeleted){
    await Student.findOneAndDelete({_id: id})
    await Score.deleteMany({username})
    await Cognitive.deleteMany({username})
    await Payment.deleteMany({username})
    await TermResult.deleteMany({username})
    await SessionResult.deleteMany({username})
  }

  res.json({success: true, message: `student with the id ${id} has been removed`})
}

/**
 * This controller get all student from a particular class 
 * and make it ready for printing to the frontend
 * @param {currentClass, category, } req 
 * @param { send back a pdf} res 
 * @param {*} next 
 */
exports.getAllStudentFromAspecificClass = async (req, res, next) => {
  const { currentClass, category } = req.query
  const termAndSession = await TermSetter.find()

  try {
    const result = await Student.aggregate([
      {$match: {currentClass, category, suspend:false, status:'Active'}},
      {$project: {_id:0, createdAt:0, updatedAt:0, suspend:0, hash:0, salt:0}}
    ])
    const noOfStudent = result.length

    const classDetails = {
      className: currentClass,
      category: category,
      term: termAndSession[0].termNumber,
      session: termAndSession[0].session.year,
      noOfStudent
    }

    
    // generate pdf report
  const data = { result, classDetails }

  const pdf = await createStudentPdf(data)
  // then send to frontend to download
  res.set({ 'Content-Type': 'application/html', 'Content-Length': pdf.length })
  res.send(pdf)
  } catch (error) {
    console.log(error)
  }
}

exports.getAclassResult = async (req, res, next) => {
  const { term, session, className, category } = req.query

  // TODO add category to each of the criteria
  const eachSubjectResult = await Score.find({
    class: className,
    category,
    term,
    session,
    suspend: false
  }).lean()

  // console.log("each result:", eachSubjectResult)

  let cognitiveResult = await Cognitive.find({
    class: className,
    term,
    category,
    session,
    suspend: false 
  }).lean()

  const cognitiveResultPrev = await Cognitive.find({
    class: className,
    term,
    category,
    session,
    // suspend: false 
  }).lean()

  if  (session < "2022/2023") cognitiveResult = cognitiveResultPrev 


  // console.log("cognitive result:", cognitiveResult)


  const termResult = await TermResult.find({
    class: className,
    category,
    term,
    session,
    suspend: false
  }).lean()

  // console.log("term result:", termResult)

  let seesionResult = await SessionResult.find({
    session, 
    class: className,
    suspend: false,
    category
  }).lean()

  const seesionResultPrev = await SessionResult.find({
    session, 
    class: className,
    // suspend: false,
    // category
  }).lean()

  if  (session < "2022/2023") seesionResult = seesionResultPrev 
  
  
  // console.log("session result:", seesionResult)


  const generalResult = await termResult.map((student) => {
    const studentCourses = eachSubjectResult.filter(std => std.username == student.username)
    const cognitive = cognitiveResult.filter(std => std.username == student.username)
    const sessionResult = seesionResult.filter(std => std.username == student.username)
    return {
      termResult: student,
      subjects: studentCourses,
      cognitives:cognitive[0],
      sessionResult:sessionResult[0],
      classSize: termResult.length
    }
      
  })

  try {
    // generate pdf report
    const data = await { generalResult}
    // console.log(generalResult)

    const pdf = await createDosierPdf(data)
    // console.log(pdf)
    // then send to frontend to download
    res.set({ 'Content-Type': 'application/html', 'Content-Length': pdf.length })
    res.send(pdf)
  } catch (error) {
    console.log(error)
  }

  
}

exports.getAsingleStudentResult = async (req, res, next) => {
  const { term, username, currentClass, category } = req.query
  const termAndSession = await TermSetter.find()

  const totalNoOfStudent = await Student.find({ currentClass, category }).countDocuments()

  const subjectResult = await Score.find({
    term,
    session: termAndSession[0].session.year,
    username,
    suspend: false
  })

  const studentCognitive = await Cognitive.findOne({
    term,
    session: termAndSession[0].session.year,
    username,
    suspend: false

  })

  const termResult = await TermResult.find({
    term,
    session: termAndSession[0].session.year,
    username,
    category,
    suspend: false
  })
  const generalSingleResult = [
    ...termResult,
    subjectResult,
    studentCognitive,
    totalNoOfStudent
  ]
  res.json({ success: true, noOfScore: subjectResult.length, message: generalSingleResult })
}

exports.editStudent = async (req, res, next) => {
  const { id } = req.query
  await Student.findByIdAndUpdate(id, req.body)
  res.json({ success: true, message: `student with the id ${id} has been edited` })
}

// *****************************************************************************************************
// The code below is very sensitive make sure you understand it before using it

exports.promoteOrDemoteAstudent = async (req, res, next) => {
  const termAndSession = await TermSetter.find()

  const { username, newClass } = req.query
  try {
    const student = await Student.findOneAndUpdate({ username }, { $set: { currentClass: newClass } }, { useFindAndModify: false })
    const score = await Score.updateMany({
      username,
      session: termAndSession[0].session.year
    }, { $set: { class: newClass } })

    await Cognitive.updateMany({
      username,
      session: termAndSession[0].session.year
    }, { $set: { class: newClass } })

    await Payment.updateMany({
      username,
      session: termAndSession[0].session.year
    }, { $set: { className: newClass } })

    await TermResult.updateMany({
      username,
      session: termAndSession[0].session.year
    }, { class: newClass })
    res.json({ success: true, message: `student with the id ${username} has been promoted` })
  } catch (error) {
    console.log(error)
  }
}
// *****************************************************************************************************
// The code below is very sensitive make sure you understand it before using it
exports.promoteOrDemoteAclass = async (req, res, next) => {
  const { currentClass, newClass, session } = req.body
  // await Student.updateMany({currentClass},{currentClass:newClass})
  await Payment.updateMany({ session, className: currentClass }, { className: newClass })
  await Score.updateMany({ session, class: currentClass }, { class: newClass })
  await Cognitive.updateMany({ session, class: currentClass }, { class: newClass })
  await TermResult.updateMany({ session, class: currentClass }, { class: newClass })

  // console.log(rr)
  res.json({ success: true, message: `a class of this ${currentClass} has been promoted` })
}

exports.getAllStudentAssignment = async (req, res, next) => {
  const termAndSession = await TermSetter.find()
  const { currentClass, category } = req.query
  const result = await Assignment.find({
    class: currentClass,
    category,
    term: termAndSession[0].termNumber,
    session: termAndSession[0].session.year
  })
  res.json({ success: true, result })
}

exports.suspendAstudent = async (req, res, next) => {
  const { username, suspend } = req.query
  const termAndSession = await TermSetter.find()

  try {
    await Student.findOneAndUpdate({ username }, { $set: { suspend } })
    await TermResult.findOneAndUpdate({
      username,
      term: termAndSession[0].termNumber,
      session: termAndSession[0].session.year
    }, { $set: { suspend } })

    await SessionResult.findOneAndUpdate({
      username,
      session: termAndSession[0].session.year
    }, { $set: { suspend } })

    await Payment.findOneAndUpdate({
      username,
      term: termAndSession[0].termNumber,
      session: termAndSession[0].session.year
    }, { $set: { suspend } })

    await Score.updateMany({
      username,
      term: termAndSession[0].termNumber,
      session: termAndSession[0].session.year
    }, { $set: { suspend } })

  } catch (error) {
    console.log(error)
  }

  

  res.json({ success: true, suspend })
}

exports.makeSuspendField = async(req,res,next) => {
  try {
    await TermResult.updateMany({}, { $set: { suspend: false } })

    await SessionResult.updateMany({}, { $set: { suspend: false } })

    await Payment.updateMany({}, { $set: { suspend: false } })

    await Score.updateMany({}, { $set: { suspend: false } })

  } catch (error) {
    console.log(error)
  }

  

  res.json({ success: true, message: "update all suspend" })
}


/**
 * this code add category field to term and session result
 * make sure you understand it before using it
 * */ 

exports.reflectStudentCategoryFieldOnTermAndSessionResult = async (req, res) => {
  const termAndSession = await TermSetter.find()
  const students = await Student.find({suspend: false})
  try {
    await students.forEach(async (std) => {
      console.log(std.username, std.category)
      await TermResult.updateMany({
        username: std.username,
        session: termAndSession[0].session.year},{$set:{category:std.category}})

      await SessionResult.updateMany({
        username: std.username,
        session: termAndSession[0].session.year},{$set:{category:std.category}})

    })

    res.json({success:true, message: 'category field has been added'})
    
  } catch (error) {
    console.log(error)
  }
}

/**
 * This function promote a student from one class to another
 * its delete all its present information and create a new for the present class
 * @studentId :
 * @newClass :
 * @category : 
 * 
*/

exports.changeStudentClass = async (req, res, next) => {
  const {studentId, newClass, category} = req.body
  const student = await Student.findOne({username: studentId})
  const termAndSession = await TermSetter.find()
  let classNumber = ""
  let section = ""
  if (newClass !== "Playclass" && newClass !== "Daycare"){
    classNumber = newClass.split('')
    section = newClass.substr(0,classNumber.length - 1)  
    classNumber = classNumber[classNumber.length - 1]

  }

  const subjects = await Curriculum.find(
    { name: newClass, category: category },
    { subject: 1, _id: 0 })

  // console.log('-------------------', subjects)

  const studentSubjects = subjects[0]?.subject?.map(subject => ({
    subject,
    username: student.username,
    studentId: student._id,
    class: newClass,
    category: category,
    firstName: student.firstName,
    lastName: student.lastName,
    username: student.username,
    term: termAndSession[0].termNumber,
    session: termAndSession[0].session.year,
    suspend: false,
    isActive: true
  }))

  // console.log("student score: ", studentSubjects)

  const noOfCourse = await Curriculum.find(
    { name: newClass, category: category },
    { subject: 1 }
  )

  // console.log('-----------------', termAndSession)
  const cognitiveData = {
    username: student.username,
    studentId: student._id,
    firstName: student.firstName,
    lastName: student.lastName,
    class: newClass,
    category: category,
    Neatness: '',
    Punctuality: '',
    Attentiveness: '',
    Attitude: '',
    Emotion: '',
    Initiative: '',
    TeamWork: '',
    Perseverance: '',
    Speaking: '',
    Leadership: '',
    Acceptance: '',
    Honesty: '',
    Follows: '',
    Participation: '',
    remarks: '',
    term: termAndSession[0].termNumber,
    session: termAndSession[0].session.year,
    suspend: false
  }
  // console.log("student cognitive: ", cognitiveData)

  if (studentSubjects) await Score.collection.insertMany(studentSubjects)
  await Cognitive.collection.insertOne(cognitiveData)

  await TermResult.collection.insertOne({
    studentId: student._id,
    username: student.username,
    class: student.currentClass,
    category: student.category,
    noOfCourse: noOfCourse[0] == undefined ? 0 : noOfCourse[0].subject.length,
    term: termAndSession[0].termNumber,
    session: termAndSession[0].session.year,
    suspend: false
  })



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


  // deleting prev class document
  const deleteScore = await Score.deleteMany({
    username: studentId, 
    term: termAndSession[0].termNumber,
    session: termAndSession[0].session.year,
    class: student.currentClass,
   }) 

  const deleteCoginitive = await Cognitive.deleteMany({
    username: studentId, 
    term: termAndSession[0].termNumber,
    session: termAndSession[0].session.year,
    class: student.currentClass,

  })  

  const deleteTermResult = await TermResult.deleteMany({
    username: studentId, 
    term: termAndSession[0].termNumber,
    session: termAndSession[0].session.year,
    class: student.currentClass,

  }) 

  const deletePayment = await Payment.deleteMany({
    username: studentId, 
    term: termAndSession[0].termNumber,
    session: termAndSession[0].session.year,
    className: student.currentClass,

  }) 

  // console.log({
  //   "deleteScore": deleteScore, 
  //   "deleteCognitive": deleteCoginitive, 
  //   "deleteTermResult": deleteTermResult,
  //   "deletePayment": deletePayment
  // })

  await Student.findOneAndUpdate(
    {username: studentId},
    {$set: {currentClass: newClass, classNumber: classNumber, category: category, section:section}})

  res.json({ success: true, })
}

exports.uspdateStudentScore = async (req,res) => {
 
  await Score.updateMany({class: "SSS3"},{$set:{suspend:false}})
  console.log("update done")


}