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
    const backgroundUrl = `https://cdn.axieinfinity.com/game/cards/effect-icons/${part}.png`
    const temp = {
      className,
      bodyPart,
      abilityIndex,
      ...data[part],
      backgroundUrl
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
  const oneDay = 1000 * 60 * 60 * 24
  const diffInTime = new Date(end).getTime() - new Date(start).getTime()
  const diffInDays = Math.round(diffInTime / oneDay)
  return diffInDays
}

const extractProps = (obj, props) => {
  const newObj = {}
  props.forEach(prop => newObj[prop] = obj[prop])
  return newObj
}

const compareObjects = (a, b, props) => {
  const aProps = extractProps(a, props)
  const bProps = extractProps(b, props)
  // console.log('Comparing objects:')
  // console.log({ aProps })
  // console.log({ bProps })
  return areEqual(aProps, bProps)
}

const delayedFetch = (url, params, delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.get(url, { params }).then(resolve).catch(reject)
    }, delay)
  })
}

module.exports = {
  postRequest,
  isConnected,
  validCurrencies,
  fixCardsFormat,
  patchIds,
  areEqual,
  getNumberOfDays,
  compareObjects,
  delayedFetch
}
