# Sentient-UI Plugin API Specification

## Introduction

This specification outlines the functionality that Sentient-UI's plugin API exposes to developers.

## Functionality

The Sentient-UI Plugin api exposes a simple interface for making API calls to sentientd, creating file dialogs, displaying notifications, and displaying error messages.  This interface is assigned to the `window` object of each plugin, and has the following functions:

- `SentientAPI.call()`, a wrapper to the configured `sentient.js`'s `.apiCall` function.
- `SentientAPI.config`, the current Sentient-UI config.
- `SentientAPI.hastingsToSens`, conversion function from hastings to sens.  Returns a `BigNumber` and takes either a `BigNumber` or `string`.
- `SentientAPI.sensToHastings`, conversion function from sens to hastings.
- `SentientAPI.openFile(options)`, a wrapper which calls Electron.dialog.showOpenDialog with `options`.
- `SentientAPI.saveFile(options)`, a wrapper which calls Electron.dialog.showSaveDialog with `options`.
- `SentientAPI.showMessage(options)`, a wrapper which calls Electron.showMessageBox with `options`.
- `SentientAPI.showerror(options)`, a wrapper which calls Electron.showErrorBox with `options`.
