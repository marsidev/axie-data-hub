const { Schema, model } = require('mongoose')

const slpHistorySchema = new Schema({
  updatedTime: Number,
  updatedAt: Date,
  amount: Number
}, {
  toJSON: {
    transform: (obj, ret) => {
      delete ret._id
      delete ret.__v
    }
  }
})

const accountSchema = new Schema({
  address: {
    type: String,
    unique: true
  },
  inGameName: String,
  totalSlp: Number,
  claimableSlp: Number,
  inGameSlp: Number,
  todaySlpSoFar: Number,
  yesterdaySlp: Number,
  lastClaimTime: Number,
  lastClaimDate: Date,
  nextClaimTime: Number,
  nextClaimDate: Date,
  daysUntilNextClaim: Number,
  daysSinceLastClaim: Number,
  averageSlp: Number,
  canClaim: Boolean,
  slpHistory: [slpHistorySchema]
}, {
  timestamps: true,
  toJSON: {
    transform: (obj, ret) => {
      // ret.id = ret._id
      delete ret._id
      delete ret.__v
    }
  }
})

const Account = model('Account', accountSchema)

module.exports = Account
