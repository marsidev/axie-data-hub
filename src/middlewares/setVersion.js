module.exports = async (req, res, next) => {
  const url = req.originalUrl
  const version = url.split('/')[2]?.replace('v', '')

  // set the version in the header
  req.headers['api-version'] = version
  next()
}
