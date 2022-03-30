module.exports = (request, response, next) => {
  // console.log('I am in the not found middleware 🔍')
  response.status(404).json({
    error: 'Path not found!'
  })
}
