import PropTypes from 'prop-types'
import React from 'react'
import NewWalletForm from '../containers/newwalletform.js'
import InitSeedForm from './initseedform.js'

const UninitializedWalletDialog = ({initializingSeed, showInitSeedForm, showNewWalletForm, actions}) => {
	if (showNewWalletForm) {
		return (
			<NewWalletForm />
		)
	}
	if (showInitSeedForm) {
		return (
			<InitSeedForm
				initializingSeed={initializingSeed}
				createNewWallet={actions.createNewWallet}
			/>
		)
	}

	const handleCreateWalletClick = () => actions.showNewWalletForm()
	const handleCreateWalletFromSeedClick = () => actions.showInitSeedForm()

	return (
		<div className="uninitialized-wallet-dialog">
			<div className="wallet-init-buttons">
				<div onClick={handleCreateWalletClick} className="create-wallet-button">
					<i className="fa fa-plus-circle fa-4x" />
					<h3>Create a new wallet</h3>
				</div>
				<div className="create-wallet-button">
					<i className="fa fa-key fa-4x" onClick={handleCreateWalletFromSeedClick} />
					<h3>Load a wallet from a seed</h3>
				</div>
			</div>
		</div>
	)
}

UninitializedWalletDialog.propTypes = {
	showNewWalletForm: PropTypes.bool.isRequired,
	initializingSeed: PropTypes.bool.isRequired,
}

export default UninitializedWalletDialog

