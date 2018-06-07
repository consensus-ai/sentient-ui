import PropTypes from 'prop-types'
import React from 'react'
import TransactionList from '../containers/transactionlist.js'
import SendButton from '../containers/sendbutton.js'
import SendView from '../containers/sendview.js'
import TransactionsButton from '../containers/transactionsbutton.js'
import ReceiveButton from '../containers/receivebutton.js'
import ReceiveView from '../containers/receiveview.js'
import NewWalletDialog from '../containers/newwalletdialog.js'
import LockButton from '../containers/lockbutton.js'
import RecoverButton from '../containers/recoverbutton.js'
import RecoveryDialog from '../containers/recoverydialog.js'
import ChangePasswordButton from '../containers/changepasswordbutton.js'
import ChangePasswordDialog from '../containers/changepassworddialog.js'
import BackupButton from '../containers/backupbutton.js'
import BackupPrompt from '../containers/backupprompt.js'
import BalanceInfo from '../containers/balanceinfo.js'
import LockScreen from '../containers/lockscreen.js'

import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const Wallet = ({showBackupPrompt, senfundbalance, showTransactionListView, showReceiveView, showChangePasswordDialog, showSendView, showNewWalletDialog, showRecoveryDialog, unlocked, actions }) => {
	return (
		<div className="wallet">
			<div className="balance-info-container">
				<BalanceInfo />
			</div>

			<div className="wallet-toolbar">
				<TransactionsButton />
				<ReceiveButton />
				<SendButton />
				<LockButton />
			</div>

			<div className="main-view-container">
				{unlocked && showTransactionListView ? <TransactionList /> : null}
				{unlocked && showReceiveView ? <ReceiveView /> : null}
				{unlocked && showSendView ? <SendView /> : null}
				{unlocked ? null : <LockScreen />}
			</div>

			<ToastContainer
				className='sen-toast-container'
				toastClassName='sen-toast'
				bodyClassName='sen-toast-body'
				closeButtonClassName='sen-toast-close-button'
				progressClassName='sen-toast-progress'
				transition={Slide}
				position='bottom-right'
			/>
		</div>
	)
}

Wallet.propTypes = {
	senfundbalance: PropTypes.string.isRequired,
	showNewWalletDialog: PropTypes.bool,
	showTransactionListView: PropTypes.bool,
	showSendView: PropTypes.bool,
	showReceiveView: PropTypes.bool,
	showChangePasswordDialog: PropTypes.bool,
	showBackupPrompt: PropTypes.bool,
	unlocked: PropTypes.bool,
}

export default Wallet
