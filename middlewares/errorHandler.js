// Todo: add more handlers for different error types
const ERROR_HANDLERS = {
  defaultError: (res, error) => {
    console.error({
      error: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code
    })
    res.status(500).end()
  }
}

module.exports = (error, request, response, next) => {
  console.log('I am on the errorHandler middleware 😢')
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(response, error)
}
