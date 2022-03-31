const formatCardsData = (data) => {
  let newData = []
  for (const part in data) {
    const iconId = data[part].iconId
    const className = part.split('-')[0]
    const type = part.split('-')[1]
    const partValue = part.split('-')[2]
    const image = `https://cdn.axieinfinity.com/game/cards/base/${part}.png`
    const effectImage = `https://cdn.axieinfinity.com/game/cards/effect-icons/${iconId}.png`
    const temp = {
      class: className,
      type,
      partValue,
      ...data[part],
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
