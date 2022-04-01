const Curriculum = require('../models/Curriculum');
const Score = require('../models/Score')
const Student = require('../models/Student')
const termAndSession = require('../models/TermSetter')
const termResult = require('../models/TermResult')
const SessionResult = require('../models/SessionResult')

exports.create = async (req,res,next) => {
    const {section,name,category} = req.body
    let curricula
    const currentSession = await termAndSession.find({},{session: 1, termNumber: 1})
    
    // fetch curriculum based on SSS or others
    if(section !== 'SSS'){
       curricula = await Curriculum.find({name: name})
    } 
    else{
       curricula = await Curriculum.find({name: name, category: category})
    } 

    // if curriculum already exists
    if(curricula.length){
        // update the curriculum and end
        await Curriculum.updateOne({name:name, category: category}, {$push:{subject: req.body.subject}})
        const score = await Score.find({
            class: name, 
            category: category,
            session: currentSession[0].session.year,
            term: currentSession[0].termNumber
        })
        const newCurricula = await Curriculum.find({name: name, category, category})
        const numOfSubjects = newCurricula[0].subject.length

        // if score exists update score and term results of students
        //1. update noOfCourse in term result
        //else
        //2. create scores and update noOfCourse in term result        

        if(score.length){
            // fetch the students in the class
            const students = await Student.find({
                currentClass: name, category: category, 
                status: 'Active' })

            req.body.subject.map(subject=>{
                // add score sheets for the new subjects to the students
                students.map(async std=>{
                    await Score.collection.insertOne({
                        subject,
                        username: std.username,
                        studentId: std._id,
                        class: std.currentClass,
                        category: std.category,
                        firstName: std.firstName,
                        lastName: std.lastName,
                        term: currentSession[0].termNumber,
                        session: currentSession[0].session.year
                    })
                    //1. update number of courses for the student at hand
                    await termResult.updateMany({
                        session: currentSession[0].session.year,
                        term: currentSession[0].termNumber,
                        username: std.username
                        }, {
                        noOfCourse: numOfSubjects
                        })
                })
            })
            res.json({success: true, message: "curriculum for class with students that has score sheet updated successfully"})
        }else{
             //2.
             // no need for all these code since nno students in the class
             // fetch the students in the class
            //  const students = await Student.find({
            //     currentClass: name, category: category, 
            //     status: 'Active' })

            // req.body.subject.map(subject=>{
            //     // add score sheets to the students
            //     students.map(async std=>{
            //         await Score.collection.insertOne({
            //             subject,
            //             username: std.username,
            //             studentId: std._id,
            //             class: std.currentClass,
            //             category: std.category,
            //             firstName: std.firstName,
            //             lastName: std.lastName,
            //             term: currentSession[0].termNumber,
            //             session: currentSession[0].session.year
            //         })
            //         //1. update number of courses for the student at hand
            //         await termResult.updateMany({
            //             session: currentSession[0].session.year,
            //             term: currentSession[0].termNumber,
            //             username: std.username
            //             }, {
            //             noOfCourse: numOfSubjects
            //             })
            //     })
            // })
            res.json({success: true, message: `curriculum of class with no students updated successfully`});
        }
        
    }
    else{
        // no existing curriculum and score sheetcreate new
            section !== 'SSS'
            ? req.body.category = "none"
            : ''   
            await Curriculum.insertMany(req.body);
            // fetch the students in the class
            const students = await Student.find({ 
                                status: 'Active',
                                category: req.body.category,
                                currentClass: req.body.name
                            })

            if(students.length > 0){
                req.body.subject.map(subject=>{
                    // add score sheets to the students
                    students.map(async std=>{
                      await Score.collection.insertOne({
                            subject,
                            username: std.username,
                            studentId: std._id,
                            class: std.currentClass,
                            category: std.category,
                            firstName: std.firstName,
                            lastName: std.lastName,
                            term: currentSession[0].termNumber,
                            session: currentSession[0].session.year
                        })
                    })
                }) 
            res.json({success: true, message: `new curriculum for class with already registered students added successfully`, students});   
            }
            else{
                res.json({success: true, message: `new curriculum with no registered students in the class added successfully`});
            }
        }
}

exports.getAllCurriculum = async (req,res,next) => {
    const result = await Curriculum.find()

    result
     ? res.json({success: true, message: result})
     : res.json({success: false, message: result})
}

exports.getAdminAllCurriculum = async (req,res,next) => {
    const result = await Curriculum.find()

    result
     ? res.json({success: true, subjects: result})
     : res.json({success: false, subjects: result})
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
    const {name,section,category} = req.body;
    const currentSession = await termAndSession.find({},{session: 1, termNumber: 1})

//1. delete curriculum
//2. delete all corresponding scores
//3. reset average, total and noOfCourses in term and session result to 0

        //1
    await Curriculum.updateMany({name,section,category}, {$set:{subject: []}});
        //2
    await Score.deleteMany({
        class:name,
        category, 
        session:currentSession[0].session.year, 
        term:currentSession[0].termNumber
    })

        //3
    await termResult.updateMany({
        class:name,
        session:currentSession[0].session.year, 
        term:currentSession[0].termNumber
    }, {$set:{noOfCourse:0,total:0,average:0}})

        //3
    await SessionResult.updateMany({
        class:name,
        session:currentSession[0].session.year
    },
    {$set:{average:0,position:0}})

    res.json({success: true, message: `curriculum deleted`})
}

exports.deleteAllCurriculum = async (req,res,next) => {
    const currentSession = await termAndSession.find({},{session: 1, termNumber: 1})

//1. delete all curriculum
//2. delete all corresponding scores
//3. reset average, total and noOfCourses in term and session result to 0

        //1
    await Curriculum.deleteMany({});

        //2
    await Score.deleteMany({
        session:currentSession[0].session.year, 
        term:currentSession[0].termNumber
    })

        //3
    await termResult.updateMany({
        session:currentSession[0].session.year, 
        term:currentSession[0].termNumber
    }, {$set:{noOfCourse:0,total:0,average:0}})

        //3
    await SessionResult.updateMany({session:currentSession[0].session.year},{$set:{average:0,position:0}})

    res.json({success: true, message: `All curriculum deleted`})
}

exports.getClassCurriculum = async (req,res,next) => {
    const {currentClass,category} = req.query;
    const result = await Curriculum.findOne({name: currentClass, category: category});

    result
     ? res.json({success: true, result})
     : res.json({success: false, result})
}

exports.deleteSubject = async (req,res,next) => {
    const {className,category,section,subject} = req.body;

    // remove subject and update curriculum
    const currentSession = await termAndSession.find()
    const result = await Curriculum.updateOne({
        name: className,
        category: category,
        section: section},
        {
         $pull:{subject: subject}   
        });

    // get corresponding student
    const students = await Student.find({
        currentClass: className, category: category, 
        session: currentSession[0].session.year,status: 'Active' })
        
    console.log('===================',students)
        
    const newCurricula = await Curriculum.find({name: className, category, category})
    const numOfSubjects = newCurricula[0].subject.length  
    console.log('+++++++++++++++++',numOfSubjects)  

    students.map(async std=>{

        // find corresponding subject score
        const subjectScore = await Score.findOne({
            class: className,
            subject,
            username: std.username,
            term: currentSession[0].termNumber,
            session: currentSession[0].session.year},{total:1})

        // remove corresponding scores    
        await Score.deleteMany({
        class: className,
        subject,
        username: std.username,
        term: currentSession[0].termNumber,
        session: currentSession[0].session.year}) 
    
        // update number of courses for the student at hand and subtract the deleted score subject
        console.log('-------------------------',subjectScore.total)
        await termResult.updateOne({
            session: currentSession[0].session.year,
            term: currentSession[0].termNumber,
            username: std.username
            }, {
            noOfCourse: numOfSubjects,
            $inc: {total: -subjectScore.total}
            })
        })

    res.json({success: true, result})
}


// *****************************************************************************************************
// The code below is very sensitive make sure you understand it before using it
exports.deleteStudentDuplicateFromScore = async (req,res,next) => {


    const {
        classNameGrade2,subjectGrade2, categoryGrade2,
        classNameGrade4,subjectGrade4, categoryGrade4,
        classNameGrade5,subjectGrade5, categoryGrade5
    } = req.query
    const currentSession = await termAndSession.find()

    
    
    const deleteDuplicate = async (className,subject,category) => {
        let frequentStd = {}

        const getAllClassStudentFromAsubject = await Score.find({
            class:className,
            category: category,
            subject:subject,
            session: currentSession[0].session.year,
            term: currentSession[0].termNumber,
        })
        console.log(getAllClassStudentFromAsubject.length)
        const doSomeWork = () => {
            if (getAllClassStudentFromAsubject.length > 0){

                getAllClassStudentFromAsubject.forEach((std)=>{
                
                    if (frequentStd[std.username] == undefined ){
                        frequentStd[std.username] = 1
                    }else frequentStd[std.username] = frequentStd[std.username] +1
                })
            }
        }
        const promise = new Promise((resolve,reject)=>{
            resolve(doSomeWork())
        })

        promise.then(async ()=>{
            for (const [key, value] of Object.entries(frequentStd)) {
                if(value == 2){
                    console.log(`${key}: ${value}`);
                    await Score.findOneAndDelete({
                        username:key,
                        class:className,
                        category: category,
                        subject:subject,
                        session: currentSession[0].session.year,
                        term: currentSession[0].termNumber,
                    })

                }
            }
        })
    }
 
    const allPromise = new Promise(async (resolve,reject)=>{
        resolve(
            await deleteDuplicate(classNameGrade2, subjectGrade2, categoryGrade2),
            await deleteDuplicate(classNameGrade4, subjectGrade4, categoryGrade4),
            await deleteDuplicate(classNameGrade5, subjectGrade5, categoryGrade5),

        )
    })
    allPromise.then(()=>{
        res.json({success:true, message:"Duplication deleted"})

    })
    

}

// *****************************************************************************************************
// The code below is very sensitive make sure you understand it before using it

exports.deleteSubjectFromScore = async (req,res,next) => {
    const {subjectName} = req.body

    try {
        await Score.deleteMany({class:["Grade2","Grade3","Grade4","Grade5"], subject:subjectName})
        res.json({success:true, message:"scores deleted successfull"})
    } catch (error) {
        console.log(error)
    }
}