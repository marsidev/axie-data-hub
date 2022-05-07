const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')
const withVersion = require('@middlewares/withVersion')
const { validateAxieId } = require('@middlewares/validation')
const { AxieGene } = require('agp-npm/dist/axie-gene')

const { GetAxieDetailQuery, GetAxieNameQuery, GetAxieChildrenQuery, GetAxieGenes, GetAxieStats, GetAxieParts } = require('@utils/queries')
const { postRequest } = require('@utils')
const { GRAPHQL_SERVER_URL2 } = process.env

router.get('/', (req, res) => {
  return res.status(400).send({ error: 'No axie ID provided' })
})

router.get('/:axieId', validateAxieId, cache(600), async (req, res, next) => {
  const { axieId } = req.params

  const payload = {
    query: GetAxieDetailQuery,
    operationName: 'GetAxieDetail',
    variables: { axieId: axieId }
  }
  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL2, payload })
    const axie = response.data.axie
    res.json(axie)
  } catch (error) {
    next(error)
  }
})

router.get('/:axieId/genes', validateAxieId, cache(600), async (req, res, next) => {
  const { axieId } = req.params
  const payload = {
    query: GetAxieGenes,
    operationName: 'GetAxieGenes',
    variables: { axieId: axieId }
  }
  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL2, payload })
    const genes = response.data.axie.genes
    const axieGene = new AxieGene(genes)
    res.json({
      axieId,
      ...axieGene,
      quality: axieGene.getGeneQuality()
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:axieId/name', validateAxieId, cache(600), async (req, res, next) => {
  const { axieId } = req.params
  const payload = {
    query: GetAxieNameQuery,
    operationName: 'GetAxieName',
    variables: { axieId: axieId }
  }
  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL2, payload })
    const name = response.data.axie.name
    res.json({ name })
  } catch (error) {
    next(error)
  }
})

router.get('/:axieId/children', validateAxieId, cache(600), async (req, res, next) => {
  const { axieId } = req.params
  const payload = {
    query: GetAxieChildrenQuery,
    operationName: 'GetAxieChildren',
    variables: { axieId: axieId }
  }
  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL2, payload })
    const children = response.data.axie.children
    res.json(children)
  } catch (error) {
    next(error)
  }
})

router.get('/:axieId/stats', withVersion(1.1, 'min'), validateAxieId, cache(600), async (req, res, next) => {
  const { axieId } = req.params
  const payload = {
    query: GetAxieStats,
    operationName: 'GetAxieStats',
    variables: { axieId: axieId }
  }
  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL2, payload })
    const stats = response.data.axie.stats
    res.json({ stats })
  } catch (error) {
    next(error)
  }
})

router.get('/:axieId/parts', withVersion(1.1, 'min'), validateAxieId, cache(600), async (req, res, next) => {
  const { axieId } = req.params
  const payload = {
    query: GetAxieParts,
    operationName: 'GetAxieParts',
    variables: { axieId: axieId }
  }
  try {
    const response = await postRequest({ url: GRAPHQL_SERVER_URL2, payload })
    const parts = response.data.axie.parts
    res.json({ parts })
  } catch (error) {
    next(error)
  }
})

module.exports = router
