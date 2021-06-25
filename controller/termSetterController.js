const TermSetter = require('../models/TermSetter');

exports.setNewTerm = async (req,res,next) => {
    const {newTerm} = req.body;

    const result = await TermSetter.find().countDocuments()

    result > 0
     ? await TermSetter.remove()
     : ''

    await TermSetter.collection.insertOne({currentTerm: newTerm});
    res.json({success: true, message: 'new term has been set successfully'})
}

exports.getCurrentTerm = async (req,res,next) => {
    const result = await TermSetter.find()
    res.json({success: true, result})
}