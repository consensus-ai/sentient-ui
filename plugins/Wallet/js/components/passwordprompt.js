import PropTypes from 'prop-types'
import React from 'react'

const PasswordPrompt = ({password, error, unlocking, actions}) => {
	const onPasswordChange = (e) => actions.handlePasswordChange(e.target.value)

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			onUnlockClick()
		}
	}

	const onUnlockClick = () => {
		if (password && password.length > 0) {
			actions.unlockWallet(password)
		}
	}

	const getUnlockBtnActiveClass = () => {
		if (password && password.length > 0) {
			return "active"
		}
		return ""
	}

	if (unlocking) {
		return (
			<div className="password-prompt">
				<span className="unlock-status">Unlocking your wallet, this may take up to several minutes...</span>
			</div>
		)
	}

	return (
		<div className="password-prompt" onKeyPress={handleKeyPress}>
			<label>Enter your wallet password to unlock the wallet</label>
			<input type="password" value={password} className="password-input" onChange={onPasswordChange} placeholder="password" />
			<div className="password-error">{error}</div>
			<div className={"button unlock-button-container " + getUnlockBtnActiveClass()} onClick={onUnlockClick}>
				<div className="unlock-button-icon"></div>
				<div className="unlock-button-label">Unlock wallet</div>
			</div>
		</div>
	)
}
PasswordPrompt.propTypes = {
	password: PropTypes.string.isRequired,
	error: PropTypes.string,
}

export default PasswordPrompt
