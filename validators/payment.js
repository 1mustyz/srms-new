const Joi = require('joi')

const paymentValidator = Joi.object({
  pays: Joi.object({
    purposeOfPayment: Joi.array().items({
        purposeOfPayment: Joi.string().required(),
        amountOfPayment: Joi.number().required(),
        teller: Joi.string().required()
    })
  }).required()
})

module.exports = {
    paymentValidator
}
