#!/bin/bash

# error output terminates this script
set -e

# This script creates a Sentient-UI release for all 3 platforms: osx (darwin),
# linux, and windows. It takes 5 arguments, the first two arguments are the
# private and public key used to sign the release archives. The last three
# arguments are semver strings, the first of which being the ui version, second
# being the Sentient version, and third being the electron version.

if [[ -z $1 || -z $2 ]]; then
	echo "Usage: $0 privatekey publickey uiversion senversion electronversion"
	exit 1
fi

# ensure we have a clean node_modules
rm -rf ./node_modules
npm install

# build the UI's js
rm -rf ./dist
npm run build-production

uiVersion=${3:-v1.3.2}
siaVersion=${4:-v1.3.2}
electronVersion=${5:-v1.6.4}

# fourth argument is the public key file path.
keyFile=`readlink -f $1`
pubkeyFile=`readlink -f $2`


electronOSX="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-darwin-x64.zip"
electronLinux="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-linux-x64.zip"
electronWindows="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-win32-x64.zip"

siaOSX="/Users/vladimirli/.go/src/github.com/consensus-ai/sentient-network/release/Sentient-${siaVersion}-darwin-amd64.zip"
siaLinux="/Users/vladimirli/.go/src/github.com/consensus-ai/sentient-network/release/Sentient-${siaVersion}-linux-amd64.zip"
siaWindows="/Users/vladimirli/.go/src/github.com/consensus-ai/sentient-network/release/Sentient-${siaVersion}-windows-amd64.zip"

rm -rf release/
mkdir -p release/{osx,linux,win32}

# package copies all the required javascript, html, and assets into an electron package.
package() {
	src=$1
	dest=$2
	cp -r ${src}/{plugins,assets,css,dist,index.html,package.json,js} $dest
}

buildOSX() {
	cd release/osx
	wget $electronOSX
	unzip ./electron*
	mv Electron.app Sentient-UI.app
	mv Sentient-UI.app/Contents/MacOS/Electron Sentient-UI.app/Contents/MacOS/Sentient-UI
	# NOTE: this only works with GNU sed, other platforms (like OSX) may fail here
	sed -i 's/>Electron</>Sentient-UI</' Sentient-UI.app/Contents/Info.plist
	sed -i 's/>'"${electronVersion:1}"'</>'"${siaVersion:1}"'</' Sentient-UI.app/Contents/Info.plist
	sed -i 's/>com.github.electron\</>com.nebulouslabs.siaui</' Sentient-UI.app/Contents/Info.plist
	sed -i 's/>electron.icns</>icon.icns</' Sentient-UI.app/Contents/Info.plist
	cp ../../assets/icon.icns Sentient-UI.app/Contents/Resources/
	rm -r Sentient-UI.app/Contents/Resources/default_app.asar
	mkdir Sentient-UI.app/Contents/Resources/app
	(
		cd Sentient-UI.app/Contents/Resources/app
		cp $siaOSX .
		unzip ./Sentient-*
		rm ./Sentient*.zip
		mv ./Sentient-* ./Sentient
	)
	package "../../" "Sentient-UI.app/Contents/Resources/app"
	rm -r electron*.zip
	cp ../../LICENSE .
}

buildLinux() {
	cd release/linux
	wget $electronLinux
	unzip ./electron*
	mv electron Sentient-UI
	rm -r resources/default_app.asar
	mkdir resources/app
	(
		cd resources/app
		cp $siaLinux .
		unzip ./Sentient-*
		rm ./Sentient*.zip
		mv ./Sentient-* ./Sentient
	)
	package "../../" "resources/app"
	rm -r electron*.zip
	cp ../../LICENSE .
}

buildWindows() {
	cd release/win32
	wget $electronWindows
	unzip ./electron*
	mv electron.exe Sentient-UI.exe
	wget https://github.com/electron/rcedit/releases/download/v0.1.0/rcedit.exe
	wine rcedit.exe Sentient-UI.exe --set-icon '../../assets/icon.ico'
	rm -f rcedit.exe
	rm resources/default_app.asar
	mkdir resources/app
	(
		cd resources/app
		cp $siaWindows .
		unzip ./Sentient-*
		rm ./Sentient*.zip
		mv ./Sentient-* ./Sentient
	)
	package "../../" "resources/app"
	rm -r electron*.zip
	cp ../../LICENSE .
}

# make osx release
( buildOSX )

# make linux release
( buildLinux )

# make windows release
( buildWindows )

# make signed zip archives for each release
for os in win32 linux osx; do
	(
		cd release/${os}
		zip -r ../Sentient-UI-${uiVersion}-${os}-x64.zip .
		cd ..
		openssl dgst -sha256 -sign $keyFile -out Sentient-UI-${uiVersion}-${os}-x64.zip.sig Sentient-UI-${uiVersion}-${os}-x64.zip
		if [[ -n $pubkeyFile ]]; then
			openssl dgst -sha256 -verify $pubkeyFile -signature Sentient-UI-${uiVersion}-${os}-x64.zip.sig Sentient-UI-${uiVersion}-${os}-x64.zip
		fi
		rm -rf release/${os}
	)
done

