const express = require('express')
const router = express.Router({ mergeParams: true })

const { getProvider, getWallet, getAccessToken } = require('../../utils/player')

router.post('/', async (req, res, next) => {
  try {
    const { privateKey } = req.body

    if (!privateKey) {
      return res.status(400).json({
        error: 'privateKey is required'
      })
    }

    const provider = getProvider()
    console.log({ provider })
    const wallet = getWallet(provider, privateKey)
    const token = await getAccessToken(wallet)
    res.json({ token })
  } catch (error) {
    next(error)
  }
})

module.exports = router
