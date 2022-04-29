const AXIE_CLASSIC_CARDS_BASE_URL = 'https://cdn.axieinfinity.com/game/cards/base'
const AXIE_CLASSIC_EFFECTS_BASE_URL = 'https://cdn.axieinfinity.com/game/cards/effect-icons'

const formatCardsData = data => {
  let newData = []
  for (const part in data) {
    const { iconId } = data[part]
    const className = part.split('-')[0]
    const type = part.split('-')[1]
    const partValue = part.split('-')[2]
    const image = `${AXIE_CLASSIC_CARDS_BASE_URL}/${part}.png`
    const effectImage = `${AXIE_CLASSIC_EFFECTS_BASE_URL}/${iconId}.png`

    const temp = {
      class: className,
      type,
      partValue,
      ...data[part],
      defaultStats: data[part].defaultAttack + data[part].defaultDefense,
      image,
      effectImage
    }
    newData = [...newData, temp]
  }

  return newData
}

const formatCardsDataV1 = (data) => {
  let newData = []
  for (const part in data) {
    const iconId = data[part].iconId
    const className = part.split('-')[0]
    const bodyPart = part.split('-')[1]
    const abilityIndex = part.split('-')[2]
    const backgroundUrl = `https://cdn.axieinfinity.com/game/cards/base/${part}.png`
    const effectIconUrl = `https://cdn.axieinfinity.com/game/cards/effect-icons/${iconId}.png`
    const temp = {
      className,
      bodyPart,
      abilityIndex,
      ...data[part],
      backgroundUrl,
      effectIconUrl
    }
    newData = [...newData, temp]
  }

  return newData
}

module.exports = {
  formatCardsData,
  formatCardsDataV1
}
