const Cognitive = require('../models/Cognigtive');
const AddNewCognitive = require('../models/AddNewCognitive');


exports.addNewCognitive = async (req,res,next) => {

    await AddNewCognitive.insertMany(req.body);
    res.json({success: true, message: 'a new cognitive has been added'})
}

exports.deleteAddNewCognitive = async (req,res,next) => {

    await AddNewCognitive.findByIdAndDelete(req.body.id)
    res.json({success: true, message: 'a new cognitive has been deleted'})

}

exports.updateAddNewCognitive = async (req,res,next) => {
    const {name,id} = req.body
    await AddNewCognitive.findByIdAndUpdate(id, {name: name})
    res.json({success: true, message: 'a new cognitive has been updated'})

}

exports.getAllAddNewCognitive = async (req,res,next) => {
    const result = await AddNewCognitive.find()
    result.length > 0
     ? res.json({success: true, result})
     : res.json({success: false, result})
}

exports.createStudentCognitive = async (req,res,next) => {
    await Cognitive.collection.insertOne(req.body)
    res.json({success: true, message: 'you have created a cognitive for a student'})
}

exports.updateStudentCognitive = async (req,res,next) => {
    const {id, cognitive} = req.body
    await Cognitive.findByIdAndUpdate(id, {cognitive: cognitive})
    res.json({success: true, message: 'you have updated a cognitive for a student'})

}

exports.getAllStudentCognitive = async (req,res,next) => {
    const result = await Cognitive.find()
    result.length > 0
     ? res.json({success: true, result})
     : res.json({success: false, result})
}