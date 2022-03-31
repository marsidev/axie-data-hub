const express = require('express')
const router = express.Router()

const originCardsRouter = require('@controllers/gameData/origin/cards')
const originToolsRouter = require('@controllers/gameData/origin/tools')

router.use('/cards', originCardsRouter)
router.use('/tools', originToolsRouter)

module.exports = router
