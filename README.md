# Development Setup

## Prerequisites

- [sentientd](https://github.com/consensus-ai/sentient-network)
- [sentient-miner](https://github.com/consensus-ai/sentient-miner)
- [node & npm 6.9.0 LTS](https://nodejs.org/download/)
Earlier node versions may work, but they do not have guaranteed support.
- `libxss` is a required dependency for Electron on Debian, it can be installed with `sudo apt-get install libxss1`.

## Running

[Download your OS's release archive and unzip it](https://github.com/consensus-ai/sentient-ui/releases)

### OR

Run from source

1. Install dependencies mentioned above
2. Download or `git clone` the repository
3. `npm install`
4. `npm start`

`NOTE` if you are running from source please specify path to sentientd and sentient-miner using these environment variables: _SENTIENTD_PATH_ and _SENTIENT_MINER_PATH_.

## Build new release

1. Bump [version](https://github.com/consensus-ai/sentient-ui/blob/master/package.json#L3)
2. Run commad `npm run release`. This command will upload all needed files to S3 bucket for auto-updating app.
3. From working directory `./sign.sh PRIVATE_KEY PUBLIC_KEY [UI_VERSION]`. This command will create a signed archive for github release files.

## [Contributing](doc/Developers.md)

Read the document linked above to learn more about the application and its technologies.

Take a look at our [issues page](https://github.com/consensus-ai/sentient-ui/issues)
for a high level view of what objectives we're working on.

If you're the type to jump right into code, simply search through the project
(sans the `node_modules` folder) for the term `TODO:`. If you're on a UNIX
(Linux & OSX) system, run `grep -r 'TODO:' js plugins` in a terminal at the
root level of the project

