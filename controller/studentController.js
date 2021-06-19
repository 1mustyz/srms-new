const passport = require('passport');
const Staff = require('../models/Staff');
const Student = require('../models/Student')
const multer = require('multer');
const {singleUpload} = require('../middlewares/filesMiddleware');
// const connectEnsureLogin = require('connect-ensure-login')

exports.registerStudent = async function (req, res, next) {
  try {
    //query subjects table based on student section, category, current class and term
    //add 
    // req.body.class.number = req.body.classNumber or currentClass
    // req.body.class.term.number = req.body.term.number
    // req.body.class.term.subject = subjects array you queried
    //create the user instance
    user = new Student(req.body)
    const password = req.body.password ? req.body.password : 'password'
    //save the user to the DB
    Student.register(user, password, function (error, user) {
      if (error) return res.json({ success: false, error }) 
      res.json({ success: true, user })
    })
  } catch (error) {
    res.json({ success: false, error })
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
   : res.json({ success: true, message:'No student added yet' })
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
   : res.json({success: true, message: 'No register student yet'})
  
}

exports.removeStudent = async (req,res,next) => {
  const {id} = req.query;
  await Student.findOneAndDelete({_id: id})
  res.json({success: true, message: `student with the id ${id} has been removed`})
}