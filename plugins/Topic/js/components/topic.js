import PropTypes from 'prop-types'
import React from 'react'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// import LockedWallet from './lockedwallet'
// import UnlockedWallet from '../containers/unlockedwallet'

const Topic = ({ walletUnlocked, confirmedBalance }) => {
  const formattedConfirmedBalance = confirmedBalance.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')

  return (
    <div className="miner">
      <div className="balance-info-container">
          <div className="balance-info">
              <div className="balance-info-icon balance-info-synced-icon"></div>
              <div className="balance-info-amount-container" title="0 SEN pending">
                  <span className="balance-info-amount">{formattedConfirmedBalance}</span>
                  <span className="balance-info-currency">SEN</span>
              </div>
          </div>
      </div>

      <ToastContainer
          className='sen-toast-container'
          toastClassName='sen-toast'
          bodyClassName='sen-toast-body'
          closeButtonClassName='sen-toast-close-button'
          progressClassName='sen-toast-progress'
          transition={Zoom}
          position='top-center'
      />
    </div>
  )
}

Topic.propTypes = {
  confirmedBalance: PropTypes.string.isRequired,
  walletUnlocked: PropTypes.bool.isRequired,
}

export default Topic
