const express = require('express')
const router = express.Router()
const cache = require('../middlewares/cache')
const effects = require('../assets/effects')

router.get('/', cache(60), async (req, res, next) => {
  try {
    // const data = effects.map(e => {
    //   delete e.isBuff
    //   delete e.isDebuff
    //   return e
    // })

    const data = effects.map(e => {
      const { isBuff, isDebuff, ...rest } = e
      return rest
    })
    res.json(data)
  } catch (e) {
    next(e)
  }
})

router.get('/buffs', cache(60), async (req, res, next) => {
  try {
    const buffs = effects.filter(effect => effect.isBuff)
    const data = buffs.map(e => {
      const { isBuff, isDebuff, ...rest } = e
      return rest
    })
    res.json(data)
  } catch (e) {
    next(e)
  }
})

router.get('/debuffs', cache(60), async (req, res, next) => {
  try {
    const debuffs = effects.filter(effect => effect.isDebuff)
    const data = debuffs.map(e => {
      const { isBuff, isDebuff, ...rest } = e
      return rest
    })
    res.json(data)
  } catch (e) {
    next(e)
  }
})

module.exports = router
