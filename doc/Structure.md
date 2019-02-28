# Structure

We try to keep the root level structure simple while still adhereing to
electron app standards.

The full root level structure is as follows

```diff
 Sentient-UI/
 ├── .git/                // Git folder
 ├── assets/              // Font & image files
 ├── css/                 // General CSS
 ├── doc/                 // Documentation like this file
 ├── js/                  // Javascript files
+├── node_modules/        // Node packages get installed to here
 ├── plugins/             // Plugins give the UI its functionality
+├── release/             // Release bundles are placed here
 ├── test/                // Testing scripts ran with mocha
+├── tools/               // Binaries are placed here
 ├── LICENSE              // MIT Open Source License
 ├── README.md            // Readme doc
 ├── index.html           // The first markup page that loads
 └── package.json         // Used with electron and npm
```
Note: '+' marked lines are generated and aren't inherent to the repository

## assets/
Contains all required content not created for specifically this UI project
(e.g. image logos, fonts, etc.)

## css/
Contains css, both imported and developed in house.

* `general.css` - Applies css rules to the general UI
* `plugin-standard.css` - Applies css rules to each plugin. Plugins only
  optionally include this as a style tag in their `index.html` files.
* `font-awesome-min.css` - Allows the usage of [Font
  Awesome](http://fontawesome.io/). The most common usage of these icons are to
  denote buttons, particularly with the text to the right of the icon as so:
```html
<div class='button'>
	<i class='fa fa-arrow-circle-o-up' />
	Update UI
</div>
```

## doc/
Contains any markdown files, except the README.md, such as this one.

## js/
Contains all the javascript files that aren't plugin specific and make up the
functionality of the general UI. In this immediate folder level, there's:

* `mainjs/` - Contains any logic related to the main process, [a concept of
  electron's](https://github.com/atom/electron/blob/master/docs/tutorial/quick-start.md#differences-between-main-process-and-renderer-process).
  It's mostly startup logic.
* `rendererjs/` - Contains any logic related to the renderer process. Mostly
  loading the UI, plugins, and various UI features like notifications.

## [node_modules/](https://www.npmjs.com/)
Created upon `npm install`. Contains all npm package dependencies used by the UI
and its plugins.

## [plugins/](/doc/Plugins.md)
Contains all plugin folders, natively designed or third-party. Plugins are
designed as webpages and are automatically initialized in the UI's startup by
looking for a `./plugins/[PLUGIN_NAME]/index.html` file.

## [release/](/doc/DevelopmentFlow.md)
Created upon running `npm run release`. Contains release made to distribute to
users

## [test/](/doc/Testing.md)
Tests written using [spectron](https://github.com/kevinsawicki/spectron).

## tools/
Created upon running `./prepare.sh`. Contains binaries for sentientd and sentient-miner.

## index.html
The starting point of the renderer process. This file structures the layout of
the general UI and loads `/js/rendererjs/uiManager.js` and
`/js/rendererjs/pluginManager.js`. This is the only non-plugin html file since
Sentient-UI is intended to be a one-page desktop app.

## package.json
Contains many details of the project. The most important parts of this file are
its dependencies and devDependencies list as well as its scripts. See [A useful
guide about using NPM as a build
tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) for a
guide of how the scripts work.

