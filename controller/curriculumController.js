const Curriculum = require('../models/Curriculum');


exports.create = async (req,res,next) => {
    await Curriculum.insertMany(req.body);
    res.json({success: true, message: `curriculum added successfully`});
}

exports.getAllCurriculum = async (req,res,next) => {
    const result = await Curriculum.find()

    result
     ? res.json({success: true, message: result})
     : res.json({success: false, message: `No curriculum added yet`})
}

exports.getSingleCurriculum = async (req,res,next) => {
    const {number,section,category} = req.body;
    const result = await Curriculum.findOne({number: number, section: section, category: category});

    result
     ? res.json({success: true, message: result})
     : res.json({success: false, message: `No curriculum added yet`})
}

exports.updateSingleCurriculum = async (req,res,next) => {
    const {number,section,category} = req.body;
    await Curriculum.updateOne({
        number: number, section: section, category: category
    }, 
    {class: req.body});

    res.json({success: true, message: `curriculum updated`})
    
}

exports.deleteSingleCurriculum = async (req,res,next) => {
    const {number,section,category} = req.body;
    await Curriculum.deleteOne({
        number: number, section: section, category: category
    });

    res.json({success: true, message: `curriculum deleted`})
}

exports.deleteAllCurriculum = async (req,res,next) => {
    await Curriculum.delete();

    res.json({success: true, message: `All curriculum deleted`})
}