const express = require('express')
const router = express.Router()
const axios = require('axios')

const cache = require('../middlewares/cache')
const { validateRonin, validateBattleType } = require('../middlewares/validation')
const { postRequest, areEqual, getNumberOfDays } = require('../utils')

const Account = require('../models/Account')

const { GetAxieBriefListQuery, GetProfileNameByRoninAddressQuery } = require('../utils/queries')
const { GRAPHQL_SERVER_URL } = process.env

const fetchAccountData = async address => {
  const url = `https://game-api.skymavis.com/game-api/clients/${address.replace('ronin:', '0x')}/items/1`
  const response = await axios.get(url)
  const playerData = response.data

  const payload = {
    query: GetProfileNameByRoninAddressQuery,
    operationName: 'GetProfileNameByRoninAddress',
    variables: { roninAddress: address.replace('ronin:', '0x') }
  }
  const response2 = await postRequest({ url: GRAPHQL_SERVER_URL, payload })
  const inGameName = response2.data.publicProfileWithRoninAddress.name

  const now = new Date()
  const timeBetweenClaim = 1000 * 60 * 60 * 24 * 14
  const totalSlp = playerData.total
  const claimableSlp = playerData.claimable_total
  const inGameSlp = totalSlp - claimableSlp
  const todaySlpSoFar = 0
  const yesterdaySlp = 0
  const lastClaimTime = playerData.blockchain_related.signature.timestamp * 1000
  const lastClaimDate = new Date(lastClaimTime)
  const nextClaimTime = lastClaimTime + timeBetweenClaim
  const nextClaimDate = new Date(nextClaimTime)
  const daysUntilNextClaim = getNumberOfDays(now.getTime(), nextClaimTime)
  const daysSinceLastClaim = getNumberOfDays(lastClaimTime, now.getTime())
  const averageSlp = Math.floor(inGameSlp / daysSinceLastClaim)
  const slpHistory = [{
    updatedTime: now.getTime(),
    updatedAt: now,
    amount: inGameSlp
  }]

  return {
    address: address.replace('ronin:', '0x'),
    inGameName,
    totalSlp,
    claimableSlp,
    inGameSlp,
    todaySlpSoFar,
    yesterdaySlp,
    lastClaimTime,
    lastClaimDate,
    nextClaimTime,
    nextClaimDate,
    daysUntilNextClaim: daysUntilNextClaim < 0 ? 0 : daysUntilNextClaim,
    daysSinceLastClaim,
    averageSlp,
    canClaim: daysSinceLastClaim >= 14,
    slpHistory
  }
}

const addAccount = async address => {
  const accounData = await fetchAccountData(address)
  const account = new Account(accounData)
  const savedAccount = await account.save()
  return savedAccount
}

router.get('/', (req, res) => {
  return res.status(400).send({ error: 'No address provided' })
})

router.get('/:address/data', validateRonin, cache(300), async (req, res, next) => {
  const { address } = req.params
  const url = `https://game-api.skymavis.com/game-api/clients/${address.replace('ronin:', '0x')}/items/1`

  try {
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    next(error)
  }
})

router.get('/:address/mmr', validateRonin, cache(300), async (req, res, next) => {
  const { address } = req.params
  const url = 'https://game-api.skymavis.com/game-api/leaderboard'

  try {
    const response = await axios.get(url, {
      params: { client_id: address.replace('ronin:', '0x'), limit: 0, offset: 0 }
    })
    const playerData = response.data.items.at(-1)
    res.json(playerData)
  } catch (error) {
    next(error)
  }
})

router.get('/:address/mmr/previous', validateRonin, cache(300), async (req, res, next) => {
  const { address } = req.params
  const url = 'https://game-api.skymavis.com/game-api/last-season-leaderboard'

  try {
    const response = await axios.get(url, {
      params: { client_id: address.replace('ronin:', '0x'), limit: 0, offset: 0 }
    })
    const playerData = response.data.items.at(-1)
    res.json(playerData)
  } catch (error) {
    next(error)
  }
})

router.get('/:address/axies', validateRonin, cache(300), async (req, res, next) => {
  const { address } = req.params

  const payload = {
    query: GetAxieBriefListQuery,
    operationName: 'GetAxieBriefList',
    variables: { owner: address.replace('ronin:', '0x') }
  }

  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL, payload })
    // console.log(response.data)
    const axies = response.data.axies.results
    res.json(axies)
  } catch (error) {
    next(error)
  }
})

router.get('/:address/name', validateRonin, cache(300), async (req, res, next) => {
  const { address } = req.params

  const payload = {
    query: GetProfileNameByRoninAddressQuery,
    operationName: 'GetProfileNameByRoninAddress',
    variables: { roninAddress: address.replace('ronin:', '0x') }
  }

  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL, payload })
    const name = response.data.publicProfileWithRoninAddress.name
    res.json({ name: name })
  } catch (error) {
    next(error)
  }
})

router.get('/:address/battles', validateRonin, cache(300), async (req, res, next) => {
  const { address } = req.params

  const url = `https://api.axie.management/v1/user/battles/${address.replace('ronin:', '0x')}`

  try {
    const response = await axios.get(url, {
      headers: {
        Origin: 'https://axie.management'
      }
    })
    res.json(response.data)
  } catch (error) {
    next(error)
  }
})

router.get('/:address/battles/:battleType', validateRonin, validateBattleType, cache(300), async (req, res, next) => {
  const { battleType, address } = req.params
  const url = `https://game-api.axie.technology/logs/${battleType}/${address.replace('ronin:', '0x')}`

  try {
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    next(error)
  }
})

router.get('/:address/transactions', validateRonin, cache(300), async (req, res, next) => {
  const { address } = req.params
  const url = `https://explorer.roninchain.com/api/tokentxs?addr=${address.replace('ronin:', '0x')}&from=0&size=30&token=ERC20`

  try {
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    next(error)
  }
})

router.get('/:address/tokens', validateRonin, cache(300), async (req, res, next) => {
  const { address } = req.params
  const url = `https://explorer.roninchain.com/api/tokenbalances/${address.replace('ronin:', '0x')}`

  try {
    const response = await axios.get(url)
    const _tokens = response.data.results
    const tokens = _tokens.map(token => {
      return {
        name: token.token_name,
        symbol: token.token_symbol,
        balance:
          token.token_name !== 'Axie'
            ? token.balance / 1000000000000000000
            : Number(token.balance)
      }
    })
    res.json(tokens)
  } catch (error) {
    next(error)
  }
})

router.get('/:address/slp', validateRonin, async (req, res, next) => {
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
      const {
        createdAt,
        updatedAt,
        __v,
        _id,
        slpHistory: storedSlpHistory,
        todaySlpSoFar: storedTodaySlpSoFar,
        yesterdaySlp: storedYesterdaySlp,
        ...storedAccount
      } = _storedAccount._doc

      const _freshData = await fetchAccountData(address)
      const {
        slpHistory: freshSlpHistory,
        todaySlpSoFar: freshTodaySlpSoFar,
        yesterdaySlp: freshYesterdaySlp,
        ...freshData
      } = _freshData

      if (!areEqual(storedAccount, freshData)) {
        console.log(`Account ${compactAddres} found. Update needed`)
        // console.log({ _storedAccount, _freshData })

        // get latest slp data from storedSlpHistory and get todaySlp
        const yesterdaySlp = storedSlpHistory.at(-1).amount
        const todaySlpSoFar = freshData.inGameSlp - yesterdaySlp

        // update everything except slpHistory
        const updatedData = {
          ..._freshData,
          yesterdaySlp,
          todaySlpSoFar,
          slpHistory: storedAccount.slpHistory
        }

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

router.post('/:address/add', validateRonin, async (req, res, next) => {
  try {
    const { address } = req.params

    const _account = await Account.findOne({ address })
    if (_account) {
      return res.json({
        message: 'Account already exists'
      })
    } else {
      const savedAccount = await addAccount(address)
      res.status(201).json(savedAccount)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
