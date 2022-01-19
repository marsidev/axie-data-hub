const express = require('express')
const router = express.Router()
const axios = require('axios')

const cache = require('../middlewares/cache')
const { validateRonin, validateBattleType } = require('../middlewares/validation')
const { postRequest } = require('../utils')

const { GetAxieBriefListQuery, GetProfileNameByRoninAddressQuery } = require('../utils/queries')
const { GRAPHQL_SERVER_URL } = process.env

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

module.exports = router
