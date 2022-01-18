require('dotenv').config()

// import libs
const express = require('express')
// const cors = require('cors')

// middlewares
const errorHandler = require('./middlewares/errorHandler')
const notFoundHandler = require('./middlewares/notFound')
const { sentryInit, sentryErrorHandler, sentryRequestHandler, sentryTracingHandler } = require('./middlewares/sentry')

// import routes
const axieRouter = require('./routes/axie')
const playerRouter = require('./routes/player')
const auctionRouter = require('./routes/auction')
const leaderboardRouter = require('./routes/leaderboard')
const exchangeRouter = require('./routes/exchange')
const cardsRouter = require('./routes/cards')

const { endpoints } = require('./utils')
const apiInfo = {
  version: process.env.API_VERSION,
  baseUrl: '/api/v1',
  endpoints
}

// config
const app = express()
// app.use(cors())
app.use(express.json())

// Sentry init
if (process.env.NODE_ENV !== 'test') {
  app.use(sentryInit)
  app.use(sentryRequestHandler)
  app.use(sentryTracingHandler)
}

// routing
app.get('/', (req, res) => res.json(apiInfo))
app.get('/api/v1', (req, res) => res.json(apiInfo))
app.get('/api/v1/info', (req, res) => res.json(apiInfo))
app.use('/api/v1/version', (req, res) => res.json({ version: process.env.API_VERSION }))
app.use('/api/v1/endpoints', (req, res) => res.json(endpoints))
app.use('/api/v1/axie', axieRouter)
app.use('/api/v1/player', playerRouter)
app.use('/api/v1/auction', auctionRouter)
app.use('/api/v1/leaderboard', leaderboardRouter)
app.use('/api/v1/exchange', exchangeRouter)
app.use('/api/v1/cards', cardsRouter)

app.use(notFoundHandler)
if (process.env.NODE_ENV !== 'test') app.use(sentryErrorHandler)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
