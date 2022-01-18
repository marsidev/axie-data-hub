const express = require('express')
const router = express.Router()
const cache = require('../middlewares/cache')
const { validateExchangeSymbol } = require('../middlewares/validation')

const { postRequest } = require('../utils')
const { payloadByCurrency } = require('../utils/queries')
const { GRAPHQL_SERVER_URL } = process.env

router.get('/', (req, res) => {
  return res.status(400).send({ error: 'No currency symbol provided' })
})

router.get('/:symbol', validateExchangeSymbol, cache(60), async (req, res, next) => {
  const { symbol } = req.params
  const payload = payloadByCurrency[symbol]

  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL, payload: payload })
    res.json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router
