import PropTypes from 'prop-types'
import React from 'react'
import BigNumber from 'bignumber.js'
import { toast } from 'react-toastify'

const SendView = ({currencytype, sendAddress, sendAmount, feeEstimate, sendError, actions}) => {
	const isValidNumber = (num) => {
		try {
			new BigNumber(sendAmount)
			return true
		} catch (e) {
			return false
		}
	}

	const isValidAddress = (addr) => {
		return addr && addr.length == 76
	}

	const handleSendAddressChange = (e) => {
		actions.setSendAddress(e.target.value)
	}

	const handleSendAmountChange = (e) => {
		actions.setSendAmount(e.target.value)
	}

	const handleSendClick = () => {
		if (!isValidNumber(sendAmount)) {
			actions.setSendError('invalid send amount')
			return false
		}

		if (!isValidAddress(sendAddress)) {
			actions.setSendError('invalid address')
			return false
		}

		actions.setSendError('')
		actions.sendCurrency(sendAddress, sendAmount, currencytype)
	}

	const getSendBtnActiveClass = () => {
		if (isValidAddress(sendAddress) && isValidNumber(sendAmount)) {
			return "active"
		}
		return ""
	}

	return (
		<div className="send-view">
			<div className="send-address">
				<label>To address</label>
				<input onChange={handleSendAddressChange} value={sendAddress} placeholder="e.g. 6022468945eb9d3eecfed9806fac7953884150a39ace5985dd7564695fc098723ad99e8907c3" />
			</div>

			<div className="send-amount">
				<label>Amount to send</label>
				<input onChange={handleSendAmountChange} value={sendAmount} placeholder="Amount of SEN" />
			</div>

			<div className="fee-estimate">
				Estimated fee: <b>{feeEstimate}</b>
			</div>
			<div className="send-error">{sendError}</div>
			<div className={"button send-button-container " + getSendBtnActiveClass()} onClick={handleSendClick}>
				<div className="send-button-icon"></div>
				<div className="send-button-label">Submit transaction</div>
			</div>
		</div>
	)
}
SendView.propTypes = {
	sendAddress: PropTypes.string.isRequired,
	sendError: PropTypes.string.isRequired,
	sendAmount: PropTypes.string.isRequired,
	currencytype: PropTypes.string.isRequired,
	feeEstimate: PropTypes.string.isRequired,
}

export default SendView
