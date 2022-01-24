const axios = require('axios')
const express = require('express')
const router = express.Router({ mergeParams: true })

const RONIN_API_URL = 'https://explorer.roninchain.com/api'

router.get('/transactions', async (req, res, next) => {
  try {
    const { address } = req.params
    const url = `${RONIN_API_URL}/tokentxs?addr=${address.replace('ronin:', '0x')}&from=0&size=30&token=ERC20`
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    next(error)
  }
})

router.get('/tokens', async (req, res, next) => {
  try {
    const { address } = req.params
    const url = `${RONIN_API_URL}/tokenbalances/${address.replace('ronin:', '0x')}`
    const response = await axios.get(url)
    const tokens = response.data.results.map(token => {
      return {
        name: token.token_name,
        symbol: token.token_symbol,
        balance:
          token.token_symbol === 'WETH'
            ? token.balance / 1e18
            : Number(token.balance)
      }
    })
    res.json(tokens)
  } catch (error) {
    next(error)
  }
})

module.exports = router
