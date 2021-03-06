const { isConnected } = require('@utils')

const ERROR_HANDLERS = {
  ECONNRESET: (res, error) => {
    if (!isConnected) {
      res.status(400).json({ error: 'Internet connection error' })
    } else res.status(400).json({ error: 'Connection error' })
  },

  ENOTFOUND: (res, error) => {
    if (!isConnected) {
      res.status(400).json({ error: 'Internet connection error' })
    } else res.status(400).json({ error: 'Connection error' })
  },

  ETIMEDOUT: (res, error) => {
    if (!isConnected) {
      res.status(400).json({ error: 'Internet connection error' })
    } else res.status(400).json({ error: 'Connection error' })
  },

  MongoServerError: (res, error) => {
    if (error.code === 11000) {
      res.status(409).send({ error: 'Account already exists' })
    } else res.status(500).json({ error: 'Mongo server error' })
  },

  MongooseServerSelectionError: (res, error) => {
    res.status(500).json({ error: 'Mongo server error' })
  },

  MongooseError: (res, error) => {
    if (error.message.includes('timed out')) {
      res.status(500).json({ error: 'Connection error' })
    } else res.status(500).json({ error: 'Mongoose server error' })
  },

  'internal-server-error': (res, error) => {
    res.status(500).json({ error: 'Internal Server Error. Try again later.' })
  },

  INTERNAL_SERVER_ERROR: (res, error) => {
    res.status(500).json({ error: 'Internal Server Error. Try again later.' })
  },

  defaultError: (res, error) => {
    const data = error.response?.data
    console.error({
      error: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
      data
    })

    if (data?.toString().includes('404 Not Found')) {
      res.status(500).json({ error: 'Internal Server Error. Try again later.' }).end()
    } else {
      res.status(500).end()
    }
  }
}

module.exports = (error, request, response, next) => {
  console.log('I am on the errorHandler middleware 😢')

  const handler =
    ERROR_HANDLERS[error?.name] ||
    ERROR_HANDLERS[error?.code] ||
    ERROR_HANDLERS[error?.response?.data?.code] ||
    ERROR_HANDLERS[error?.response?.data?.error_type] ||
    ERROR_HANDLERS.defaultError

  handler(response, error)
}
