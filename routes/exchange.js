const express = require('express')
const router = express.Router()
const axios = require('axios')
const cache = require('../middlewares/cache')
const { validateExchangeSymbol } = require('../middlewares/validation')

router.get('/', (req, res) => res.status(400).send({ error: 'No currency symbol provided' }))

router.get('/:symbol', validateExchangeSymbol, cache(60), async (req, res, next) => {
  const { symbol } = req.params
  const url = 'https://exchange-rate.skymavis.one'

  try {
    const response = await axios.get(url)
    const data = response.data[symbol]
    res.json(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
