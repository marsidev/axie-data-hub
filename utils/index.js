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

const patchFiles = []
require('fs')
  .readdirSync(require('path').join(__dirname, '../assets/cards-data'))
  .forEach(
    p => {
      patchFiles[p.replace('.json', '')] =
        require(`../assets/cards-data/${p}`)
    })
const patchIds = Object.entries(patchFiles).map(([k]) => k)

module.exports = {
  postRequest,
  isConnected,
  validCurrencies,
  fixCardsFormat,
  patchFiles,
  patchIds
}
