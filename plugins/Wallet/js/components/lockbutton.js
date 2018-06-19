import PropTypes from 'prop-types'
import React from 'react'

const LockButton = ({isLocked, actions}) => {
  const onClick = () => {
    if (isLocked) {
      return false
    }

    actions.hideAllViews()
    actions.lockWallet()
  };

  let lockedClass
  let lockBtnTooltipText
  if (isLocked) {
    lockedClass = "locked"
    lockBtnTooltipText = "Unlock wallet"
  } else {
    lockedClass = "unlocked"
    lockBtnTooltipText = "Lock wallet"
  }

	return (
		<div className={"button lock-button " + lockedClass} onClick={onClick} title={lockBtnTooltipText}>
			<div className={"lock-button-icon " + lockedClass}></div>
		</div>
	)
}

LockButton.propTypes = {
  isLocked: PropTypes.bool.isRequired,
}

export default LockButton
