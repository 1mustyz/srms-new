const passport = require('passport');
const Staff = require('../models/Staff')
const Student = require('../models/Student')
const multer = require('multer');
const {singleUpload} = require('../middlewares/filesMiddleware');
// const connectEnsureLogin = require('connect-ensure-login')


exports.registerStaff = async (req, res, next) => {
    try {
      //create the user instance
      user = new Staff(req.body)
      const password = req.body.password ? req.body.password : 'password'
      //save the user to the DB
      await Staff.register(user, password, function (error, user) {
        if (error) return res.json({ success: false, error }) 
        res.json({ success: true, user })
      })
    } catch (error) {
      res.json({ success: false, error })
    }
  }

exports.loginStaff = (req, res, next) => {

    // perform authentication
    passport.authenticate('staff', (error, user, info) => {
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
        res.json({ success: true, message: 'staff login successful', user })
      })
    })(req, res, next)
  }

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await Staff.findById(req.params.id)
    await user.changePassword(req.body.oldPassword, req.body.newPassword)
    await user.save()
    res.json({user})
  } catch (error) {
      res.json({ message: 'something went wrong', error })
  }
}

exports.findAllStaff = async (req,res, next) => {

  const result = await Staff.find({});
  result.length > 0
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: 'no user added yet',})
}


exports.findAllTeachers = async (req,res, next) => {

  const result = await Staff.find({role: 'teacher'});
  result.length > 0
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: 'no teachers added yet',})
}

exports.findAllPrincipal = async (req,res, next) => {

  const result = await Staff.find({role: 'principal'});
  result.length > 0
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: 'no principal added yet',})
}

// exports.findAllStudents = async (req,res, next) => {

//   const result = await Student.find({role: 'student'});
//   result.length > 0
//    ? res.json({success: true, message: result,})
//    : res.json({success: false, message: 'no student added yet',})
// }

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
        await Staff.findOneAndUpdate({_id: req.query.id},{$set: {image: req.file.path}})
        return  res.json({success: true,
        message: 'profile picture updated successfully',
                   },
        
    );
    }
    });          
  
}

exports.setRole = async (req,res,next) => {
  const {role,teach} = req.body;
  console.log(teach)

  // req.session.user._id
  await Staff.findOneAndUpdate({username: req.query.id},{$set: {role: role}})

  role == "teacher" || role.includes('teacher')
   ? await Staff.findOneAndUpdate(req.query.id, {$set: {"teach":teach}})
   : await Staff.findOneAndUpdate(req.query.id, {$set: {"teach":null}})

   res.json({success: true, message: 'role has been set successfully'})
}

exports.removeStaff = async (req,res,next) => {
  const {id} = req.query;
  await Student.findOneAndDelete({_id: id})
  res.json({success: true, message: `staff with the id ${id} has been removed`})
}

exports.statistics = async (req, res) => {
  // fetch 
  // number of all students
  const allStudents = await Student.find({ }).countDocuments()
  const dayCare = await Student.find({ section: 'Daycare' }).countDocuments()
  const playClass = await Student.find({ section: 'Playclass' }).countDocuments()
  const kindergartens = await Student.find({ section: 'kindergartens' }).countDocuments()
  const grades = await Student.find({ section: 'Grade' }).countDocuments()
  const secondary = await Student.find({ $or: [ { section: 'JSS'}, { section: 'SSS'} ]}).countDocuments()
  const junior = await Student.find({ section: 'JSS' }).countDocuments()
  const senior = await Student.find({ section: 'SSS' }).countDocuments()
  const staffs = await Staff.find({ }).countDocuments()

  // count each class paid and unpaid
  // count each class number of students
  
  res.json([
    {detail: 'allStudents', value: allStudents}, {detail: 'dayCare', value: dayCare},
    {detail: 'playClass', value: playClass}, {detail: 'kindergartens', value: kindergartens}, 
    {detail: 'grades', value: kindergartens}, {detail:'junior', value: junior}, 
    {detail: 'senior', value: senior}, {detail: 'staff', value: staffs} ])

  // number of grades, secondary, junior, senior, day care, play class school students
  // 
}
