const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')

const { GetAxieLatestQuery, GetRecentlyAxiesSoldQuery } = require('@utils/queries')
const { postRequest } = require('@utils')
const { GRAPHQL_SERVER_URL2 } = process.env

router.get('/', (req, res) => {
  return res.status(400).send({ error: 'No type provided' })
})

router.get('/onsale', cache(180), async (req, res, next) => {
  const payload = {
    query: GetAxieLatestQuery,
    operationName: 'GetAxieLatest',
    variables: {
      from: 0,
      size: 50,
      sort: 'PriceAsc',
      auctionType: 'Sale',
      criteria: {}
    }
  }

  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL2, payload })
    const axies = response.data.axies.results
    res.json(axies)
  } catch (error) {
    next(error)
  }
})

router.get('/sold', cache(180), async (req, res, next) => {
  const payload = {
    query: GetRecentlyAxiesSoldQuery,
    operationName: 'GetRecentlyAxiesSold',
    variables: { from: 0, size: 50 }
  }

  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL2, payload })
    const axies = response.data.settledAuctions.axies.results
    res.json(axies)
  } catch (error) {
    next(error)
  }
})

module.exports = router
