const formatCardsData = (data) => {
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

    const image = `https://cdn.axieinfinity.com/game/origin-cards/base/${cardId}.png`

    const temp = {
      cardId,
      ...rest,
      image
    }
    newData = [...newData, temp]
  }

  return newData
}

const formatToolsData = (data) => {
  const tools = data.filter(t => (t.status === '!1' && t.toolCard === '!1'))
  const statuses = data.filter(t => (t.status === '!0' && t.toolCard === '!1'))
  let abilities = data.filter(t => (t.status === '!1' && t.toolCard === '!0'))

  abilities = abilities.map(a => {
    const { data, ...rest } = a

    const {
      ability_type: abilityType,
      ...restOfData
    } = data

    const image = `https://cdn.axieinfinity.com/game/origin-cards/base/tool-${restOfData.code.toLowerCase()}-02.png`

    return {
      ...rest,
      data: {
        ...restOfData,
        abilityType,
        image
      }
    }
  })

  return {
    abilities,
    tools,
    statuses
  }
}

module.exports = {
  formatCardsData,
  formatToolsData
}
