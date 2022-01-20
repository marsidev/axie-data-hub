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

module.exports = {
  postRequest,
  isConnected,
  validCurrencies,
  fixCardsFormat,
  patchIds
}
