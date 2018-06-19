'use strict'
import { platform } from 'os'
import { shell } from 'electron'

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
	return `https://github.com/consensus-ai/sentient-ui/releases/download/v${version}/sentient-ui-${version}-${thePlatform}-amd64.zip`
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

function updateCheck() {
	SentientAPI.call('/daemon/update', (err, result) => {
		if (err) {
			showError(err)
		} else if (result.available) {
			hideError()
			document.getElementsByClassName('new-version-download-container')[0].style.display = 'block'
			document.getElementsByClassName('new-version-available')[0].style.display = 'block'
			document.getElementsByClassName('no-new-version')[0].style.display = 'none'

			let downloadURL = genDownloadLink(result.version, platform())
			document.getElementsByClassName('new-version-link')[0].innerHTML = downloadURL
		} else {
			hideError()
			document.getElementsByClassName('new-version-download-container')[0].style.display = 'block'
			document.getElementsByClassName('new-version-available')[0].style.display = 'none'
			document.getElementsByClassName('no-new-version')[0].style.display = 'block'
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
