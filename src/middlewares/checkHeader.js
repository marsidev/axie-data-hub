module.exports = async (req, res, next) => {
  const { RAPIDAPI_PROXY_SECRET: SECRET, NODE_ENV } = process.env
  const { headers } = req
  const { 'x-rapidapi-proxy-secret': rapidApiProxySecret } = headers

  if (NODE_ENV === 'production') {
    if (!rapidApiProxySecret) {
      return res.status(400).json({ message: 'Missing RapidAPI secret' })
    } else if (rapidApiProxySecret !== SECRET) {
      return res.status(400).json({ message: 'Invalid RapidAPI secret' })
    }
  }

  next()
}
