const express = require('express')
const router = express.Router()
const cache = require('../middlewares/cache')
const { fixCardsFormat, patchFiles, patchIds } = require('../utils')

const availablePatches = patchIds.join(', ')

router.get('/', cache(300), async (req, res, next) => {
  res.status(400).json({
    error: `You should choose the season patch balance you want to see in path /cards/{patchId}. Available patches: ${availablePatches}`
  })
})

router.get('/:patchId', cache(300), async (req, res, next) => {
  const { patchId } = req.params
  const { format } = req.query

  try {
    if (patchFiles[patchId]) {
      if (format === 'original') res.json(patchFiles[patchId])
      else res.json(fixCardsFormat(patchFiles[patchId]))
    } else {
      res
        .status(400)
        .json({
          error: `Unknown patchId. Available patches: ${availablePatches}`
        })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
