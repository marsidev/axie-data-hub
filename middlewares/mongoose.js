const mongoose = require('mongoose')
const { MONGODB_URI, MONGODB_URI_TEST, NODE_ENV } = process.env

const connectionStr = NODE_ENV === 'test' ? MONGODB_URI_TEST : MONGODB_URI

if (!connectionStr) {
  console.error('.ENV file missing or MONGO_DB_URI is not defined')
}

const connectToMongo = async (request, response) => {
  try {
    await mongoose.connect(connectionStr)
    // console.log('Connected to MongoDB')
  } catch (err) {
    // console.error('Error connecting to MongoDB:', err)
  }
}

const disconnectFromMongo = async (request, response) => {
  try {
    await mongoose.disconnect()
    // console.log('Disconnected from MongoDB')
  } catch (err) {
    // console.error('Error disconnecting to MongoDB:', err)
  }
}

process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})

module.exports = { connectToMongo, disconnectFromMongo }
