const express = require('express')
const router = express.Router({ mergeParams: true })

const Account = require('../../models/Account')

const { areEqual } = require('../../utils')
const { fetchAccountData, addAccount } = require('../../utils/player')

router.get('/', async (req, res, next) => {
  try {
    const { address } = req.params
    const compactAddres = `0x...${address.substring(address.length - 4)}`

    const _storedAccount = await Account.findOne({
      address: address.replace('ronin:', '0x')
    })

    if (!_storedAccount) {
      console.log(`Account ${compactAddres} not found. Creating...`)
      const savedAccount = await addAccount(address)
      return res.status(200).json(savedAccount)
    } else {
      const { createdAt, updatedAt, __v, _id, slpHistory: storedSlpHistory, todaySlpSoFar: storedTodaySlpSoFar, yesterdaySlp: storedYesterdaySlp, ...storedAccount } = _storedAccount._doc

      const _freshData = await fetchAccountData(address)
      const { slpHistory: freshSlpHistory, todaySlpSoFar: freshTodaySlpSoFar, yesterdaySlp: freshYesterdaySlp, ...freshData } = _freshData

      if (!areEqual(storedAccount, freshData)) {
        console.log(`Account ${compactAddres} found. Update needed`)

        // get latest slp data from storedSlpHistory and get todaySlp
        const yesterdaySlp = storedSlpHistory.slice(-1)[0].amount
        const todaySlpSoFar = freshData.inGameSlp - yesterdaySlp

        // update everything except slpHistory
        const updatedData = { ..._freshData, yesterdaySlp, todaySlpSoFar, slpHistory: storedAccount.slpHistory }

        const updatedAccount = await Account.findOneAndUpdate(
          { address: address.replace('ronin:', '0x') },
          updatedData,
          { new: true }
        )
        return res.status(200).json(updatedAccount)
      } else {
        console.log(`Account ${compactAddres} found. No update needed`)
        return res.status(200).json(_storedAccount)
      }
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
