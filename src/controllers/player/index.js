const express = require('express')
const router = express.Router()
const axios = require('axios')

const cache = require('@middlewares/cache')
const { validateRonin, validateBattleType } = require('@middlewares/validation')
const { postRequest } = require('@utils')
const formatRank = require('@utils/formatRank')

const slpRouter = require('./slp')
const authRouter = require('./auth')
const walletRouter = require('./wallet')

const { GetAxieBriefListQuery, GetProfileNameByRoninAddressQuery } = require('@utils/queries')
const { GRAPHQL_SERVER_URL, GAME_API_URL, GAME_API_URL_2, AXIE_MNG_API_URL } = process.env

const playerData = async (req, res, next) => {
  const { address } = req.params
  const url = `${GAME_API_URL}/clients/${address.replace('ronin:', '0x')}/items/1`

  try {
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    next(error)
  }
}

router.get('/:address', validateRonin, cache(180), async (req, res, next) => {
  await playerData(req, res, next)
})

router.get('/:address/data', validateRonin, cache(180), async (req, res, next) => {
  await playerData(req, res, next)
})

router.get('/:address/mmr', validateRonin, cache(180), async (req, res, next) => {
  const { address } = req.params
  const url = `${GAME_API_URL_2}/mmr/v2/${address.replace('ronin:', '0x')}`

  try {
    // const response = await axios.get(url, {
    //   params: { client_id: address.replace('ronin:', '0x'), limit: 0, offset: 0 }
    // })
    const response = await axios.get(url)
    const playerData = response.data[0]?.items[0] || {}
    res.json(playerData)
  } catch (error) {
    next(error)
  }
})

router.get('/:address/mmr/previous', validateRonin, cache(600), async (req, res, next) => {
  const { address } = req.params
  const url = `${GAME_API_URL}/last-season-leaderboard`

  try {
    const response = await axios.get(url, {
      params: { client_id: address.replace('ronin:', '0x'), limit: 0, offset: 0 }
    })
    let playerData = response.data.items.slice(-1)[0]

    // the following is a bug fixing since the API returns the rank - 1.
    if (playerData) {
      playerData = {
        ...playerData,
        rank: playerData.rank + 1
      }
    }

    // the following clear the data so it returns only useful data
    res.json(formatRank(playerData))
  } catch (error) {
    next(error)
  }
})

router.get('/:address/axies', validateRonin, cache(600), async (req, res, next) => {
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

router.get('/:address/name', validateRonin, cache(600), async (req, res, next) => {
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

router.get('/:address/battles', validateRonin, cache(600), async (req, res, next) => {
  const { address } = req.params

  const url = `${AXIE_MNG_API_URL}/v1/user/battles/${address.replace('ronin:', '0x')}`

  try {
    const response = await axios.get(url, {
      headers: {
        Origin: 'https://axie.management'
      }
    })
    res.json({
      battles: response.data.battles
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:address/battles/:battleType', validateRonin, validateBattleType, cache(600), async (req, res, next) => {
  const { battleType, address } = req.params
  const API_URL = process.env.GAME_API_URL_2
  const url = `${API_URL}/logs/${battleType}/${address.replace('ronin:', '0x')}`

  try {
    const response = await axios.get(url)
    res.json({
      battles: response.data.battles
    })
  } catch (error) {
    next(error)
  }
})

router.use('/:address/wallet', validateRonin, cache(600), walletRouter)

router.use('/:address/slp', validateRonin, slpRouter)

router.use('/auth', authRouter)

module.exports = router
