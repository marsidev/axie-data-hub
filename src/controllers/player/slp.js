const express = require('express')
const router = express.Router({ mergeParams: true })
const { compareObjects } = require('@utils')
const { fetchAccountData, addAccount } = require('@utils/player')
const Account = require('@models/Account')

const sendResult = (req, res, verbose, verbosedData) => {
  if (verbose) {
    return res.status(200).json(verbosedData)
  } else {
    const { slpHistory, _id, __v, ...data } = verbosedData._doc
    return res.status(200).json(data)
  }
}

router.get('/', async (req, res, next) => {
  try {
    let { address } = req.params
    let { verbose } = req.query

    // parsing verbose query as boolean
    verbose = verbose === undefined ? false : verbose
    verbose = verbose.toString().trim().toLowerCase()
    verbose = verbose === 'true' || verbose === '1'

    address = address.replace('ronin:', '0x')
    const compactAddres = `0x...${address.substring(address.length - 4)}`

    const dbData = await Account.findOne({ address })

    if (!dbData) {
      console.log(`Account ${compactAddres} not found. Saving...`)
      const savedAccount = await addAccount(address)
      return sendResult(req, res, verbose, savedAccount)
    } else {
      const fetchedData = await fetchAccountData(address)

      if (compareObjects(dbData, fetchedData, ['totalSlp', 'claimableSlp', 'inGameSlp', 'lastClaimTime'])) {
        console.log(`Account ${compactAddres} found. No update needed`)
        return sendResult(req, res, verbose, dbData)
      } else {
        const todaySoFar = fetchedData.inGameSlp - dbData.slpHistory.slice(-1)[0].amount
        const updatedData = {
          ...fetchedData,
          todaySlpSoFar: todaySoFar,
          slpHistory: dbData.slpHistory,
          yesterdaySlp: dbData.yesterdaySlp
        }

        const updatedAccount = await Account.findOneAndUpdate({ address }, updatedData, { new: true })
        return sendResult(req, res, verbose, updatedAccount)
      }
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
