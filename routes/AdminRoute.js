const router = require('express').Router();
const staffController = require('../controller/staffController');
const logoutController = require('../controller/logoutController')
const paymentController = require('../controller/paymentController');
const { isLoggedIn } = require('../middlewares/auth');
const studentController = require('../controller/studentController')
const curriculumController = require('../controller/curriculumController');
const subjectController = require('../controller/subjectController');
const classController = require('../controller/classController')
const termSetterController = require('../controller/termSetterController')
const cognitiveController = require('../controller/cognitiveController');
const { route } = require('./teacherRoute');
const { _router } = require('../app');

router.post('/register-staff', staffController.registerStaff)
router.post('/register-student', studentController.registerStudent)

router.post('/login', staffController.loginStaff)
router.post('/change-password/:id', staffController.resetPassword)
router.post('/logout', logoutController.logout)
router.post('/add-payment', paymentController.addPaymentTypes)
router.post('/add-curriculum', curriculumController.create)
router.post('/create-subject', subjectController.create)
router.post('/create-class', classController.create)
router.post('/verify-payment', paymentController.verifyPayment);
router.post('/set-new-term',termSetterController.setNewTerm)
router.post('/add-new-cognitive-item', cognitiveController.addNewCognitive)
router.post('/add-student-cognitive', cognitiveController.createStudentCognitive)

// admin set his profile
router.put('/set-profile-pic', staffController.setProfilePic);

// set role for staff
router.put('/set-role', staffController.setRole);

router.put('/update-payment', paymentController.updatePaymentTypes)

router.put('/update-single-student-profile', studentController.updateSingleStudent);
router.put('/update-single-curriculum', curriculumController.updateSingleCurriculum);
router.put('/update-single-subject', subjectController.update)
router.put('/update-class', classController.update)
router.put('/update-cognitive-item', cognitiveController.updateAddNewCognitive)
router.put('/update-student-cognitive', cognitiveController.updateStudentCognitive)

router.get('/get-all-curriculum', curriculumController.getAllCurriculum)
router.get('/get-single-curriculum', curriculumController.getSingleCurriculum)
router.get('/dashboard', staffController.statistics)
router.get('/get-payment-type', paymentController.getPayment);
router.get('/get-all-paid-student', paymentController.getAllPaidStudent);
router.get('/get-all-teachers', staffController.findAllTeachers);
router.get('/get-all-principal', staffController.findAllPrincipal);
router.get('/get-all-staff', staffController.findAllStaff);
router.get('/get-all-student', studentController.findAllStudent);
router.get('/get-all-student-according-to-section',
 studentController.findAllStudentAccordinToSection);
router.get('/get-paid-student-statistics',paymentController.getPaidAndUnPaidStudent) 

router.get('/get-single-student', studentController.findOneStudent);
router.get('/get-all-subject', subjectController.getAllSubject)
router.get('/get-all-classes', classController.getAllClasses)
router.get('/get-every-class', classController.getEveryClass)

router.get('/get-current-term', termSetterController.getCurrentTerm)
router.get('/get-all-cognitive-item', cognitiveController.getAllAddNewCognitive)
router.get('/get-all-student-cognitive', cognitiveController.getAllStudentCognitive)

router.delete('/remove-student', studentController.removeStudent)
router.delete('/delete-single-curriculum', curriculumController.deleteSingleCurriculum)
router.delete('/delete-all-curriculum', curriculumController.deleteAllCurriculum)
router.delete('/delete-single-subject', subjectController.delete)
router.delete('/delete-class', classController.delete)
router.delete('/remove-staff', staffController.removeStaff)
router.delete('/delete-cognitive-item', cognitiveController.deleteAddNewCognitive)

module.exports = router;