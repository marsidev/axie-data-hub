const express = require('express')
const router = express.Router()
const axios = require('axios')
const cache = require('../middlewares/cache')

// TODO: show cards data of previous seasons
router.get('/', cache(300), async (req, res, next) => {
  const url =
    'https://storage.googleapis.com/axie-cdn/game/cards/card-abilities.json'
  try {
    const response = await axios.get(url)
    // TODO: fix json data
    res.json(response.data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
