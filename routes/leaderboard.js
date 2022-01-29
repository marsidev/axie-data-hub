const express = require('express')
const router = express.Router()
const axios = require('axios')
const cache = require('../middlewares/cache')

router.get('/', cache(180), async (req, res, next) => {
  const url = 'https://game-api.skymavis.com/game-api/leaderboard'

  try {
    const response = await axios.get(url, { params: { limit: 99, offset: 0 } })
    const data = response.data.items
    res.json(data)
  } catch (error) {
    next(error)
  }
})

router.get('/previous', cache(180), async (req, res, next) => {
  const url = 'https://game-api.skymavis.com/game-api/last-season-leaderboard'

  try {
    const response = await axios.get(url, { params: { limit: 99, offset: 0 } })
    const data = response.data.items
    res.json(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
