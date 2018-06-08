import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'immutable'

const TransactionList = ({ transactions, ntransactions, actions, filter }) => {
	if (transactions.size === 0) {
		return (
			<div className="transaction-list-view">
				<div className="no-txns-message">No recent transactions</div>
			</div>
		)
	}

	const toCurrencyString = (amount) => {
		return amount.round(2).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
	}

	const toFormattedDate = (date) => {
		if (date == "Invalid Date") {
			return "pending"
		}
		return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	}

	const toFormattedTime = (date) => {
		if (date == "Invalid Date") {
			return "pending"
		}
		return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
	}

	const onClickLoadMore = () => {
		actions.showMoreTransactions()
	}

	const transactionComponents = transactions
		.take(ntransactions)
		.filter((txn) => {
			return txn.transactionsums.totalSen.abs().gt(0) || txn.transactionsums.totalMiner.abs().gt(0)
		})
		.map((txn, key) => {
			let amount = 0
			let isMiner = false
			if (txn.transactionsums.totalSen.abs().gt(0)) {
				amount = txn.transactionsums.totalSen
				isMiner = false
			} else if (txn.transactionsums.totalMiner.abs().gt(0)) {
				amount = txn.transactionsums.totalMiner
				isMiner = true
			}

			let directionClass = amount.gt(0) ? "direction-inbound" : "direction-outbound"
			let directionTooltipText = amount.gt(0) ? "In" : "Out"
			directionTooltipText += isMiner ? " (miner)" : ""

			let confirmedClass = txn.confirmed ? "confirmed" : "unconfirmed"
			let statusTooltipText = txn.confirmed ? "Confirmed" : "Pending"
			statusTooltipText += isMiner ? " (miner)" : ""

			let amountStr = toCurrencyString(amount)
			amountStr = amount.gt(0) ? "+" + amountStr : amountStr

			return (
				<div className="transaction-row" key={key}>
					<div className={"transaction-col col-direction " + directionClass} title={directionTooltipText}></div>
					<div className="transaction-col col-amount">{amountStr}</div>
					<div className="transaction-col col-txn-id small-text">{txn.transactionid}</div>
					<div className="transaction-col col-date">{toFormattedDate(txn.confirmationtimestamp)}</div>
					<div className="transaction-col col-time">{toFormattedTime(txn.confirmationtimestamp)}</div>
					<div className={"transaction-col col-status " + confirmedClass} title={statusTooltipText}></div>
				</div>
			)
		})

	return (
		<div className="transaction-list-view">
			<div className="transaction-row row-header">
				<div className="transaction-col col-direction"></div>
				<div className="transaction-col col-amount">Amount</div>
				<div className="transaction-col col-txn-id">Transaction ID</div>
				<div className="transaction-col col-date">Date</div>
				<div className="transaction-col col-time">Time</div>
				<div className="transaction-col col-status"><span>Status</span></div>
			</div>
			<div className="transaction-items">
				{transactionComponents}
				{transactions.size > ntransactions &&
					<div className="button show-more" onClick={onClickLoadMore}>
						<i className="fa fa-caret-down"></i>
						<span>Load more...</span>
					</div>
				}
			</div>
		</div>
	)

}



TransactionList.propTypes = {
	transactions: PropTypes.instanceOf(List).isRequired,
	ntransactions: PropTypes.number.isRequired,
	filter: PropTypes.bool.isRequired,
}

export default TransactionList
