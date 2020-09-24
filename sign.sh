#!/bin/bash

# error output terminates this script
set -e

if [[ -z $1 || -z $2 ]]; then
	echo "Usage: $0 PRIVATE_KEY PUBLIC_KEY [UI_VERSION]"
	exit 1
fi

keyFile=$1
pubkeyFile=$2
uiVersion=${3:-v1.0.3}

# prepare folders
cd release
mkdir -p github
cd github
cp ../../LICENSE LICENSE

# make signed zip archives for each release
for os in darwin linux windows; do
	(
		zipFileName="sentient-ui-$uiVersion-$os.zip"
		if [ $os = 'darwin' ]; then
			releaseFileName="sentient-ui-$uiVersion-mac.dmg"
		elif [ $os = 'windows' ]; then
			releaseFileName="sentient-ui-$uiVersion-win.exe"
		elif [ $os = 'linux' ]; then
			releaseFileName="sentient-ui-$uiVersion-linux.AppImage"
			chmod +x ../$releaseFileName
		fi
		cp ../$releaseFileName $releaseFileName
		zip -r $zipFileName LICENSE $releaseFileName
		rm $releaseFileName

		openssl dgst -sha256 -sign $keyFile -out $zipFileName.sig $zipFileName
		if [[ -n $pubkeyFile ]]; then
			openssl dgst -sha256 -verify $pubkeyFile -signature $zipFileName.sig $zipFileName
		fi
	)
done

