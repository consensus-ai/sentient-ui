# Development Flow

## Running the UI

It is recommended to have `sentientd` running on your machine so that when you're actively developing
the UI, you don't have to wait for the daemon to start up and get into a synced state.

## Packaging & Releasing Sentient-UI

For packaging releases we are using [electron-builder](https://github.com/electron-userland/electron-builder). When release candidate is ready just need to run `npm run release` command. This command will build all binaries for all platforms (darwin, windows, linux) and upload them to S3 bucket for auto-update.

There is a [sign.sh](https://github.com/consensus-ai/sentient-ui/blob/master/sign.sh) script that will pack and sign files for github releases.

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
