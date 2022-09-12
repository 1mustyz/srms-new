const Joi = require('joi')

const queryString = Joi.object({
  keyword: Joi.string().required()
})

module.exports = {
  queryString
}
