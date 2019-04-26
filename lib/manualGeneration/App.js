const React = require('react')
const { render, Box, Color } = require('ink')
const SelectInput = require('ink-multi-select').default
const TextInput = require('ink-text-input').default
const Spinner = require('ink-spinner').default

const { getVaultInstance } = require('../vaultUtils')
const generate = require('../generate')

const getArgsData = require('./getArgsData.js')
const { argsData } = getArgsData()
const { apiVersion, endpoint, token, secretNames, secretRoom, pathToGenerate, fileName } = argsData

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      argumentsCheckList: {
        token: !!(token && token !== true),
        endpoint: !!(endpoint && endpoint !== true),
        secretRoom: !!(secretRoom && secretRoom !== true),
        pathToGenerate: !!(pathToGenerate && pathToGenerate !== true),
        secretNames: !!(secretNames && secretNames !== true)
      },
      currentProcessState: '',
      token: token && token !== true ? token : '',
      endpoint: endpoint && endpoint !== true ? endpoint : '',
      secretRoom: secretRoom && secretRoom !== true ? secretRoom : '',
      pathToGenerate: pathToGenerate && pathToGenerate !== true ? pathToGenerate : '',
      isShowSelect: false,
      isLoading: false,
      project: '',
      secretList: [],
      secretNames: secretNames && secretNames !== true ? secretNames : ''
    }

    this.getVaultSecretsList = this.getVaultSecretsList.bind(this)
    this.getComponentByProcessState = this.getComponentByProcessState.bind(this)
    this.getCurrentProcessState = this.getCurrentProcessState.bind(this)
    this.handleGenerate = this.handleGenerate.bind(this)
  }

  getComponentByProcessState () {
    const { currentProcessState } = this.state
    const processStateToComponent = {
      token: (
        <Box>
          <Box marginLeft={1}>Enter a token:</Box>
          <TextInput
            value={this.state.token}
            onChange={val => this.handleChange({ key: 'token', value: val })}
            onSubmit={() => this.handleSubmit('token')}
          />
        </Box>
      ),
      endpoint: (
        <Box>
          <Box marginLeft={1}>Enter an endpoint url:</Box>
          <TextInput
            value={this.state.endpoint}
            onChange={val => this.handleChange({ key: 'endpoint', value: val })}
            onSubmit={() => this.handleSubmit('endpoint')}
          />
        </Box>
      ),
      secretRoom: (
        <Box>
          <Box marginLeft={1}>Enter a secret room:</Box>
          <TextInput
            value={this.state.secretRoom}
            onChange={val => this.handleChange({ key: 'secretRoom', value: val })}
            onSubmit={() => this.handleSubmit('secretRoom')}
          />
        </Box>
      ),
      pathToGenerate: (
        <Box>
          <Box marginLeft={1}>Enter a path to where generate (current directory by default):</Box>
          <TextInput
            value={this.state.pathToGenerate}
            onChange={val => this.handleChange({ key: 'pathToGenerate', value: val })}
            onSubmit={() => this.handleSubmit('pathToGenerate')}
          />
        </Box>
      ),
      secretNames: (
        <Box>
          <Box marginLeft={1}>Select project(press 'Space' to select and 'Enter' to submit):</Box>
          <SelectInput
            items={this.state.secretList}
            onSelect={project => this.handleSelectSecrets(project)}
            onSubmit={() => this.handleSubmitSecrets()}
          />
        </Box>
      ),
      finish: (
        <Box>
          <Box />
          <Box marginLeft={1}>
            <Color green>
              Secrets <Color rgb={[249, 176, 49]}>{this.state.secretNames}</Color> successfully
              written to <Color rgb={[249, 176, 49]}>{this.state.pathToGenerate}</Color>
            </Color>
          </Box>
        </Box>
      )
    }

    return processStateToComponent[currentProcessState]
  }

  getCurrentProcessState () {
    for (let arg in this.state.argumentsCheckList) {
      if (!this.state.argumentsCheckList[arg]) {
        this.setState({ currentProcessState: arg })
        break
      }
    }
  }

  componentWillMount () {
    if (
      this.state.endpoint &&
      this.state.token &&
      this.state.secretRoom &&
      this.state.pathToGenerate &&
      !secretNames
    ) {
      this.setState({ isLoading: true })
      this.getVaultSecretsList()
      this.setState({ isLoading: false })
      this.setState({ currentProcessState: 'secretNames' })
    } else {
      this.getCurrentProcessState()
    }

    if (
      this.state.endpoint &&
      this.state.token &&
      this.state.secretRoom &&
      this.state.pathToGenerate &&
      secretNames
    ) {
      this.handleGenerate()
    }
  }

  render () {
    const Component = this.getComponentByProcessState()
    if (this.state.isLoading === true) {
      return (
        <Box>
          <Color green>
            <Spinner type="dots" />
          </Color>
        </Box>
      )
    } else {
      return Component
    }
  }

  handleChange (obj) {
    this.setState({ [obj.key]: obj.value })
  }

  handleSubmit (arg) {
    this.setState({
      argumentsCheckList: {
        ...this.state.argumentsCheckList,
        [arg]: true
      }
    })

    if (arg === 'pathToGenerate' && this.state.pathToGenerate === '') {
      this.setState({ pathToGenerate: '.' })
    }

    if (
      this.state.endpoint &&
      this.state.token &&
      this.state.secretRoom &&
      this.state.pathToGenerate &&
      !secretNames
    ) {
      this.setState({ isLoading: true })
      this.getVaultSecretsList()
      this.setState({ isLoading: false })
      this.setState({ currentProcessState: 'secretNames' })
    } else if (
      this.state.endpoint &&
      this.state.token &&
      this.state.secretRoom &&
      this.state.pathToGenerate &&
      secretNames &&
      secretNames !== true
    ) {
      this.handleGenerate()
    } else {
      this.getCurrentProcessState()
    }
  }

  handleGenerate () {
    generate(
      {
        endpoint: this.state.endpoint,
        token: this.state.token,
        apiVersion: apiVersion || 'v1'
      },
      this.state.secretNames,
      this.state.secretRoom,
      this.state.pathToGenerate || '.',
      fileName
    )
    this.setState({ currentProcessState: 'finish' })
  }

  getVaultSecretsList () {
    const run = async () => {
      try {
        const vaultInstance = getVaultInstance({
          endpoint: this.state.endpoint,
          token: this.state.token,
          apiVersion: apiVersion || 'v1'
        })
        var secretList = await vaultInstance.list(this.state.secretRoom)
        var list = secretList.data.keys.map(secret => {
          return { label: secret, value: secret }
        })
        this.setState({ secretList: list })
        this.setState({ isLoading: false })
      } catch (err) {
        console.log(err.message)
        unmount()
      }
    }
    run()
  }

  handleSelectSecrets (secret) {
    this.setState({
      secretNames: this.state.secretNames
        ? this.state.secretNames + ',' + secret.value
        : secret.value
    })
  }

  handleSubmitSecrets () {
    this.setState({ isLoading: true })
    const run = async () => {
      this.handleGenerate()
      this.setState({ isLoading: false, currentProcessState: 'finish' })
    }
    run()
  }
}

const { unmount } = render(<App />)
