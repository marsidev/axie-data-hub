const express = require('express')
const router = express.Router()
const endpoints = require('@utils/endpoints')

const { API_VERSION } = process.env
const apiInfo = { version: API_VERSION, baseUrl: '/api/v1', endpoints }

router.get('/', (req, res) => res.json(apiInfo))

module.exports = router
