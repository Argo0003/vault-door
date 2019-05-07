var fs = require('fs')
const path = require('path')

async function writeToFile (pathToGenerate, secretName, secretData, fileName) {
  const finalPathToGenerate = path.resolve(process.cwd(), pathToGenerate)
  let name = fileName || secretName

  fs.writeFileSync(finalPathToGenerate + '/' + name, '')

  for (let key in secretData) {
    let value = secretData[key]

    if (isNaN(value)) {
      fs.appendFileSync(finalPathToGenerate + '/' + name, key + '=' + '"' + value + '"' + '\n')
    } else {
      fs.appendFileSync(finalPathToGenerate + '/' + name, key + '=' + value + '\n')
    }
  }

  return finalPathToGenerate
}

module.exports = writeToFile
