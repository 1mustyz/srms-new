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

module.exports = {
  staffValidator
}
