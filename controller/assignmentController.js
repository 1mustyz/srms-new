const Assignment = require('../models/Assignment');
const multer = require('multer');
const {singleFileUpload} = require('../middlewares/filesMiddleware');
const Staff = require('../models/Staff');

exports.createAssignmentText = async (req,res,next) => {
    const {username,staffId,firstName,lastName,className,category,head,text} = req.body
    await Assignment.findByIdAndUpdate(req.body.id, {
        username: username,
        staffId: staffId,
        firstName: firstName,
        lastName: lastName,
        class: className,
        category: category,
        head: head,
        text: text
    })
    res.json({success: true, message: `assignment created for class ${req.body.className}`})
}

exports.createAssignmentFile = async (req,res,next) => {
    
    // console.log(req.files.file)
    singleFileUpload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
        return res.json(err.message);
        }
        else if (err) {
          return res.json(err);
        }
        else if (!req.file) {
          return res.json({"file": req.file, "msg":'Please select file to upload'});
        }
        if(req.file){
          const result =  await Assignment.collection.insertOne({file: req.file.path})
            return  res.json({success: true,
            message: result },
            
        );
        }
        }); 
} 

exports.deleteAssignment = async (req,res,next) => {
    const { assId } = req.body.assId
    await Assignment.findByIdAndDelete(assId)
    res.json({success: true, message: 'assignment deleted'})
}

exports.getAllAssignmentAdmin = async (req,res,next) => {
    const result = await Assignment.find()
    res.json({success: true, message: result})
    
}

exports.getAllAssignmentForTeacher = async (req,res,next) => {
    const {className,category} = req.query
    const result = await Assignment.find({class: className, category: category})
    res.json({success: true, message: result})
    
}