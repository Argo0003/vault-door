var argv = require('minimist')(process.argv)

const getArgsData = () => {
  let {
    f: fullInfo,
    v: apiVersion = 'v1',
    u: endpoint,
    t: token,
    r: secretRoom,
    s: secretNames,
    p: pathToGenerate,
    n: fileName
  } = argv
  if (fullInfo !== undefined) {
    ;[
      endpoint,
      token,
      apiVersion,
      secretRoom,
      secretNames,
      pathToGenerate,
      fileName
    ] = fullInfo.split('__')
  }

  const argsData = {
    apiVersion,
    endpoint,
    token,
    secretNames,
    secretRoom,
    pathToGenerate,
    fileName
  }
  const isValid = validateArgs(argsData)

  return { argsData, isValid }
}

/**
 * required param is true by default
 */
const requiredArgs = [
  { name: 'fullInfo', key: 'f', required: false },
  { name: 'apiVersion', key: 'v' },
  { name: 'endpoint', key: 'u' },
  { name: 'token', key: 't' },
  { name: 'secretRoom', key: 'r' },
  { name: 'secretNames', key: 's' },
  { name: 'pathToGenerate', key: 'p' },
  { name: 'fileName', key: 'n', required: false }
]

const validateArgs = argsData => {
  const invalidArgs = requiredArgs.filter(argInfo => {
    return argInfo.required !== false && argsData[argInfo.name] === undefined
  })

  if (invalidArgs.length > 0) {
    return false
  }

  return true
}

module.exports = getArgsData
