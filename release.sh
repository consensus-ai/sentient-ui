#!/bin/bash

# error output terminates this script
set -e

# This script creates a Sentient-UI release for all 3 platforms: osx (darwin),
# linux, and windows. It takes 5 arguments, the first two arguments are the
# private and public key used to sign the release archives. The last three
# arguments are semver strings, the first of which being the ui version, second
# being the Sentient version, and third being the electron version.

if [[ -z $1 || -z $2 ]]; then
	echo "Usage: $0 PRIVATE_KEY PUBLIC_KEY [UI_VERSION] [SENTIENT-NETWORK_VERSION] [ELECTRON_VERSION]"
	exit 1
fi

# ensure we have a clean node_modules
rm -rf ./node_modules
npm install

# build the UI's js
rm -rf ./dist
npm run build-production

keyFile=$1
pubkeyFile=$2
uiVersion=${3:-v0.0.1}
senVersion=${4:-v0.0.1}
electronVersion=${5:-v2.0.2}

electronOSX="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-darwin-x64.zip"
electronLinux="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-linux-x64.zip"
electronWindows="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-win32-x64.zip"

senOSXFileName="sentient-network-${senVersion}-darwin-amd64.zip"
senLinuxFileName="sentient-network-${senVersion}-linux-amd64.zip"
senWindowsFileName="sentient-network-${senVersion}-windows-amd64.zip"

rm -rf release/*

installSentientNetwork() {
	platform=$1

	if [ $platform = 'osx' ]; then
		releaseFileName=$senOSXFileName
		appDir="Sentient-UI.app/Contents/Resources/app/"
	elif [ $platform = 'linux' ]; then
		releaseFileName=$senLinuxFileName
		appDir="resources/app/"
	elif [ $platform = 'windows' ]; then
		releaseFileName=$senWindowsFileName
		appDir="resources/app/"
	fi

	# get the release
	cp /Users/vladimirli/.go/src/github.com/consensus-ai/sentient-network/release/$releaseFileName .
	unzip ./$releaseFileName
	rm $releaseFileName

	# install into app dir
	mv sentient-network-v* $appDir/sentient-network
	mv $appDir/sentient-network/config/genesis* $appDir/sentient-network/config/genesis.json
}

# package copies all the required javascript, html, and assets into an electron package.
package() {
	src=$1
	dest=$2
	cp -r ${src}/{plugins,assets,css,dist,index.html,package.json,js} $dest
}

buildOSX() {
	mkdir -p release/darwin
	cd release/darwin

	# get electron
	wget $electronOSX
	unzip ./electron*
	rm electron*.zip

	# set up electron app
	mv Electron.app Sentient-UI.app
	mv Sentient-UI.app/Contents/MacOS/Electron Sentient-UI.app/Contents/MacOS/Sentient-UI

	# NOTE: this only works with GNU sed
	# if you have OSX, please run "brew install gnu-sed --with-default-names"
	# or see https://stackoverflow.com/questions/30003570/how-to-use-gnu-sed-on-mac-os-x
	sed -i 's/>Electron</>Sentient-UI</' Sentient-UI.app/Contents/Info.plist
	sed -i 's/>'"${electronVersion:1}"'</>'"${senVersion:1}"'</' Sentient-UI.app/Contents/Info.plist
	sed -i 's/>com.github.electron\</>com.consensusai.sentientui</' Sentient-UI.app/Contents/Info.plist
	sed -i 's/>electron.icns</>icon.icns</' Sentient-UI.app/Contents/Info.plist
	cp ../../assets/icon.icns Sentient-UI.app/Contents/Resources/
	rm -r Sentient-UI.app/Contents/Resources/default_app.asar
	mkdir Sentient-UI.app/Contents/Resources/app
	package "../../" "Sentient-UI.app/Contents/Resources/app"
	cp ../../LICENSE .

	# install sentient-network
	installSentientNetwork "osx"
}

buildLinux() {
	mkdir -p release/linux
	cd release/linux

	# get electron
	wget $electronLinux
	unzip ./electron*
	rm electron*.zip

	# set up electron app
	mv electron Sentient-UI
	rm -r resources/default_app.asar
	mkdir resources/app
	package "../../" "resources/app"
	cp ../../LICENSE .

	# install sentient-network
	installSentientNetwork "linux"
}

buildWindows() {
	mkdir -p release/windows
	cd release/windows

	# get electron
	wget $electronWindows
	unzip ./electron*
	rm electron*.zip

	# set up electron app
	mv electron.exe Sentient-UI.exe
	wget https://github.com/electron/rcedit/releases/download/v0.1.0/rcedit.exe
	wine rcedit.exe Sentient-UI.exe --set-icon '../../assets/icon.ico'
	rm -f rcedit.exe
	rm resources/default_app.asar
	mkdir resources/app
	package "../../" "resources/app"
	cp ../../LICENSE .

	# install sentient-network
	installSentientNetwork "windows"
}

# make osx release
( buildOSX )

# make linux release
( buildLinux )

# make windows release
( buildWindows )

# make signed zip archives for each release
for os in darwin linux windows; do
	(
		zipFileName="sentient-ui-$uiVersion-$os-amd64.zip"

		cd release/${os}
		zip -r ../$zipFileName .
		cd ..
		openssl dgst -sha256 -sign $keyFile -out $zipFileName.sig $zipFileName
		if [[ -n $pubkeyFile ]]; then
			openssl dgst -sha256 -verify $pubkeyFile -signature $zipFileName.sig $zipFileName
		fi
	)
done

