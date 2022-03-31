module.exports = (requiredVersion, comparer = 'exact') => (request, response, next) => {
  const apiVersion = Number(request.headers['api-version'])
  let validVersion = false

  if (comparer === 'exact') {
    validVersion = apiVersion === requiredVersion
  } else if (comparer === 'min') {
    validVersion = apiVersion >= requiredVersion
  } else if (comparer === 'max') {
    validVersion = apiVersion <= requiredVersion
  }

  if (!validVersion) {
    response.status(404).json({
      error: 'Path not found!'
    })
  } else next()
}
