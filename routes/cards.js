/* eslint-disable no-useless-escape */
const express = require('express')
const router = express.Router()
const cache = require('../middlewares/cache')
const { fixCardsFormat, patchIds } = require('../utils')

const availablePatches = patchIds.join(', ')

router.get('/', cache(300), async (req, res, next) => {
  res.status(400).json({
    error: `You should choose the season patch balance you want to see using this path: /cards/{patchId}. Available patches: ${availablePatches}. Check /cards/patches to see more about.`
  })
})

router.get('/patches', cache(300), async (req, res, next) => {
  try {
    res.json(require('../assets/patches'))
  } catch (e) {
    next(e)
  }
})

router.get('/:patchId', cache(300), async (req, res, next) => {
  const { patchId } = req.params
  const { format } = req.query

  if (patchIds.indexOf(patchId) === -1) {
    return res.status(400).json({
      error: `PatchId \'${patchId}\' is not available. Available patches: ${availablePatches}. Check /cards/patches to see more about.`
    })
  }

  try {
    const data = require(`../assets/cards-data/${patchId}`)
    if (format === 'original') res.json(data)
    else res.json(fixCardsFormat(data))
  } catch (error) {
    next(error)
  }
})

module.exports = router
