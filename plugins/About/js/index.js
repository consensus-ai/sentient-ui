'use strict'
import { platform } from 'os'
import { remote, shell } from 'electron'
import request from 'request'
const dialog = remote.dialog
const fs = remote.require('fs')

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

function genDownloadLink(version, thePlatform) {
	return `https://github.com/consensus-ai/sentient-ui/releases/download/${version}/${genFileName(version, thePlatform)}`
}

function genFileName(version, thePlatform) {
	return `sentient-ui-${version}-${thePlatform}-amd64.zip`
}

function showError(err) {
	let errorMessage = typeof err.message !== 'undefined' ? err.message : err.toString()
	document.getElementsByClassName("error-container")[0].style.display = 'block'
	document.getElementsByClassName("error-container")[0].innerHTML = errorMessage
}

function hideError() {
	document.getElementsByClassName("error-container")[0].style.display = 'none'
	document.getElementsByClassName("error-container")[0].innerHTML = ""
}

function showProgressBar(version) {
	document.getElementsByClassName('mt-60')[0].style.display = 'block'
	document.getElementsByClassName("mt-60")[0].innerHTML = `A new version ${version} is downloading`
	document.getElementsByClassName("progress-bar")[0].style.display = 'block'
}

function showInstallButton(filename, version) {
	document.getElementsByClassName("mt-60")[0].style.display = 'block'
	document.getElementsByClassName("mt-60")[0].innerHTML = "Version  " + version + "  is ready for install"
	document.getElementsByClassName("install-update-button")[0].style.display = 'block'
	document.getElementsByClassName("progress-bar")[0].style.display = 'none'
	document.getElementsByClassName("install-update-button")[0].onclick = (e) => {
		shell.openItem(filename)
	}
}

function saveFile(filename, file_url, version) {
	showProgressBar(version)
	let received_bytes = 0;
	let total_bytes = 0;
	let req = request({ method: 'GET', uri: file_url, timeout: 1500 })
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
		alert('HERE OLOLO')
	})
}

function showProgress(received, total) {
	let percentage = (received * 100) / total;
	document.querySelector('.progress-bar span').style.width = percentage + '%'
}

function updateCheck() {
	request('https://api.github.com/repos/consensus-ai/sentient-ui/releases/latest', 
		{ headers: { 'User-Agent': ' Sentient-UI' },  json: true }, (err, res, body) => {
		if (res && res.statusCode === 200) {
			hideError()
			if (body.tag_name === `v${VERSION}`) {
				document.getElementsByClassName('info-container')[0].style.display = 'none'
				document.getElementsByClassName('check-update-button')[0].style.display = 'none'
				dialog.showSaveDialog({
					title: 'Save Update File.',
					defaultPath: genFileName(body.tag_name, platform())
				}, (filename) => {
					if (filename === undefined) return
					showProgressBar()
					saveFile(filename, genDownloadLink(body.tag_name, platform()), body.tag_name)
				})
			} else {
				document.getElementsByClassName('info-container')[0].style.display = 'block'
				document.getElementsByClassName('new-version-available')[0].style.display = 'none'
			}
		} else {
			showError(err)
		}
	})
}

document.getElementsByClassName('check-update-button')[0].onclick = updateCheck
document.getElementsByClassName('open-data-button')[0].onclick = () => {
	shell.showItemInFolder(SentientAPI.config.sentientd.datadir)
}
document.getElementsByClassName('new-version-link')[0].onclick = (e) => {
	shell.openExternal(e.target.innerHTML)
}
