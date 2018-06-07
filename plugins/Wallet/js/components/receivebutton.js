import PropTypes from 'prop-types'
import React from 'react'

const ReceiveButton = ({isActive, isLocked, actions}) => {
	const onClick = () => {
    if (!isLocked) {
      actions.hideAllViews()
      actions.showReceiveView()
    }
  };

  let walletBtnClass = "button wallet-button receive-button"
  if (isLocked) {
    walletBtnClass += " disabled"
  } else if (isActive) {
    walletBtnClass += " active"
  }

	return (
		<div className={walletBtnClass} onClick={onClick}>
			<div className="receive-button-icon"></div>
			<span>Addresses</span>
		</div>
	)
}

ReceiveButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isLocked: PropTypes.bool.isRequired,
}


export default ReceiveButton
