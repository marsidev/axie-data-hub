const express = require('express')
const router = express.Router()

const originCardsRouter = require('@controllers/gameData/origin/cards')
const originToolsRouter = require('@controllers/gameData/origin/tools')
const originPatches = require('@controllers/gameData/origin/patches')

router.use('/patches', originPatches)
router.use('/cards', originCardsRouter)
router.use('/tools', originToolsRouter)

module.exports = router
