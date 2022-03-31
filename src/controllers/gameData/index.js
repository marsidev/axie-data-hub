const express = require('express')
const router = express.Router()

const classicRouter = require('@controllers/gameData/classic')
const originRouter = require('@controllers/gameData/origin')

router.use('/classic', classicRouter)
router.use('/origin', originRouter)

module.exports = router
