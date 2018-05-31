import React from 'react'

const ReceiveButton = ({actions}) => {
	const handleReceiveButtonClick = () => actions.showReceivePrompt()
	return (
		<div className="wallet-button receive-button" onClick={handleReceiveButtonClick}>
			<div className="receive-button-icon"></div>
			<span>Addresses</span>
		</div>
	)
}

export default ReceiveButton
