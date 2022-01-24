const express = require('express')
const router = express.Router()
const axios = require('axios')

const cache = require('../../middlewares/cache')
const { validateRonin, validateBattleType } = require('../../middlewares/validation')
const { postRequest } = require('../../utils')
// const { addAccount } = require('../../utils/player')
// const Account = require('../../models/Account')

const slpRouter = require('./slp')
const authRouter = require('./auth')
const walletRouter = require('./wallet')

const { GetAxieBriefListQuery, GetProfileNameByRoninAddressQuery } = require('../../utils/queries')
const { GRAPHQL_SERVER_URL } = process.env

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
    const playerData = response.data.items.slice(-1)[0]
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
    const playerData = response.data.items.slice(-1)[0]
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

router.use('/:address/wallet', validateRonin, cache(300), walletRouter)

router.use('/:address/slp', validateRonin, slpRouter)

router.use('/auth', authRouter)

module.exports = router
