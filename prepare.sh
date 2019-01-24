#!/bin/bash

# error output terminates this script
set -e

rm -rf release/*
rm -rf tools
mkdir tools

installResources() {
	platform=$1
	os=$2

	wget "https://s3.us-east-2.amazonaws.com/consensus-ai-releases/sentient-network-tools/sentient-network-tools-${platform}-amd64.zip"

	unzip "sentient-network-tools-${platform}-amd64.zip" -d tools

	mkdir tools/${os}
	mkdir tools/${os}/sentient-miner

	bin='sentient-miner'
	if [ $platform = 'windows' ]; then
		bin="${bin}.exe"
	fi

	unzip tools/sentient-miner-*.zip -d tools/${os}/sentient-miner
	mv tools/${os}/sentient-miner/sentient-miner-* tools/${os}/sentient-miner/${bin}

	# moving miner code to the correct folder
	unzip tools/sentient-network-*.zip -d tools/${os}

	# clean up
	rm tools/sentient-miner-*.zip
	rm tools/sentient-network-*.zip
	rm -rf sentient-network-*

	# moving network code to the correct folder
	mv tools/${os}/sentient-network-* tools/${os}/sentient-network
}

installResources "osx" "mac"
# installResources "linux" "linux"
installResources "windows" "win"
