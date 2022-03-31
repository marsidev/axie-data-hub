const filterObjectArray = (data, filter) => {
  let filteredData = data
  for (const q in filter) {
    if (data[0][q]) {
      filteredData = filteredData.filter(card => card[q] === filter[q])
    }
  }

  return filteredData
}

module.exports = filterObjectArray
