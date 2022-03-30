const path = require('path')
const fs = require('fs')

const filesList = (directory) => {
  const directoryPath = path.join(__dirname, directory)
  return fs.readdirSync(directoryPath)
}

module.exports = filesList
