const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')
const { formatCardsData } = require('@utils/origin/formatter')
const filterObject = require('@utils/filterObject')

router.get('/', cache(600), async (req, res, next) => {
  const { query } = req
  const { format = 'default' } = query

  try {
    const data = require('@assets/cards-data/origin/current/cards')
    if (format === 'original') res.json(data)
    else {
      const formattedData = formatCardsData(data)
      const filteredData = filterObject(formattedData, query)
      res.json(filteredData)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
