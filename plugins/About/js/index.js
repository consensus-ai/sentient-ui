'use strict'
import { platform } from 'os'
import { remote, shell } from 'electron'
import yaml from 'js-yaml'
import semver from 'semver'
import request from 'request'
const dialog = remote.dialog
const fs = remote.require('fs')
const consensusUrl = 'https://sentient.org/?utm_source=Sentient-UI'

// Set UI version via package.json.
document.getElementsByClassName('ui-version')[0].innerHTML += VERSION

// Set daemon version via API call.
SentientAPI.call('/daemon/version', (err, result) => {
	if (err) {
		SentientAPI.showError('Error', err.toString())
	} else {
		document.getElementsByClassName('daemon-version')[0].innerHTML += result.version
	}
})

const genDownloadLink = version => {
	return `https://s3.us-east-2.amazonaws.com/consensus-ai-releases/sentient-ui/${genFileName(version)}`
}

const getVersion = async () => {
	try {
		const response = await new Promise((resolve, reject) => {
			request('https://s3.us-east-2.amazonaws.com/consensus-ai-releases/sentient-ui/latest-mac.yml', (err, resp, body) => {
				if (err) reject(err)
				resolve(body)
			})
		})
		return yaml.safeLoad(response)['version']
	} catch (err) {
		showError(err)
	}
}

const genFileName = version => {
	let releaseFileName = `sentient-ui-v${version}-mac.dmg`
	const os = platform()
	if (os === 'linux') {
		releaseFileName=`sentient-ui-v${version}-linux.AppImage`
	}	else if (os === 'win32') {
		releaseFileName=`sentient-ui-v${version}-win.exe`
	}
	return releaseFileName
}

const showError = err => {
	let errorMessage = typeof err.message !== 'undefined' ? err.message : err.toString()
	document.getElementsByClassName("error-container")[0].style.display = 'block'
	document.getElementsByClassName("error-container")[0].innerHTML = errorMessage
}

const hideError = () => {
	document.getElementsByClassName("error-container")[0].style.display = 'none'
	document.getElementsByClassName("error-container")[0].innerHTML = ""
}

const showProgressBar = version => {
	document.getElementsByClassName('mt-60')[0].style.display = 'block'
	document.getElementsByClassName("mt-60")[0].innerHTML = `A new version ${version} is downloading`
	document.getElementsByClassName("progress-bar")[0].style.display = 'block'
}

const showInfoContainer = () =>{
	document.getElementsByClassName('info-container')[0].style.display = ''
	setTimeout(() => {
		document.getElementsByClassName('info-container')[0].style.display = 'none'
	}, 3000)
}

const hideInstallButton = version => {
	document.getElementsByClassName('check-update-button')[0].style.display = ''
	document.querySelector('.progress-bar span').style.display = 'none'
	document.getElementsByClassName("mt-60")[0].innerHTML = `Something went wrong and version ${version} was not downloaded`
	document.querySelector('.check-update-button span').innerHTML = 'Try once again'
	document.getElementsByClassName("install-update-button")[0].style.display = 'none'
}

const showInstallButton = (filename, version) => {
	document.getElementsByClassName("mt-60")[0].style.display = 'block'
	document.getElementsByClassName("mt-60")[0].innerHTML = "Version  " + version + "  is ready for install"
	document.getElementsByClassName("install-update-button")[0].style.display = ''
	document.getElementsByClassName("progress-bar")[0].style.display = 'none'
	document.getElementsByClassName("install-update-button")[0].onclick = (e) => {
		shell.openItem(filename)
		document.getElementsByClassName("mt-60")[0].style.display = 'none'
		document.getElementsByClassName("install-update-button")[0].style.display = 'none'
	}
}

const saveFile = (filename, file_url, version) => {
	showProgressBar(version)
	let received_bytes = 0
	let total_bytes = 0
	let req = request({ method: 'GET', uri: file_url, timeout: 15000, pool: { maxSockets: 1000 } })
	let out = fs.createWriteStream(filename)
	req.pipe(out)

	req.on('response', (data) => {
		total_bytes = parseInt(data.headers['content-length'], 10)
	}).on('data', (chunk) => {
		received_bytes += chunk.length
		showProgress(received_bytes, total_bytes)
	}).on('end', () => {
		showInstallButton(filename, version)
	}).on('error', () => {
		hideInstallButton(version)
	})
}

const showProgress = (received, total) => {
	let percentage = (received * 100) / total
	document.querySelector('.progress-bar span').style.width = percentage + '%'
}

const updateCheck = async () => {
	document.getElementsByClassName('load')[0].style.display = 'block'
	document.getElementsByClassName('check-update-button')[0].style.display = 'none'
	hideError()
	const version = await getVersion()
	document.getElementsByClassName('load')[0].style.display = 'none'
	if (semver.lt(VERSION, version)) {
		try {
			document.getElementsByClassName('info-container')[0].style.display = 'none'
				dialog.showSaveDialog({
					title: 'Save Update File.',
					defaultPath: genFileName(version)
				}, (filename) => {
					if (filename === undefined) {
						document.getElementsByClassName('check-update-button')[0].style.display = ''
						return
					}
					showProgressBar()
					saveFile(filename, genDownloadLink(version), version)
				})
		} catch (err) {
			showError(err)
		}
	} else {
		showInfoContainer()
		document.getElementsByClassName('check-update-button')[0].style.display = ''
	}
}

document.getElementsByClassName('check-update-button')[0].onclick = updateCheck
document.getElementsByClassName('open-data-button')[0].onclick = () => shell.showItemInFolder(SentientAPI.config.sentientd.datadir)
document.querySelector('.logo img').onclick = () => shell.openExternal(consensusUrl)
