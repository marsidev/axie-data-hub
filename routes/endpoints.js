const express = require('express')
const router = express.Router()
const endpoints = require('../utils/endpoints')

router.get('/', (req, res) => {
  res.json(endpoints)
})

module.exports = router
