import PropTypes from 'prop-types'
import React from 'react'
import TransactionList from '../containers/transactionlist.js'
import SendButton from '../containers/sendbutton.js'
import SendPrompt from '../containers/sendprompt.js'
import ReceiveButton from '../containers/receivebutton.js'
import ReceivePrompt from '../containers/receiveprompt.js'
import NewWalletDialog from '../containers/newwalletdialog.js'
import LockButton from '../containers/lockbutton.js'
import RecoverButton from '../containers/recoverbutton.js'
import RecoveryDialog from '../containers/recoverydialog.js'
import ChangePasswordButton from '../containers/changepasswordbutton.js'
import ChangePasswordDialog from '../containers/changepassworddialog.js'
import BackupButton from '../containers/backupbutton.js'
import BackupPrompt from '../containers/backupprompt.js'
import BalanceInfo from '../containers/balanceinfo.js'

const Wallet = ({showBackupPrompt, senfundbalance, showReceivePrompt, showChangePasswordDialog, showSendPrompt, showNewWalletDialog, showRecoveryDialog, actions }) => {
	return (
		<div className="wallet">
			<div className="balance-info-container">
				<BalanceInfo />
			</div>

			<div className="wallet-toolbar">
				<ReceiveButton />
				<SendButton />
				<LockButton />
			</div>

			{showNewWalletDialog ? <NewWalletDialog /> : null}
			{showSendPrompt ? <SendPrompt /> : null}
			{showReceivePrompt ? <ReceivePrompt /> : null}
			{showRecoveryDialog ? <RecoveryDialog /> : null}
			{showChangePasswordDialog ? <ChangePasswordDialog /> : null}
			{showBackupPrompt ? <BackupPrompt /> : null}

			<TransactionList />
		</div>
	)
}

Wallet.propTypes = {
	senfundbalance: PropTypes.string.isRequired,
	showNewWalletDialog: PropTypes.bool,
	showSendPrompt: PropTypes.bool,
	showReceivePrompt: PropTypes.bool,
	showChangePasswordDialog: PropTypes.bool,
	showBackupPrompt: PropTypes.bool,
}

export default Wallet
