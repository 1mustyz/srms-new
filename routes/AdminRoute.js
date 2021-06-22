const router = require('express').Router();
const staffController = require('../controller/staffController');
const logoutController = require('../controller/logoutController')
const paymentController = require('../controller/paymentController');
const { isLoggedIn } = require('../middlewares/auth');
const studentController = require('../controller/studentController')
const curriculumController = require('../controller/curriculumController');
const subjectController = require('../controller/subjectController');
const classController = require('../controller/classController')

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

// admin set his profile
router.put('/set-profile-pic', staffController.setProfilePic);

// set role for staff
router.put('/set-role', staffController.setRole);

router.put('/update-payment', paymentController.updatePaymentTypes)

router.put('/update-single-student-profile', studentController.updateSingleStudent);
router.put('/update-single-curriculum', curriculumController.updateSingleCurriculum);
router.put('/update-single-subject', subjectController.update)
router.put('/update-class', classController.update)

router.get('/get-all-curriculum', curriculumController.getAllCurriculum)
router.get('/get-single-curriculum', curriculumController.getSingleCurriculum)
router.get('/dashboard', staffController.statistics)
router.get('/get-payment-type', paymentController.getPayment);
router.get('/get-all-teachers', staffController.findAllTeachers);
router.get('/get-all-principal', staffController.findAllPrincipal);
router.get('/get-all-staff', staffController.findAllStaff);
router.get('/get-all-student', studentController.findAllStudent);
router.get('/get-all-student-according-to-section',
 studentController.findAllStudentAccordinToSection);

router.get('/get-single-student', studentController.findOneStudent);
router.get('/get-all-subject', subjectController.getAllSubject)
router.get('/get-all-classes', classController.getAllClasses)

router.delete('/remove-student', studentController.removeStudent)
router.delete('/delete-single-curriculum', curriculumController.deleteSingleCurriculum)
router.delete('/delete-all-curriculum', curriculumController.deleteAllCurriculum)
router.delete('/delete-single-subject', subjectController.delete)
router.delete('/delete-class', classController.delete)

module.exports = router;