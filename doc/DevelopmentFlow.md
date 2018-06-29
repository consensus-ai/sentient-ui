# Development Flow

## Running the UI

It is recommended to have `sentientd` running on your machine so that when you're actively developing
the UI, you don't have to wait for the daemon to start up and get into a synced state.

## Packaging & Releasing Sentient-UI

There is a [release.sh](https://github.com/consensus-ai/sentient-ui/blob/master/release.sh) script that can help package a release of Sentient UI.

It is mostly automated, but requires you to have a local release of [sentient-network](https://github.com/consensus-ai/sentient-network) ready. See the [Release Process](https://github.com/consensus-ai/sentient-network/blob/master/doc/Release%20Process.md) documentation for `sentient-network` for instructions on how to create a release.

You will want to update the path to those releases here: https://github.com/consensus-ai/sentient-ui/blob/master/release.sh#L56

Protip: if you have extra time, you could improve the `release.sh` script to pull the release
from Github so we don't have to rely on local filepaths.

## Other Commands

Useful commands for development.

* `npm run clean`
will get you started with a fresh repo
* `npm run fresh`
will run clean, install, then start to simulate a fresh install run of the UI.
* `npm run debug`
will run the UI with a debug port to aide in inspecting the main process.
* `npm run doc`
will generate documentation about the UI's classes and functions. It's somewhat
messy though.
* `npm run lint`
will output style suggestions for the UI's javascript, including for plugins.

