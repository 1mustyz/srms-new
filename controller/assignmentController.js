const Assignment = require('../models/Assignment');
const TermSetter = require('../models/TermSetter')
const multer = require('multer');
const {singleFileUpload} = require('../middlewares/filesMiddleware');
const Staff = require('../models/Staff');
const cloudinaryUplouder = require('./helper/uploadCloudinary')

exports.createAssignmentText = async (req,res,next) => {
    const {username,staffId,firstName,lastName,className,category,head,text,subject} = req.body
    const termAndSession = await TermSetter.find()
    const d = new Date()

    await Assignment.findByIdAndUpdate(req.body.id, {
        username: username,
        staffId: staffId,
        firstName: firstName,
        lastName: lastName,
        class: className,
        category: category,
        term: termAndSession[0].termNumber,
        session: termAndSession[0].session.year,
        head: head,
        text: text,
        subject,
        date: d.getDate(),
        created_at: d.getDate()
    })
    res.json({success: true, message: `assignment created for class ${req.body.className}`})
}

exports.createAssignmentFile = async (req,res,next) => {
    
    // console.log(req.files)
    singleFileUpload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
        return res.json(err.message);
        }
        else if (err) {
          return res.json(err);
        }
        else if (!req.file) {
          return res.json({success: false,"file": req.file, "msg":'Please select file to upload'});
        }else if (req.file.size > 5000000) {
          return res.json({success: false, "file": req.file, "msg":'File size too large, file should no be greater than 5mb '});
        }
        if(req.file){
            // console.log(req.file)
            // upload file to claudinary
            let mediaFile = await cloudinaryUplouder.upload(req.file.path)

            // insert file links receive from claudinary to database
            await Assignment.collection.insertOne({file: mediaFile})
            const allAssignment = await Assignment.find();  
            return  res.json({success: true,message: allAssignment },);
  
         
        }
        }); 
} 

exports.deleteAssignment = async (req,res,next) => {
    const { assignmentId } = req.query
    //1. get assignment collection from database
    const assignment = await Assignment.findOne({_id: assignmentId},{file:1})
    let isDeletedFile

    //2. check if the assignment file is valid and delete
    if(assignment.file != null || assignment.file != undefined ) isDeletedFile = await cloudinaryUplouder.delete(assignment.file)
    else isDeletedFile = true

    //3. check if the file is actually deleted then delete the collection from database
    if (isDeletedFile){
        await Assignment.findByIdAndDelete({_id: assignmentId})
        const allAssignment = await Assignment.find()
        res.json({success: true, message: 'assignment deleted', allAssignment})
    }else {
        res.json({success: false, message: 'something went wrong'})

    }
}

exports.getAllAssignmentAdmin = async (req,res,next) => {
    const result = await Assignment.find()
    let currentDate = new Date()
    
    // make uploade assignment to expire after 7 days
    result.forEach(async (ass) => {
        const expiryDate = new Date()
        expiryDate.setDate(parseInt(ass.created_at) + 7)
        console.log(expiryDate < currentDate)
        expiryDate < currentDate && await Assignment.findByIdAndDelete(ass._id)
    })
    res.json({success: true, message: result})
    
}

exports.getAllAssignmentForTeacher = async (req,res,next) => {
    const {className,category} = req.query
    
    const result = await Assignment.find({class: className, category: category})
    let currentDate = new Date()
    
    // make uploade assignment to expire after 7 days
    result.forEach(async (ass) => {
        const expiryDate = new Date()
        expiryDate.setDate(parseInt(ass.created_at) + 7)
        expiryDate < currentDate && await Assignment.findByIdAndDelete(ass._id)
    })
    res.json({success: true, message: result})
    
    
}

