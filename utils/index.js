const axios = require('axios')

const postRequest = async ({ url, payload }) => {
  const response = await axios.post(url, payload)
  return response.data
}

const isConnected = async () => {
  return !!(await require('dns')
    .promises.resolve('google.com')
    .catch(() => {}))
}

const validCurrencies = ['slp', 'axs', 'eth', 'ron', 'usdc']

const fixCardsFormat = (data) => {
  let newData = []
  for (const part in data) {
    const className = part.split('-')[0]
    const bodyPart = part.split('-')[1]
    const abilityIndex = part.split('-')[2]
    const temp = {
      className,
      bodyPart,
      abilityIndex,
      ...data[part]
    }
    newData = [...newData, temp]
  }

  // console.log({ newData })
  return newData
}

const patchIds = Object.entries(require('../assets/patches.json')).map(([k]) => k)

const areEqual = (obj1, obj2) => {
  if (typeof obj1 !== typeof obj2) return false
  if (typeof obj1 === 'function') return obj1.toString() === obj2.toString()
  if (obj1 instanceof Object && obj2 instanceof Object) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false
    for (const p in obj1) {
      if (!areEqual(obj1[p], obj2[p])) return false
    }
    return true
  } else return obj1 === obj2
}

const getNumberOfDays = (start, end) => {
  const date1 = new Date(start)
  const date2 = new Date(end)
  const oneDay = 1000 * 60 * 60 * 24
  const diffInTime = date2.getTime() - date1.getTime()
  const diffInDays = Math.round(diffInTime / oneDay)
  return diffInDays
}

module.exports = {
  postRequest,
  isConnected,
  validCurrencies,
  fixCardsFormat,
  patchIds,
  areEqual,
  getNumberOfDays
}
