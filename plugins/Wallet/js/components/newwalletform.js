import React from 'react'

const NewWalletForm = ({actions}) => {
	const handleCreateWalletClick = (e) => {
		e.preventDefault()
		let password = e.target.password.value

		if (password && password.length > 0) {
			actions.createNewWallet(e.target.password.value)
			actions.hideNewWalletForm()
		}
	}

	const handleCancelClick = (e) => {
		e.preventDefault()
		actions.hideNewWalletForm()
	}

	return (
		<div className="wallet-wallet-form-container">
			<form className="new-wallet-form" onSubmit={handleCreateWalletClick}>
				<h3>Enter a password to encrypt your wallet.</h3>
				<input type="password" name="password" autoFocus />
				<div className="new-wallet-form-buttons">
					<button type="submit">Confirm</button>
					<button onClick={handleCancelClick}>Cancel</button>
				</div>
			</form>
		</div>
	)
}

export default NewWalletForm

