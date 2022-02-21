require('dotenv').config()

// import libs
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

// middlewares
const { connectToMongo } = require('./middlewares/mongoose')
const errorHandler = require('./middlewares/errorHandler')
const notFoundHandler = require('./middlewares/notFound')
const { sentryInit, sentryErrorHandler, sentryRequestHandler, sentryTracingHandler } = require('./middlewares/sentry')
const logger = require('./middlewares/logger')
const checkHeader = require('./middlewares/checkHeader')

// import routes
const axieRouter = require('./routes/axie')
const playerRouter = require('./routes/player')
const auctionRouter = require('./routes/auction')
const leaderboardRouter = require('./routes/leaderboard')
const exchangeRouter = require('./routes/exchange')
const cardsRouter = require('./routes/cards')
const statsRouter = require('./routes/stats')
const effectsRouter = require('./routes/effects')

// others
const endpoints = require('./utils/endpoints')

// .env
const { API_VERSION, NODE_ENV, PORT } = process.env

const apiInfo = {
  version: API_VERSION,
  baseUrl: '/api/v1',
  endpoints
}

// SERVER
const app = express()
app.use(express.json())

// CORS
app.use(cors())
// const allowlist = [['axie-data-hub.p.rapidapi.com']]
// const corsOptionsDelegate = function (req, callback) {
//   let corsOptions
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }
// app.use(cors(corsOptionsDelegate))

// RapidAPI validator
// app.use(checkHeader)

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

// connecting to mongodb
connectToMongo()

// routing
app.get('/', checkHeader, (req, res) => res.json(apiInfo))
app.get('/api/v1', checkHeader, (req, res) => res.json(apiInfo))
app.get('/api/v1/info', checkHeader, (req, res) => res.json(apiInfo))
app.use('/api/v1/version', checkHeader, (req, res) => res.json({ version: API_VERSION }))
app.use('/api/v1/endpoints', checkHeader, (req, res) => res.json(endpoints))
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
