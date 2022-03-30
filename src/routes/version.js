const express = require('express')
const router = express.Router()

const { API_VERSION } = process.env

router.get('/', (req, res, next) => {
  res.json({ version: API_VERSION })
})

module.exports = router
