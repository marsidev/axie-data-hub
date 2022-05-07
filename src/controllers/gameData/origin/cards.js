/* eslint-disable no-useless-escape */
const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')
const { formatCardsData } = require('@utils/origin/formatter')
const filterObject = require('@utils/filterObject')
const filesList = require('@utils/filesList')

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

router.get('/:patchId', cache(600), async (req, res, next) => {
  const { query } = req
  const { patchId } = req.params
  const { format = 'default' } = query

  const files = filesList('../assets/cards-data/origin')
  const patchIds = files.filter(file => !file.includes('.'))
  const availablePatches = patchIds.join(', ')

  if (patchIds.indexOf(patchId) === -1) {
    return res.status(400).json({
      error: `PatchId \'${patchId}\' is not available. Available patches: ${availablePatches}. Check /cards/patches to see more about.`
    })
  }

  try {
    const data = require(`@assets/cards-data/origin/${patchId}/cards`)

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
