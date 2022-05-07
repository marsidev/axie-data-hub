/* eslint-disable no-useless-escape */
const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')
const { formatToolsData } = require('@utils/origin/formatter')
const filesList = require('@utils/filesList')

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
    const data = require(`@assets/cards-data/origin/${patchId}/tools`)

    if (format === 'original') res.json(data)
    else {
      res.json(formatToolsData(data))
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
