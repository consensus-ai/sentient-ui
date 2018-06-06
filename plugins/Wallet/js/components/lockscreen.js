import PropTypes from 'prop-types'
import React from 'react'
import PasswordPrompt from '../containers/passwordprompt.js'
import InitWalletView from '../containers/initwalletview.js'
import RescanDialog from './rescandialog.js'

const LockScreen = ({unlocked, unlocking, encrypted, rescanning, initialBackupComplete}) => {
	if (unlocked && encrypted && !unlocking && !rescanning) {
		// Wallet is unlocked and encrypted, return an empty lock screen.
		return (
			<div />
		)
	}
	let lockscreenContents

	if (!encrypted || !initialBackupComplete) {
		lockscreenContents = (
			<InitWalletView />
		)
	} else if (!unlocked && encrypted && !rescanning) {
		lockscreenContents = (
			<PasswordPrompt />
		)
	}

	return (
		<div className="lockscreen-view">
			{lockscreenContents}
		</div>
	)
}
LockScreen.propTypes = {
	unlocked: PropTypes.bool.isRequired,
	unlocking: PropTypes.bool.isRequired,
	encrypted: PropTypes.bool.isRequired,
	rescanning: PropTypes.bool.isRequired,
	initialBackupComplete: PropTypes.bool.isRequired,
}

export default LockScreen
