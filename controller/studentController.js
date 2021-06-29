const passport = require('passport');
const Staff = require('../models/Staff');
const Student = require('../models/Student')
const Score = require('../models/Score')
const Curriculum = require('../models/Curriculum')
const multer = require('multer');
const {singleUpload} = require('../middlewares/filesMiddleware');
const TermSetter = require('../models/TermSetter');
const Cognitive = require('../models/Cognigtive');
const TermResult = require('../models/TermResult');
const Payment = require('../models/Payment');
const Assignment = require('../models/Assignment');
// const connectEnsureLogin = require('connect-ensure-login')

exports.registerStudent = async function (req, res, next) {
  try {
    //create the user instance
    const term = await TermSetter.find({ })
    // req.body.term = term[0].termNumber
    user = new Student(req.body)
    const password = req.body.password ? req.body.password : 'password';
    //save the user to the DB
    Student.register(user, password, async (error, user) => {
      if (error) return res.json({ success: 'false 1', error }) 
      // add subjects to the student
      const subjects = await Curriculum.find(
       { 'name': user.currentClass, 'category': user.category},
       { 'subject': 1, _id: 0})

        console.log(subjects)

      const studentSubjects = subjects[0].subject.map(subject => ({
        subject, 
        username: user.username,
        studentId: user._id,
        class: user.currentClass,
        category: user.category,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
       }))

       console.log(user.currentClass, user.category)


       const termAndSession = await TermSetter.find({},{termNumber: 1, session: 1})
       const noOfCourse = await Curriculum.find(
         {'name': user.currentClass, 'category': user.category},
         { 'subject': 1}
       )

       console.log('-----------------',termAndSession)
       const cognitiveData = {
         username: user.username,
         studentId: user._id,
         firstName: user.firstName,
         lastName: user.lastName,
         term: termAndSession[0].termNumber,
         session: termAndSession[0].session.year,
       }

      await Score.collection.insertMany(studentSubjects)
      await Cognitive.collection.insertOne(cognitiveData)
      await TermResult.collection.insertOne({
        studentId: user._id,
        username: user.username,
        class: user.currentClass,
        noOfCourse: noOfCourse[0].subject.length,
        term: termAndSession[0].termNumber,
        session: termAndSession[0].session.year,
      })
      await Payment.collection.insertOne({
        studentId: user._id,
        username: user.username,
        firstname: user.firstName,
        lastName: user.lastName,
        paid: false,
        term: termAndSession[0].termNumber,
        session: termAndSession[0].session.year,
        className: user.currentClass
      })

      res.json({ success: true, user })
    })
  } catch (error) {
    res.json({ success: 'false 2', error })
  }
}

exports.loginStudent = (req, res, next) => {

  // perform authentication
  passport.authenticate('student', (error, user, info) => {
    if (error) return res.json({ success: false, error })
    if (!user)
      return res.json({
        success: false,
        message: 'username or password is incorrect'
      })
    //login the user  
    req.login(user, (error) => {
      if (error)
        res.json({ success: false, message: 'something went wrong pls try again' })
      req.session.user = user
      res.json({ success: true, message: 'student login success', user })
    })
  })(req, res, next)
}

exports.setProfilePic = async (req,res, next) => {

  singleUpload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
    return res.json(err.message);
    }
    else if (err) {
      return res.json(err);
    }
    else if (!req.file) {
      return res.json({"image": req.file, "msg":'Please select an image to upload'});
    }
    if(req.file){
        console.log(req.query.id)
        await Student.findOneAndUpdate({_id: req.query.id},{$set: {image: req.file.path}})
        return  res.json({success: true,
        message: 'profile picture updated successfully',
                   },
        
    );
    }
    });          
  
}

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await Student.findById(req.params.id)
    await user.changePassword(req.body.oldPassword, req.body.newPassword)
    await user.save()
    res.json({user})
  } catch (error) {
      res.json({ message: 'something went wrong', error })
  }
}

exports.findAllStudent = async (req,res,next) => {
  const students = await Student.find()

  students
   ? res.json({ success: true, students:students })
   : res.json({ success: true, message:students })
}

exports.findAllStudentAccordinToSection = async (req,res,next) => {
  const {section} = req.query

  const students = await Student.find({section: section})
  
  res.json({ success: true, students:students })
  
}

exports.findAllStudentAccordinToClassAndCategory = async (req,res,next) => {
  const {currentClass,category} = req.query

  const students = await Student.find({currentClass: currentClass, category: category})
  
  res.json({ success: true, students:students })
  
}


exports.updateSingleStudent = async (req,res,next) => {
  const {id} = req.query;
  const {
    studentId,
    currentClass,
    section,
    category,
    classNumber
  } = req.body;

  console.log(classNumber);

  await Student.findByIdAndUpdate(id,{
    'currentClass': currentClass,
    'section': section,
    'category': category,
    'class[0].number': classNumber
  })

  res.json({success: true, message: `user with the ${id} is updated successfully`})
}

exports.findOneStudent = async (req,res,next) => {
  const {id} = req.query;

  const student = await Student.findById(id)

  student
   ? res.json({success: true, student: student})
   : res.json({success: true, student: student})
  
}

exports.removeStudent = async (req,res,next) => {
  const {id} = req.query;
  await Student.findOneAndDelete({_id: id})
  res.json({success: true, message: `student with the id ${id} has been removed`})
}

exports.getStudentAssignment = async (req,res,next) => {
  const {className,category} = req.query

  const result = await Assignment.find({class: className, category: category})
  res.json({success: true, message: result})
}