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

## [Contributing](doc/Developers.md)

Read the document linked above to learn more about the application and its technologies.

Take a look at our [issues page](https://github.com/consensus-ai/sentient-ui/issues)
for a high level view of what objectives we're working on.

If you're the type to jump right into code, simply search through the project
(sans the `node_modules` folder) for the term `TODO:`. If you're on a UNIX
(Linux & OSX) system, run `grep -r 'TODO:' js plugins` in a terminal at the
root level of the project

