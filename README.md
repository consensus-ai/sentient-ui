# Development Setup

## Prerequisites

- [sentientd](https://github.com/consensus-ai/sentient-network)
- [node & npm 6.9.0 LTS](https://nodejs.org/download/)
Earlier node versions may work, but they do not have guaranteed support.
- `libxss` is a required dependency for Electron on Debian, it can be installed with `sudo apt-get install libxss1`.

## Running

[Download your OS's release archive and unzip it](https://github.com/consensus-ai/sentient-ui/releases)

### OR

Run from source

0. Install dependencies mentioned above
1. Download or `git clone` the repository
2. `npm install`
3. `npm start`

## Build new release

### Prerequisites

For Mac OS

0. brew install wine
1. brew install gnu-sed --with-default-names
2. brew install wget

Steps for bulding new release

0. Download latest [Sentient Network](https://github.com/consensus-ai/sentient-network/releases) files and put to home directory.
1. Bump [version](https://github.com/consensus-ai/sentient-ui/blob/26c672315cff0380e7481def00852455c974b6d6/package.json#L3)
2. Run from working directory `./release.sh PRIVATE_KEY PUBLIC_KEY [UI_VERSION] [SENTIENT-NETWORK_VERSION] [ELECTRON_VERSION]`

## [Contributing](doc/Developers.md)

Read the document linked above to learn more about the application and its technologies.

Take a look at our [issues page](https://github.com/consensus-ai/sentient-ui/issues)
for a high level view of what objectives we're working on.

If you're the type to jump right into code, simply search through the project
(sans the `node_modules` folder) for the term `TODO:`. If you're on a UNIX
(Linux & OSX) system, run `grep -r 'TODO:' js plugins` in a terminal at the
root level of the project

