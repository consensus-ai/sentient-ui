import React from 'react'

const Header = ({ confirmedBalance, unconfirmedBalance }) => {
  const formattedConfirmedBalance = confirmedBalance.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  const formattedUnconfirmedBalance = unconfirmedBalance.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')

  return (
    <div className="balance-info-container">
      <div className="balance-info">
        <div className="balance-info-icon balance-info-synced-icon"></div>
        <div className="balance-info-amount-container" title={`${formattedUnconfirmedBalance} SEN pending`}>
          <span className="balance-info-amount">{formattedConfirmedBalance}</span>
          <span className="balance-info-currency">SEN</span>
        </div>
      </div>
    </div>
  )
}

export default Header
