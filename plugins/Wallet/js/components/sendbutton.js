import PropTypes from 'prop-types'
import React from 'react'

const SendButton = ({isActive, isLocked, actions}) => {
  const onClick = () => {
    if (!isLocked) {
      actions.hideAllViews()
      actions.showSendView()
    }
  };

  let walletBtnClass = "button wallet-button send-button"
  if (isLocked) {
    walletBtnClass += " disabled"
  } else if (isActive) {
    walletBtnClass += " active"
  }

  return (
    <div className={walletBtnClass} onClick={onClick}>
      <div className="send-button-icon"></div>
      <span>Send</span>
    </div>
  )
}

SendButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isLocked: PropTypes.bool.isRequired,
}

export default SendButton
