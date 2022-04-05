/* eslint-disable no-useless-escape */

const express = require('express')
const router = express.Router()
const cache = require('@middlewares/cache')
const { delayedFetch } = require('@utils/index')
const filesList = require('@utils/filesList')
const historyPath = '../assets/leaderboard-history/'
const historyPathWithAlias = '@assets/leaderboard-history/'
const formatRank = require('@utils/formatRank')

const getLeaderboard = async (url, apiIndex, req, res) => {
  const maxRanked = 10000
  const maxPerPage = 100
  const maxPlayers = 500

  let { to, from } = req.query
  if (!to) to = maxPerPage
  if (!from) from = 1

  from = parseInt(from)
  to = parseInt(to)
  const players = to - from + 1

  if ((to > 400 || from > 400) && apiIndex === 1) {
    return res.status(400).json({ error: 'in this endpoint, the maximum number of players is 400 due to a temporary limitation of the API' })
  }

  if (to > maxRanked || from > maxRanked) {
    return res.status(400).json({ error: `maximum rank that can be retrieved is ${maxRanked}` })
  }

  if (from > to) {
    return res.status(400).json({ error: '\'from\' parameter cannot be greater than \'to\' paramater' })
  }

  if (from < 1) {
    return res.status(400).json({ error: '\'from\' cannot be less than 1' })
  }

  if (players > maxPlayers || players < 0) {
    return res.status(400).json({ error: `you cannot retrieve more than ${maxPlayers} ranks in a single request` })
  }

  const nRequests = Math.ceil(players / maxPerPage)
  // const requests = []
  const urls = []
  for (let i = 0; i < nRequests; i++) {
    const offset = i * maxPerPage + from - 1

    let limit = to - offset > maxPerPage
      ? maxPerPage - 1
      : to - offset - 1

    if (apiIndex === 1) limit++

    // console.log(`request #${i}, offset: ${offset}, limit: ${limit}`)
    // requests.push(axios.get(url, { params: { limit, offset } }))
    urls.push({ url, params: { limit, offset } })
  }

  // const responses = await Promise.all(requests)
  const responses = await Promise.all(
    urls.map((d, i) => delayedFetch(d.url, d.params, i * 500))
  )

  const data = responses.map(r => r.data?.items).flat()
  const rank = formatRank(data, from)
  return res.json(rank)
}

router.get('/', cache(180), async (req, res, next) => {
  try {
    // const url = `${process.env.GAME_API_URL_2}/toprank` // this uses apiIndex = 1
    const url = `${process.env.GAME_API_URL}/leaderboard` // this uses apiIndex = 0
    await getLeaderboard(url, 0, req, res)
  } catch (error) {
    next(error)
  }
})

router.get('/previous', cache(180), async (req, res, next) => {
  try {
    const url = `${process.env.GAME_API_URL}/last-season-leaderboard`
    await getLeaderboard(url, 0, req, res)
  } catch (error) {
    next(error)
  }
})

router.get('/history', cache(600), async (req, res, next) => {
  try {
    const seasonIds = filesList(historyPath).map(f => f.split('.')[0])
    const formattedSeasonIds = new Intl.ListFormat('en', { type: 'conjunction' }).format(seasonIds)
    res.json({ availableSeasons: formattedSeasonIds })
  } catch (error) {
    next(error)
  }
})

router.get('/history/:seasonId', cache(600), async (req, res, next) => {
  try {
    const { seasonId } = req.params

    const seasonIds = filesList(historyPath).map(f => f.split('.')[0])
    const formattedSeasonIds = new Intl.ListFormat('en', { type: 'conjunction' }).format(seasonIds)

    if (seasonIds.indexOf(seasonId) === -1) {
      return res.status(400).json({
        error: `seasonId \'${seasonId}\' is not available. Available seasons: ${formattedSeasonIds}.`
      })
    }

    const data = require(`${historyPathWithAlias}/${seasonId}`)
    res.json(formatRank(data))
  } catch (error) {
    next(error)
  }
})

module.exports = router
