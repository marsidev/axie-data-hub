const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')

router.get('/base', cache(600), async (req, res, next) => {
  try {
    res.json(require('@assets/stats/base-stats'))
  } catch (e) {
    next(e)
  }
})

router.get('/base/:className', cache(600), async (req, res, next) => {
  try {
    const data = require('@assets/stats/base-stats')
    const className = req.params.className
    const classData = data[className]
    if (!classData) return res.status(404).json({ error: 'Invalid className' })
    res.json(classData)
  } catch (e) {
    next(e)
  }
})

router.get('/body-part', cache(600), async (req, res, next) => {
  try {
    res.json(require('@assets/stats/body-part-stats'))
  } catch (e) {
    next(e)
  }
})

router.get('/body-part/:className', cache(600), async (req, res, next) => {
  try {
    const data = require('@assets/stats/body-part-stats')
    const className = req.params.className
    const classData = data[className]
    if (!classData) return res.status(404).json({ error: 'Invalid className' })
    res.json(classData)
  } catch (e) {
    next(e)
  }
})

module.exports = router
