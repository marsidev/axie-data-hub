const express = require('express')
const router = express.Router()
const axios = require('axios')
const cache = require('@middlewares/cache')
const { validateExchangeSymbol } = require('@middlewares/validation')
const { validCurrencies } = require('@utils')

router.get('/', (req, res) => {
  res
    .status(400)
    .send({
      error:
        `No currency symbol provided. Available symbols: ${validCurrencies.join(', ')}`
    })
})

router.get('/:symbol', validateExchangeSymbol, cache(60), async (req, res, next) => {
  const { symbol } = req.params
  const url = 'https://exchange-rate.skymavis.one'

  try {
    const { data } = await axios.get(url)
    const dataSymbol = data[symbol]
    res.json(dataSymbol)
  } catch (error) {
    next(error)
  }
})

module.exports = router
