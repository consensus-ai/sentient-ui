# Sentient-UI sentientd lifecycle specification

## Introduction

The purpose of this spec is to outline the desired behaviour of Sentient-UI as it relates to starting, stopping, or connecting to an existing sentientd.

## Desired Functionality

- Sentient-UI should check for the existence of a running daemon on launch, by calling `/daemon/version` using the UI's current config.
If the daemon isn't running, Sentient-UI should launch a new sentientd instance, using the bundled sentientd binary.  If a bundled binary cannot be found, prompt the user for the location of their `sentientd`.  sentientd's lifetime should be bound to Sentient-UI, meaning that `/daemon/stop` should be called when Sentient-UI is exited.
- Alternatively, if an instance of `sentientd` is found to be running when Sentient-UI starts up, Sentient-UI should not quit the daemon when it is exited.

This behaviour can be implemented without any major changes to the codebase by leveraging the existing `detached` flag.

## Considerations

- Calling `/daemon/version` using the UI's config does not actually tell you whether or not there is an active `sentientd` running on the host, since a different `sentientd` instance could be running using a bindaddr different than the one specified in `config`.
