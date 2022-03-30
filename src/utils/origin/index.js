const fixCardsFormat = (data) => {
  let newData = []
  for (const part in data) {
    const { originCard } = data[part]
    const {
      id, // removing it since has not use and it's not unique
      partClass, // duplicated
      partType, // duplicated
      cardId,
      ...rest
    } = originCard

    const backgroundUrl = `https://cdn.axieinfinity.com/game/origin-cards/base/${cardId}.png`

    const temp = {
      cardId,
      ...rest,
      backgroundUrl
    }
    newData = [...newData, temp]
  }

  return newData
}

module.exports = {
  fixCardsFormat
}
