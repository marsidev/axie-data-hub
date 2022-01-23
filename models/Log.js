const { Schema, model } = require('mongoose')

const logSchema = new Schema({
  timestamp: Number,
  date: Date,
  processingTime: Number,
  request: {
    headers: Object,
    httpVersion: String,
    method: String,
    remoteAddress: String,
    remoteFamily: String,
    url: String,
    body: Object,
    params: Object,
    query: Object
  },
  response: {
    statusCode: Number,
    statusMessage: String,
    headers: Object
  }
},
{
  timestamps: true,
  toJSON: {
    transform: (obj, ret) => {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    }
  }
})

const Log = model('Log', logSchema)

module.exports = Log
