const express = require('express')

const axieRouter = require('@controllers/axie')
const playerRouter = require('@controllers/player')
const auctionRouter = require('@controllers/auction')
const leaderboardRouter = require('@controllers/leaderboard')
const exchangeRouter = require('@controllers/exchange')
const gameDataRouter = require('@controllers/gameData')

const router = express.Router()
router.use('/version', (req, res) => res.json({ version: '1.1.0' }))
router.use('/axie', axieRouter)
router.use('/player', playerRouter)
router.use('/auction', auctionRouter)
router.use('/leaderboard', leaderboardRouter)
router.use('/exchange', exchangeRouter)
router.use('/game-data', gameDataRouter)

module.exports = router
