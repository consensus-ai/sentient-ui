import React from 'react'
import PropTypes from 'prop-types'

const BalanceInfo = ({synced, confirmedbalance, unconfirmedbalance, senfundbalance, senclaimbalance}) => {
	let walletIconClassName = synced ? 'balance-info-synced-icon' : 'balance-info-not-synced-icon'
	walletIconClassName = 'balance-info-icon ' + walletIconClassName

	// format to 123,456,789.00
	let formattedConfirmedBalance = confirmedbalance.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
	return (
		<div className="balance-info">
			<div className={walletIconClassName}></div>
			<div className="balance-info-amount-container">
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
	senfundbalance: PropTypes.string.isRequired,
	senclaimbalance: PropTypes.string.isRequired,
}
export default BalanceInfo

