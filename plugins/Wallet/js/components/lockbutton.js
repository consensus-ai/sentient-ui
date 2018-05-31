import React from 'react'

const LockButton = ({actions}) => {
	const handleLockButtonClick = () => actions.lockWallet()
	return (
		<div className="lock-button" onClick={handleLockButtonClick}>
			<div className="lock-button-icon"></div>
		</div>
	)
}

export default LockButton
