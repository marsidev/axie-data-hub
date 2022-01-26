const { validCurrencies } = require('../utils')

const validateAxieId = (req, res, next) => {
  const { axieId } = req.params
  const isValid = !isNaN(axieId)
  if (!isValid) return res.status(400).send({ error: 'Invalid axie ID' })
  return next()
}

const validateRonin = (req, res, next) => {
  const { address } = req.params
  const isValid = /^(0x)?[0-9a-f]{40}$/i.test(
    address.replace('ronin:', '0x').replace('ronin%3A', '0x')
  )
  if (!isValid) return res.status(400).send({ error: 'Invalid Ronin address' })
  return next()
}

const validateBattleType = (req, res, next) => {
  const { battleType } = req.params
  if (battleType !== 'pvp' && battleType !== 'pve') {
    return res.status(400).send({ error: 'Invalid battle type, should be \'pve\' or \'pvp\'' })
  }
  return next()
}

const validateExchangeSymbol = (req, res, next) => {
  const { symbol } = req.params
  if (!validCurrencies.includes(symbol)) {
    return res.status(400).send({
      error: `Invalid currency symbol. Available symbols: ${validCurrencies.join(', ')}`
    })
  }
  return next()
}

module.exports = {
  validateAxieId,
  validateRonin,
  validateBattleType,
  validateExchangeSymbol
}
