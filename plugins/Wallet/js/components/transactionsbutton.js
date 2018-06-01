import PropTypes from 'prop-types'
import React from 'react'

const TransactionsButton = ({isActive, isLocked, actions}) => {
  const onClick = () => {
    if (!isLocked) {
      actions.hideAllViews()
      actions.showTransactionListView()
    }
  };

  let walletBtnClass = "wallet-button transactions-button"
  if (isLocked) {
    walletBtnClass += " disabled"
  } else if (isActive) {
    walletBtnClass += " active"
  }

  return (
    <div className={walletBtnClass} onClick={onClick}>
      <div className="transactions-button-icon"></div>
      <span>Transactions</span>
    </div>
  )
}

TransactionsButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isLocked: PropTypes.bool.isRequired,
}

export default TransactionsButton
