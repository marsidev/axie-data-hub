const express = require('express')
const router = express.Router({ mergeParams: true })
const { compareObjects } = require('../../utils')
const { fetchAccountData, addAccount } = require('../../utils/player')
const Account = require('../../models/Account')

router.get('/', async (req, res, next) => {
  try {
    let { address } = req.params
    address = address.replace('ronin:', '0x')
    const compactAddres = `0x...${address.substring(address.length - 4)}`

    const dbData = await Account.findOne({ address })

    if (!dbData) {
      console.log(`Account ${compactAddres} not found. Saving...`)
      const savedAccount = await addAccount(address)
      return res.status(200).json(savedAccount)
    } else {
      // dbData = dbData._doc
      const fetchedData = await fetchAccountData(address)

      if (compareObjects(dbData, fetchedData, ['totalSlp', 'claimableSlp', 'inGameSlp', 'lastClaimTime'])) {
        console.log(`Account ${compactAddres} found. No update needed`)
        return res.status(200).json(dbData)
      } else {
        const todaySoFar = fetchedData.inGameSlp - dbData.slpHistory.slice(-1)[0].amount
        const updatedData = {
          ...fetchedData,
          todaySlpSoFar: todaySoFar,
          slpHistory: dbData.slpHistory,
          yesterdaySlp: dbData.yesterdaySlp
        }

        const updatedAccount = await Account.findOneAndUpdate({ address }, updatedData, { new: true })
        return res.status(200).json(updatedAccount)
      }
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
