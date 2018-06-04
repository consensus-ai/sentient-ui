import PropTypes from 'prop-types'
import React from 'react'

const LockButton = ({isLocked, actions}) => {
  const onClick = () => {
    actions.hideAllViews()
    actions.lockWallet()
  };

  let lockBtnClass = "lock-button"
  let lockBtnTooltipText
  if (isLocked) {
    lockBtnClass += " active"
    lockBtnTooltipText = "Unlock wallet"
  } else {
    lockBtnTooltipText = "Lock wallet"
  }

	return (
		<div className={lockBtnClass} onClick={onClick} title={lockBtnTooltipText}>
			<div className="lock-button-icon"></div>
		</div>
	)
}

LockButton.propTypes = {
  isLocked: PropTypes.bool.isRequired,
}

export default LockButton
