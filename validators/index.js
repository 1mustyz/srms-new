/**
 *
 * @param schema - The joi validator object schema that entails how the data should look like
 * @param source - The property in the request data that should be validated,
 * which could be "body" | "query" | "params" | "headers"
 * @returns
 */

const Validator = (schema, source) => (req, res, next) => {
  const result = schema.validate(req[source])

  if (result.error) {
    res.status(400).json({ message: result.error.message })
    return
  }
  next()
}

module.exports = { Validator }
