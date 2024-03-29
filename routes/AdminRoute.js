const router = require('express').Router()
const staffController = require('../controller/staffController')
const logoutController = require('../controller/logoutController')
const paymentController = require('../controller/paymentController')
const studentController = require('../controller/studentController')
const curriculumController = require('../controller/curriculumController')
const subjectController = require('../controller/subjectController')
const classController = require('../controller/classController')
const termSetterController = require('../controller/termSetterController')
const cognitiveController = require('../controller/cognitiveController')
const assignmentController = require('../controller/assignmentController')
const idGenerator = require('../middlewares/idGenerator')
const teacherController = require('../controller/teacherController')
const examOfficerController = require('../controller/examOfficeController')
const setNewTerm = require('../controller/setNewTerm')
const { Validator } = require('../validators')
const { staffValidator, studentValidator } = require('../validators/register')
const { queryString } = require('../validators/query')
const { paymentValidator } = require('../validators/payment')

router.post('/register-staff',
  idGenerator.staffIdGenerator,
  Validator(staffValidator, 'body'),
  staffController.registerStaff)

router.post('/register-student',
  idGenerator.studentIdGenerator,
  Validator(studentValidator, 'body'),
  studentController.registerStudent)

router.post('/login', staffController.loginStaff)
router.post('/change-password/:id', staffController.resetPassword)
router.post('/reset-student-password/:id', studentController.adminResetStudentPassword)
router.post('/reset-staff-password/:id', staffController.adminResetStaffPassword)
router.post('/logout', logoutController.logout)
router.post('/add-payment', paymentController.addPaymentTypes)
router.post('/add-curriculum', curriculumController.create)
router.post('/create-subject', subjectController.create)
router.post('/create-class', classController.create)
router.post('/verify-payment', Validator(paymentValidator, 'body'), paymentController.verifyPayment)
router.post('/set-new-term', termSetterController.setNewTerm)
router.post('/set-new-session', termSetterController.setSession)
router.post('/add-new-cognitive-item', cognitiveController.addNewCognitive)
router.post('/change-student-class', studentController.changeStudentClass)

// admin set his profile
router.put('/set-profile-pic', staffController.setProfilePic)

// set role for staff
router.put('/set-role', staffController.setRole)

router.put('/add-student-cognitive', cognitiveController.createStudentCognitive)
router.put('/update-payment', paymentController.updatePaymentTypes)

router.put('/update-single-student-profile', studentController.updateSingleStudent)
router.put('/update-single-curriculum', curriculumController.updateSingleCurriculum)
router.put('/update-single-subject', subjectController.update)
router.put('/update-class', classController.update)
router.put('/update-cognitive-item', cognitiveController.updateAddNewCognitive)
router.put('/edit-staff', staffController.editStaff)
router.put('/edit-student', studentController.editStudent)
router.put('/final-submission', teacherController.finalSubmision)
router.put('/allow-submission-priviledge', examOfficerController.allowPriviledge)
router.put('/suspend-a-student', studentController.suspendAstudent)
router.put('/update-std-score-firstName', subjectController.updateStdScoreFirstName)

// *****************************************************************************************************
// The code below is very sensitive make sure you understand it before using it
router.put('/promote-a-class', studentController.promoteOrDemoteAclass)
router.put('/suspend-link-setup', studentController.makeSuspendField)
router.put('/reflect-student-category-on-term-and-sesion-resutl', studentController.reflectStudentCategoryFieldOnTermAndSessionResult)

// *****************************************************************************************************
// The code below is very sensitive make sure you understand it before using it
router.put('/promote-a-student', studentController.promoteOrDemoteAstudent)

router.get('/get-all-curriculum', curriculumController.getAllCurriculum)
router.get('/get-all-admin-curriculum', curriculumController.getAdminAllCurriculum)

router.get('/get-single-curriculum', curriculumController.getSingleCurriculum)
router.get('/dashboard', staffController.statistics)
router.get('/get-payment-type', paymentController.getPayment)
router.get('/get-all-paid-student', paymentController.getAllPaidStudent)
router.get('/get-all-un-paid-student', paymentController.getAllUnPaidStudent)
router.get('/get-all-teachers', staffController.findAllTeachers)
router.get('/get-all-principal', staffController.findAllPrincipal)
router.get('/get-all-staff', staffController.findAllStaff)
router.get('/get-all-student', studentController.findAllStudent)

router.get('/get-all-student-according-to-section',
  studentController.findAllStudentAccordinToSection)

router.get('/get-all-student-according-to-class-category',
  studentController.findAllStudentAccordinToClassAndCategory)

router.get('/get-paid-student-statistics', paymentController.getPaidAndUnPaidStudent)
router.get('/get-all-paid-and-un-paid-student', paymentController.getAllPaidAndUnPaidStudent)

router.get('/get-single-student', studentController.findOneStudent)
router.get('/get-all-subject', subjectController.getAllSubject)
router.get('/get-all-classes', classController.getAllClasses)
router.get('/get-every-class', classController.getEveryClass)

router.get('/get-current-term', termSetterController.getCurrentTerm)
router.get('/get-current-session', termSetterController.getSession)
router.get('/get-all-cognitive-item', cognitiveController.getAllAddNewCognitive)
router.get('/get-all-student-cognitive', cognitiveController.getAllStudentCognitive)
router.get('/get-all-teachers-assignment', assignmentController.getAllAssignmentAdmin)
router.get('/get-add-session', termSetterController.getAddSession)
router.get('/get-single-staff', Validator(queryString, 'query'), staffController.singleStaff)
router.get('/get-class-curriculum', curriculumController.getClassCurriculum)
router.get('/get-all-staff-to-print', staffController.getAllStaffToPrint)

router.get('/get-a-class-result', studentController.getAclassResult)
router.get('/get-a-class-students', studentController.getAllStudentFromAspecificClass)
router.get('/get-single-student-result', studentController.getAsingleStudentResult)
router.get('/get-all-teachers-priviledge', examOfficerController.getTeachersPriviledge)
router.get('/get-student-broad-sheet', teacherController.getStudentBroadSheet)


router.delete('/remove-student', studentController.removeStudent)
router.delete('/delete-single-curriculum', curriculumController.deleteSingleCurriculum)
router.delete('/delete-all-curriculum', curriculumController.deleteAllCurriculum)
router.delete('/delete-single-subject', subjectController.delete)
router.delete('/delete-class', classController.delete)
router.delete('/remove-staff', staffController.removeStaff)
router.delete('/delete-cognitive-item', cognitiveController.deleteAddNewCognitive)
router.delete('/delete-subject', curriculumController.deleteSubject)
router.delete('/delete-all-subject', subjectController.deleteAllSubject)

// *****************************************************************************************************
// The code below is very sensitive make sure you understand it before using it
router.delete('/delete-student-duplicate-from-score', curriculumController.deleteStudentDuplicateFromScore)

// *****************************************************************************************************
// The code below is very sensitive make sure you understand it before using it
router.delete('/delete-all-student-present-term-result', termSetterController.deleteAllStudentPresentTermResult)

// *****************************************************************************************************
// The code below is very sensitive make sure you understand it before using it
router.delete('/delete-score-subject', curriculumController.deleteSubjectFromScore)
router.post('/create-term-result', setNewTerm.createTermResult)
router.delete('/delete-term-result', setNewTerm.deleteTermResult)

router.put('/update-student-score-document',studentController.uspdateStudentScore)
module.exports = router
