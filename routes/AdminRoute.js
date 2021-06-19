const router = require('express').Router();
const staffController = require('../controller/staffController');
const logoutController = require('../controller/logoutController')
const paymentController = require('../controller/paymentController');
const { isLoggedIn } = require('../middlewares/auth');
const studentController = require('../controller/studentController')


router.get('/dashboard', staffController.statistics)
router.post('/register-staff', staffController.registerStaff)
router.post('/register-student', studentController.registerStudent)

router.post('/login', staffController.loginStaff)
router.post('/change-password/:id', staffController.resetPassword)
router.post('/logout', logoutController.logout)
router.post('/add-payment', paymentController.addPaymentTypes)

// admin set his profile
router.put('/set-profile-pic', staffController.setProfilePic);

// set role for staff
router.put('/set-role', staffController.setRole);

router.put('/update-payment', paymentController.updatePaymentTypes)
router.post('/verify-payment', paymentController.verifyPayment);

router.put('/update-single-student-profile', studentController.updateSingleStudent);

router.get('/get-payment-type', paymentController.getPayment);
router.get('/get-all-teachers', staffController.findAllTeachers);
router.get('/get-all-principal', staffController.findAllPrincipal);
router.get('/get-all-staff', staffController.findAllStaff);
router.get('/get-all-student', studentController.findAllStudent);
router.get('/get-single-student', studentController.findOneStudent);

router.delete('/remove-student', studentController.removeStudent)

module.exports = router;