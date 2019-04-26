const { getVaultSecretData } = require('./vaultUtils')
const writeToFile = require('./writeToFile')
const { getVaultInstance } = require('./vaultUtils')
process.env.VAULT_SKIP_VERIFY = true

const generate = async (vaultOptions, secretNames, secretRoom, pathToGenerate, fileName) => {
  const vaultInstance = getVaultInstance(vaultOptions)
  let secretNamesArr = secretNames.split(',')

  const secretsPromises = secretNamesArr.map(secretName =>
    getVaultSecretData(vaultInstance, secretRoom, secretName)
  )
  const secretsArray = await Promise.all(secretsPromises)

  if (fileName && fileName !== true) {
    let fileNamesArr = fileName.split(',')
    for (const secret in secretsArray) {
      const { data, name } = secretsArray[secret]
      writeToFile(pathToGenerate, name, data, fileNamesArr[secret])
    }
  } else {
    for (const secret of secretsArray) {
      const { data, name } = secret
      writeToFile(pathToGenerate, name, data)
    }
  }
}

module.exports = generate
