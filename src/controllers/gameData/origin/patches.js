/* eslint-disable no-useless-escape */
const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')
const filesList = require('@utils/filesList')

router.get('/', cache(600), async (req, res, next) => {
  try {
    const files = filesList('../assets/cards-data/origin')
    const patches = files.filter(file => !file.includes('.'))
    res.json(patches)
  } catch (error) {
    next(error)
  }
})

module.exports = router
