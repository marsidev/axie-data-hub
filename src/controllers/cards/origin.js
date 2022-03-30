const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')
const { fixCardsFormat } = require('@utils/origin')

router.get('/', cache(600), async (req, res, next) => {
  const { query } = req
  const { format = 'default' } = query

  try {
    const data = require('@assets/cards-data/origin/cards')
    if (format === 'original') res.json(data)
    else {
      const formattedData = fixCardsFormat(data)

      let filteredData = formattedData
      for (const q in query) {
        if (formattedData[0][q]) {
          // if (q === 'format') continue
          filteredData = filteredData.filter(card => card[q] === query[q])
        }
      }

      res.json(filteredData)

      // if (className !== 'all') {
      //   let filteredData = formattedData.filter(card => card.class === className)
      //   if (type !== 'all') {
      //     filteredData = filteredData.filter(card => card.type === type)
      //     res.json(filteredData)
      //   } else res.json(filteredData)
      // } else res.json(formattedData)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
