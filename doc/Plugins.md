# Plugins

In order to form a more modular codebase, most functionality in the UI is
contained in webpage like structures we call "Plugins".

## What is a plugin?

A plugin, in the context of Sentient-UI, is a self-contained add-on that offers
graphical functionality to interact with the Sentient Network. We'll develop plugins
we believe would be widely used, but we're also redesigning Sentient-UI to enable
third-party developers interested in our project to make their own plugins.

The structure of a plugin is the exact same as a webpage, with some added
functionality via Node.js & Electron. There are only two hard-rules to a
plugin:

1. It must be self-contained in a directory of its name.
2. It must have an index.html in this directory.
3. It must have own css folder.
