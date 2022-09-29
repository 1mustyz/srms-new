const Subject = require('../models/Subject');
const Score = require('../models/Score')
const Curriculum = require('../models/Curriculum')
const termAndSession = require('../models/TermSetter')
const TermResult = require('../models/TermResult');


exports.create = async (req,res,next) => {
    try {
        await Subject.insertMany(req.body)
        res.json({success: true, message: 'courses inserted successfullty'});
    } catch (error) {
        return res.status(400).json({ message: error.errmsg })
    }
}

// exports.delete = async (req,res,next) => {
//     const {id} = req.body;
//     await Subject.deleteOne({_id: id})
//     res.json({success: true, message: `course with the ${id} deleted successfullty`});
// }

exports.delete = async (req,res,next) => {
    const {id,subject} = req.body;
    const currentSession = await termAndSession.find()

    //get all student score total
    const subjectScore = await Score.find({
        subject,
        term: currentSession[0].termNumber,
        session: currentSession[0].session.year})
    
    console.log('////////////',subjectScore.total)    

    // for each of the subject score decrease term result total
    
    subjectScore.map(async score => {
    // console.log('-------------------',score.total)    

            // remove corresponding scores    
        await Score.deleteMany({
            subject,
            username: score.username,
            term: currentSession[0].termNumber,
            session: currentSession[0].session.year})

            // recalculate the average of each student affected

        let avg = await Score.aggregate([
            {$match:{
                username: score.username,
                term: currentSession[0].termNumber,
                session: currentSession[0].session.year
            }},
            {$group:{_id:"$username",
             average:{$avg:"$total"},
             noOfcourse: {$sum:1},
             total: {$sum: "$total"}

            }}
        ])
        console.log(avg)  
        
        // inserting the new average to term result
        await TermResult.findOneAndUpdate({username: score.username},
            {$set:
            {average:avg[0].average, noOfcourse:avg[0].noOfcourse, total:avg[0].total}
        },{useFindAndModify: false})
    })

    await Curriculum.updateMany({},{$pull: {subject:subject}})
    await Subject.deleteOne({_id: id})
    res.json({success: true, message: `course with the ${id} deleted successfullty`});
}

exports.update = async (req,res,next) => {
    const {subject,id,newSubject} = req.body;
    const currentSession = await termAndSession.find()

    //1. first goto the subject document and update the name
    await Subject.updateOne({_id: id},{$set:{subject: newSubject}})

    //2. find all curriculums which the subject appears in and update
    await Curriculum.updateMany({subject:subject},{$set:{'subject.$':newSubject}})
    
    //3. find and update all scores document containing the subject and of the present term and session
    await Score.updateMany(
        {
        subject,
        term: currentSession[0].termNumber,
        session: currentSession[0].session.year
        },
        {$set:{subject:newSubject}}
    )
        
    // const subjectScore = await Score.find({
    //     subject:newSubject,
    //     term: currentSession[0].termNumber,
    //     session: currentSession[0].session.year}
    // )
        // console.log(subjectScore)
    



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

exports.deleteAllSubject = async (req,res,next) => {
    await Subject.deleteMany({})
    res.json({success: true, message: 'All subject deleted'})

}