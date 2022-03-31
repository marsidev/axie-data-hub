const express = require('express')
const router = express.Router()

const statsRouter = require('@controllers/gameData/classic/stats')
const effectsRouter = require('@controllers/gameData/classic/effects')
const classicCardsRouter = require('@controllers/gameData/classic/cards')

router.use('/stats', statsRouter)
router.use('/effects', effectsRouter)
router.use('/cards', classicCardsRouter)

module.exports = router
