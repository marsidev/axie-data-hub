/* eslint-disable no-useless-escape */
const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')
const { patchIds } = require('@utils')
const { formatCardsData } = require('@utils/classic/formatter')
const filterObject = require('@utils/filterObject')

router.get('/patches', cache(600), async (req, res, next) => {
  try {
    res.json(require('@assets/patches'))
  } catch (e) {
    next(e)
  }
})

router.get('/:patchId', cache(600), async (req, res, next) => {
  const { query } = req
  const { patchId } = req.params
  const { format = 'default' } = query

  const availablePatches = patchIds.join(', ')

  if (patchIds.indexOf(patchId) === -1) {
    return res.status(400).json({
      error: `PatchId \'${patchId}\' is not available. Available patches: ${availablePatches}. Check /cards/patches to see more about.`
    })
  }

  try {
    const data = require(`@assets/cards-data/${patchId}`)
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
