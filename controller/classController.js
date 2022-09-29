const Class = require('../models/Classes');

exports.create = async (req,res,next) => {
    const {className} = req.body;
    try {
        await Class.insertMany(req.body)
        res.json({success: true, message: `${className} added`})
    } catch(error) {
        return res.status(400).json({ message: error.errmsg })
    }
}

exports.update = async (req,res,next) => {
    const {id,className,section} = req.body;

    await Class.updateOne({_id: id}, {$set: {class: className, section: section}})
    res.json({success: true, message: `${className} updated`})
}

exports.delete = async (req,res,next) => {
    const {id} = req.body;
    
    await Class.findByIdAndDelete(id)
    res.json({success: true, message: `deleted`})

}

exports.getAllClasses = async (req,res,next) => {
    const {section} = req.query

    const result = await Class.find({section: section})

    result.length > 0
     ? res.json({success: true, message: result})
     : res.json({success: false, message: result})
}

exports.getEveryClass = async (req,res,next) => {
    const {section} = req.query

    const result = await Class.find()

    result.length > 0
     ? res.json({success: true, message: result})
     : res.json({success: false, message: result})
}