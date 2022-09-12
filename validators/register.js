const Joi = require('joi')

const staffValidator = Joi.object({
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().lowercase().email(),
  gender: Joi.string(),
  qualification: Joi.string().required(),
  department: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string(),
  country: Joi.string(),
  state: Joi.string(),
  lga: Joi.string(),
  bankName: Joi.string(),
  accountNumber: Joi.string(),
  accountName: Joi.string(),
  nextKinName: Joi.string(),
  nextKinPhone1: Joi.string(),
  relationship: Joi.string(),
  nextKinAddress: Joi.string(),
  role: Joi.array(),
  userType: Joi.string,
  classTeacher: Joi.string()

})

const studentValidator = Joi.object({
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  kinName: Joi.string(),
  kinNumber: Joi.string(),
  kinRelation: Joi.string(),
  kinAddress: Joi.string(),
  dob: Joi.string(),
  gender: Joi.string(),
  address: Joi.string(),
  country: Joi.string(),
  state: Joi.string(),
  lga: Joi.string(),
  currentClass: Joi.string().required(),
  classNumber: Joi.number().integer().required(),
  section: Joi.string().required(),
  category: Joi.string()
})

module.exports = {
  staffValidator,
  studentValidator
}
