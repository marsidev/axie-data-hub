module.exports = async (req, res, next) => {
  const { RAPIDAPI_PROXY_SECRET: SECRET, NODE_ENV } = process.env
  const { headers } = req
  const { 'x-rapidapi-proxy-secret': rapidApiProxySecret } = headers

  if (NODE_ENV === 'production') {
    console.log({ rapidApiProxySecret })

    if (!rapidApiProxySecret) {
      return res.status(400).json({
        message: 'Missing RapidAPI proxy secret header'
      })
    } else {
      if (rapidApiProxySecret === SECRET) {
        next()
      } else {
        return res.status(400).json({
          message: 'Invalid RapidAPI proxy secret header'
        })
      }
    }
  }

  next()
}
