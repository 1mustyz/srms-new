const Subject = require('../models/Subject');
const Score = require('../models/Score')
const Curriculum = require('../models/Curriculum')


exports.create = async (req,res,next) => {
    await Subject.collection.insertOne(req.body)
    res.json({success: true, message: 'courses inserted successfullty'});
}

exports.delete = async (req,res,next) => {
    const {id} = req.body;
    await Subject.deleteOne({_id: id})
    res.json({success: true, message: `course with the ${id} deleted successfullty`});
}

exports.delete = async (req,res,next) => {
    const {id,subject} = req.body;
    await Curriculum.updateMany({},{$pull: {subject:subject}})
    await Subject.deleteOne({_id: id})
    res.json({success: true, message: `course with the ${id} deleted successfullty`});
}

exports.update = async (req,res,next) => {
    const {subject,id} = req.body;
    await Subject.updateOne({_id: id},{$set:{subject: subject}})
    res.json({success: true, message: `course with the ${id} updated successfullty`});
}

exports.getAllSubject = async (req,res,next) => {
    const result = await Subject.find()
    result.length > 0
     ? res.json({success: true, message: result})
     : res.json({success: true, message: result})
    
}

exports.updateStdScoreFirstName = async (req,res,next) => {
    const {username,firstName} = req.body
    const result = await Score.updateMany({username}, {firstName})
    res.json({success: true, message: result})
    
}