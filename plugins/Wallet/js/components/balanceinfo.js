import React from 'react'
import PropTypes from 'prop-types'

const BalanceInfo = ({synced, confirmedbalance, unconfirmedbalance}) => {
	let walletIconClassName = synced ? 'balance-info-synced-icon' : 'balance-info-not-synced-icon'
	walletIconClassName = 'balance-info-icon ' + walletIconClassName

	// format to 123,456,789.00
	let formattedConfirmedBalance = confirmedbalance.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
	let formattedUnconfirmedBalance = unconfirmedbalance.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')

	// prep tooltips
	let statusTooltipText = synced ? "" : "Your wallet is not synced, balances are not final"
	let balanceTooltipText = formattedUnconfirmedBalance + " SEN pending"

	return (
		<div className="balance-info">
			<div className={walletIconClassName} title={statusTooltipText}></div>

			<div className="balance-info-amount-container" title={balanceTooltipText}>
				<span className="balance-info-amount">{formattedConfirmedBalance}</span>
				<span className="balance-info-currency">SEN</span>
			</div>
		</div>
	)
}
BalanceInfo.propTypes = {
	synced: PropTypes.bool.isRequired,
	confirmedbalance: PropTypes.string.isRequired,
	unconfirmedbalance: PropTypes.string.isRequired,
}
export default BalanceInfo

