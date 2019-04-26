const vault = require('node-vault')

const getVaultInstance = vaultOptions => {
  return vault(vaultOptions)
}

const getVaultSecretData = async (vaultInstance, secretRoom, secretName) => {
  const secret = await vaultInstance.read(secretRoom + '/' + secretName)
  return {
    name: secretName,
    data: secret.data
  }
}

module.exports = {
  getVaultInstance,
  getVaultSecretData
}
