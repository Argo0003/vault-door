const generate = require('../generate')
const getArgsData = require('./getArgsData.js')

const { argsData, isValid } = getArgsData()

const { apiVersion, endpoint, token, secretNames, secretRoom, pathToGenerate, fileName } = argsData

const vaultOptions = {
  apiVersion,
  endpoint,
  token
}

const autoGeneration = async () => {
  if (!isValid) {
    return
  }
  await generate(vaultOptions, secretNames, secretRoom, pathToGenerate, fileName)

  console.log(`\
  Secret ${secretNames} successfully written to file.
  `)
}

module.exports = autoGeneration
