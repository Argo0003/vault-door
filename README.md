# Description

API to access to vault for generation secrets with one command in format key=secret.

# Install

```bash
npm i vault-door -g
```

# Commands

```bash
vd-start
```

Starts a manual mode in which questions in the console will be asked step by step to access the necessary secrets. You can specify the parameters in advance using the flags to skip these questions.
Flags:

- -t - token access to vault
- -u - endpoint of vault server
- -v - version of vault, apiVersion (can not specify)
- -r - secret room for example "-r cubbyhole"
- -s - names of secrets in room,can specify several (for example "-s secret1,secret2")
- -p - path to where the secret will be saved (for example if you install by npx in your project this module and run this script and and point the way "." the secrets will be saved in root folder of your project)
- -n - with this flag, you can specify with what name the file will be saved (by default, the file name is the secret name). This parameter is optional and will not be asked to you. (for example "-n customName1,customName2" or "-n ,customName2")
- f - with this flag you can specify all the parameters using one variable. Parameters must be all and their order must be preserved. (example "-f endpoint\_\_token\_\_apiVersion\_\_secretRoom\_\_secretNames\_\_pathToGenerate\_\_fileNames")

```bash
vd-auto
```

This command supports all the same flags, but it does not support the interface of questions for more precise parameters, but simply indicates indicates the required parameters in the console that are not set.
