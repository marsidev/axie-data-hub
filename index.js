require('dotenv').config()
require('module-alias/register')

// import libs
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

// middlewares
const { connectToMongo } = require('@middlewares/mongoose')
const errorHandler = require('@middlewares/errorHandler')
const notFoundHandler = require('@middlewares/notFound')
const { sentryInit, sentryErrorHandler, sentryRequestHandler, sentryTracingHandler } = require('@middlewares/sentry')
const logger = require('@middlewares/logger')
const checkHeader = require('@middlewares/checkHeader')

// import routes
const infoRouter = require('@controllers/info')
const v1Router = require('@controllers/versions/v1')

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
app.use('/api/v1', v1Router)

app.use(notFoundHandler)
if (NODE_ENV === 'production') app.use(sentryErrorHandler)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
