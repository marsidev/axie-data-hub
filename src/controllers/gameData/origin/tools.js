const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')
const { formatToolsData } = require('@utils/origin/formatter')

router.get('/', cache(600), async (req, res, next) => {
  const { query } = req
  const { format = 'default' } = query

  try {
    const data = require('@assets/cards-data/origin/current/tools')
    if (format === 'original') res.json(data)
    else {
      res.json(formatToolsData(data))
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
