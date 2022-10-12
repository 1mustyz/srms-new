const passport = require('passport')
const Staff = require('../models/Staff')
const Student = require('../models/Student')
const multer = require('multer')
const { singleUpload } = require('../middlewares/filesMiddleware')
const mongoose = require('mongoose')
// const connectEnsureLogin = require('connect-ensure-login')
const cloudinaryUplouder = require('./helper/uploadCloudinary')
const createStaffPdf = require('../pdf_generator/view_all_staff')

// staff registration controller
exports.registerStaff = async (req, res, next) => {
  try {
    // create the user instance
    user = new Staff(req.body)
    const password = req.body.password ? req.body.password : 'password'
    // save the user to the DB
    await Staff.register(user, password, function (error, user) {
      if (error) return res.json({ success: false, error })
      res.json({ success: true, user })
    })
  } catch (error) {
    res.json({ success: false, error })
  }
}
// staff login controller
exports.loginStaff = (req, res, next) => {
  // perform authentication
  passport.authenticate('staff', (error, user, info) => {
    if (error) return res.json({ success: false, error })
    if (!user) {
      return res.json({
        success: false,
        message: 'username or password is incorrect'
      })
    }
    // login the user
    req.login(user, (error) => {
      if (error) {
        res.json({ success: false, message: 'something went wrong pls try again' })
      } else {
        req.session.user = user
        res.json({ success: true, message: 'staff login successful', user })
      }
    })
  })(req, res, next)
}

// reset password by staff
exports.resetPassword = async (req, res, next) => {
  try {
    const user = await Staff.findById(req.params.id)
    await user.changePassword(req.body.oldPassword, req.body.newPassword)
    await user.save()
    res.json({ message: 'password reset successful', user })
  } catch (error) {
    res.json({ message: 'something went wrong', error })
  }
}

// reset password for staff by admin
exports.adminResetStaffPassword = async (req, res, next) => {
  try {
    const user = await Staff.findById(req.params.id)
    await user.setPassword('password')
    await user.save()
    res.json({ message: 'password reset successful', user })
  } catch (error) {
    res.json({ message: 'something went wrong', error })
  }
}

exports.findAllStaff = async (req, res, next) => {
  const result = await Staff.find({})
  result.length > 0
    ? res.json({ success: true, message: result })
    : res.json({ success: false, message: result })
}

/**
 * This controller get all staff but without admin 
 */
 exports.getAllStaffToPrint = async (req, res, next) => {

  try {
    const result = await Staff.aggregate([
      {$match: {role:{$nin:['Admin']}}},
      {$project: {_id:0, createdAt:0, updatedAt:0, hash:0, salt:0}}
    ])
    const noOfStaff = result.length

    
    // generate pdf report
  const data = { result, noOfStaff }
  // console.log(result,noOfStaff)

  const pdf = await createStaffPdf(data)
  // then send to frontend to download
  res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
  res.send(pdf)
  } catch (error) {
    console.log(error)
  }
}


exports.findAllTeachers = async (req, res, next) => {
  const result = await Staff.find({ role: 'subjectTeacher' })
  result.length > 0
    ? res.json({ success: true, message: result })
    : res.json({ success: false, message: result })
}

exports.findAllPrincipal = async (req, res, next) => {
  const result = await Staff.find({ role: 'Principal' })
  result.length > 0
    ? res.json({ success: true, message: result })
    : res.json({ success: false, message: result })
}

exports.findAllClassTeacher = async (req, res, next) => {
  const result = await Staff.find({ role: 'classTeacher' })
  result.length > 0
    ? res.json({ success: true, message: result })
    : res.json({ success: false, message: result })
}

exports.singleStaff = async (req, res, next) => {
  const query = {
    $or: [
      { username: { $regex: req.query.keyword, $options: '$i' } },
      { firstName: { $regex: req.query.keyword, $options: '$i' } },
      { lastName: { $regex: req.query.keyword, $options: '$i' } }
    ]
  }

  const result = await Staff.find(query)
  result.length > 0
    ? res.json({ success: true, message: result })
    : res.json({ success: false, message: 'Not Found' })
}

exports.setProfilePic = async (req, res, next) => {
  singleUpload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.json(err.message)
    } else if (err) {
      return res.json(err)
    }else if (!req.file) {
        return res.json({success: false,"file": req.file, "msg":'Please select file to upload'});
      }else if (req.file.size > 5000000) {
        return res.json({success: false, "file": req.file, "msg":'File size too large, file should no be greater than 5mb '});
      }
    if(req.file){
        console.log(req.query.username)

        // before uploading image check for previous image and delete from cloud
        let staffImage = await Staff.findOne({username: req.query.username})
        
        let isImageDeleted 
        if (staffImage.image != '1.jpg' && staffImage.image != null) isImageDeleted = await cloudinaryUplouder.delete(staffImage.image)
        else isImageDeleted = true 

        // sending image to claudinary and saving the link to database
        let mediaImage 
        if(isImageDeleted) mediaImage = await cloudinaryUplouder.upload(req.file.path)

        await Staff.findOneAndUpdate({username: req.query.username},{$set: {image: mediaImage}},{useFindAndModify: false})
        let singleStaff = await Staff.findOne({username: req.query.username})
        return  res.json({success: true,
        message: singleStaff,
                   },
        
    );
    }
    });          
  
}

exports.setRole = async (req, res, next) => {
  const { role, teach, classTeacher } = req.body

  const result = await Staff.find({ _id: req.query.id }, { role: 1, teach: 1, classTeacher: 1 })

  // console.log( teach)

  // check if staff has role
  result[0].role.includes(role)
    ? ''
    : await Staff.findByIdAndUpdate(req.query.id, { $push: { role } })

  // if staff dosent have a role
  if (role == 'None') {
    await Staff.findByIdAndUpdate(req.query.id, { $set: { role: [], teach: [], classTeacher: [] } })
  } else if (role == 'subjectTeacher' || role.includes('subjectTeacher')) {
    if (result[0].teach.length > 0) {
      const isSameClass = result[0].teach.filter(obj => obj.class == teach.class && obj.category == teach.category)
      // console.log('11111111111111111111',isSameClass[0].ind)
      if (isSameClass.length > 0) {
        const index = await Staff.aggregate([
          { $match: { _id: mongoose.Types.ObjectId(req.query.id) } },
          { $project: { index: { $indexOfArray: ['$teach.class', teach.class] } } }
        ])
        const newSubject = `teach.${index[0].index}.subject`
        // TODO
        await Staff.findByIdAndUpdate(req.query.id, { $push: { [newSubject]: teach.subject.toString() } })
      } else {
        console.log('updating teach', teach)
        await Staff.findByIdAndUpdate(req.query.id, { $push: { teach } })
      }
    } else {
      console.log('updating teach', teach)
      await Staff.findByIdAndUpdate(req.query.id, { $push: { teach } })
    }
  } else if (role == 'classTeacher') {
    result[0].classTeacher.includes(classTeacher)
      ? ''
      : await Staff.findByIdAndUpdate(req.query.id, { $push: { classTeacher } })
  } else {
    // await Staff.findByIdAndUpdate(req.query.id,{$push: {"role": role}})
  }

  res.json({ success: true, message: 'role has been set successfully' })
}

exports.removeStaff = async (req,res,next) => {
  const {id} = req.query;
  try {
    
    // before uploading image check for previous image and delete from cloud
    let staffImage = await Staff.findOne({_id: id})
    console.log(staffImage)
    let isImageDeleted
    if (staffImage != '1.jpg' && staffImage != null) isImageDeleted = await cloudinaryUplouder.delete(staffImage.image)
    else isImageDeleted = true
    
    if(isImageDeleted) await Staff.findOneAndDelete({_id: id})
    res.json({success: true, message: `staff with the id ${id} has been removed`})
  } catch (error) {
    console.log(error)
  }
}

exports.editStaff = async (req, res, next) => {
  const { id } = req.query
  await Staff.findByIdAndUpdate(id, req.body)
  res.json({ success: true, message: `staff with the id ${id} has been edited` })
}

exports.statistics = async (req, res) => {
  // fetch
  // number of all students
  const allStudents = await Student.find({suspend: false, status: "Active" }).countDocuments()
  const dayCare = await Student.find({ section: 'Daycare',suspend: false, status: "Active"  }).countDocuments()
  const playClass = await Student.find({ section: 'Playclass',suspend: false, status: "Active"  }).countDocuments()
  const kindergarten = await Student.find({ section: 'Kindergartens',suspend: false, status: "Active"  }).countDocuments()
  const grades = await Student.find({ section: 'Grade',suspend: false, status: "Active"  }).countDocuments()
  const secondary = await Student.find({ $or: [{ section: 'JSS' }, { section: 'SSS' }] }).countDocuments()
  const junior = await Student.find({ section: 'JSS',suspend: false, status: "Active"  }).countDocuments()
  const senior = await Student.find({ section: 'SSS',suspend: false, status: "Active" }).countDocuments()
  const staffs = await Staff.find({ }).countDocuments()

  // count each class paid and unpaid
  // count each class number of students

  res.json([
    { detail: 'allStudents', value: allStudents }, { detail: 'dayCare', value: dayCare },
    { detail: 'playClass', value: playClass }, { detail: 'kindergarten', value: kindergarten },
    { detail: 'grades', value: grades }, { detail: 'junior', value: junior },
    { detail: 'senior', value: senior }, { detail: 'staff', value: staffs }])

  // number of grades, secondary, junior, senior, day care, play class school students
  //
}
