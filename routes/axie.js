const express = require('express')
const router = express.Router()
const axios = require('axios')
const cache = require('../middlewares/cache')
const { validateAxieId } = require('../middlewares/validation')

const { GetAxieDetailQuery, GetAxieNameQuery } = require('../utils/queries')
const { postRequest } = require('../utils')
const { GRAPHQL_SERVER_URL } = process.env

router.get('/', (req, res) => {
  return res.status(400).send({ error: 'No axie ID provided' })
})

router.get('/:axieId', validateAxieId, cache(300), async (req, res, next) => {
  // alternative url: https://api.axie.technology/getaxies/:axieId - includes children data
  const { axieId } = req.params

  const payload = {
    query: GetAxieDetailQuery,
    operationName: 'GetAxieDetail',
    variables: { axieId: axieId }
  }
  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL, payload })
    const axie = response.data.axie
    res.json(axie)
  } catch (error) {
    next(error)
  }
})

router.get('/:axieId/genes', validateAxieId, cache(300), async (req, res, next) => {
  const { axieId } = req.params
  const url = `https://api.axie.technology/getgenes/${axieId}`
  try {
    const response = await axios.get(url)
    res.json(response.data)
  } catch (error) {
    next(error)
  }
})

router.get('/:axieId/name', validateAxieId, cache(300), async (req, res, next) => {
  const { axieId } = req.params
  const payload = {
    query: GetAxieNameQuery,
    operationName: 'GetAxieName',
    variables: { axieId: axieId }
  }
  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL, payload })
    const name = response.data.axie.name
    res.json({ name: name })
  } catch (error) {
    next(error)
  }
})

router.get('/:axieId/children', validateAxieId, cache(300), async (req, res, next) => {
  const { axieId } = req.params
  const url = `https://api.axie.technology/getaxies/${axieId}`
  try {
    const response = await axios.get(url)
    const children = response.data.children
    res.json(children)
  } catch (error) {
    next(error)
  }
})

module.exports = router
