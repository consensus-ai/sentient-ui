import PropTypes from 'prop-types'
import React from 'react'

const LockButton = ({isActive, actions}) => {
  const onClick = () => {
    actions.hideAllViews()
    actions.lockWallet()
  };

  let lockBtnClass = "lock-button"
  if (isActive) {
    lockBtnClass += " active"
  }

	return (
		<div className={lockBtnClass} onClick={onClick}>
			<div className="lock-button-icon"></div>
		</div>
	)
}

LockButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
}

export default LockButton
