require('dotenv').config()
require('module-alias/register')

// import libs
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

// middlewares
const { connectToMongo } = require('@middlewares/')
const errorHandler = require('@middlewares/errorHandler')
const notFoundHandler = require('@middlewares/notFound')
const { sentryInit, sentryErrorHandler, sentryRequestHandler, sentryTracingHandler } = require('@middlewares/sentry')
const logger = require('@middlewares/logger')
const checkHeader = require('@middlewares/checkHeader')

// import routes
const axieRouter = require('@routes/axie')
const playerRouter = require('@routes/player')
const auctionRouter = require('@routes/auction')
const leaderboardRouter = require('@routes/leaderboard')
const exchangeRouter = require('@routes/exchange')
const cardsRouter = require('@routes/cards')
const statsRouter = require('@routes/stats')
const effectsRouter = require('@routes/effects')
const infoRouter = require('@routes/info')
const endpointsRouter = require('@routes/endpoints')
const versionRouter = require('@routes/version')

// .env
const { NODE_ENV, PORT } = process.env

// SERVER
const app = express()
app.use(express.json())

// CORS
app.use(cors())

// morgan debugger
app.use(morgan('dev'))

// logging
app.use(logger)

// Sentry init
if (NODE_ENV === 'production') {
  app.use(sentryInit)
  app.use(sentryRequestHandler)
  app.use(sentryTracingHandler)
}

// RapidAPI validator
app.use(checkHeader)

// connecting to mongodb
connectToMongo()

// routing
app.use('/', infoRouter)
app.use('/api', infoRouter)
app.use('/api/v1', infoRouter)
app.use('/api/v1/info', infoRouter)
app.use('/api/v1/version', versionRouter)
app.use('/api/v1/endpoints', endpointsRouter)
app.use('/api/v1/axie', axieRouter)
app.use('/api/v1/player', playerRouter)
app.use('/api/v1/auction', auctionRouter)
app.use('/api/v1/leaderboard', leaderboardRouter)
app.use('/api/v1/exchange', exchangeRouter)
app.use('/api/v1/cards', cardsRouter)
app.use('/api/v1/stats', statsRouter)
app.use('/api/v1/effects', effectsRouter)

app.use(notFoundHandler)
if (NODE_ENV === 'production') app.use(sentryErrorHandler)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
