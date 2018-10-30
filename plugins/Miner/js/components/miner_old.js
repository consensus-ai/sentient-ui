import PropTypes from 'prop-types'
import React from 'react'

import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Miner = ({walletLocked, miningStatus, actions }) => {
  const getHashRateForDisplay = () => {
    if (!miningStatus.cpumining) {
      return "0 KH/s"
    }
    return (miningStatus.cpuhashrate / 1000).toFixed(2) + " KH/s"
  }

  const miningActionOnClick = (e) => {
    if (miningStatus.cpumining) {
      actions.stopMiner()
    } else {
      actions.startMiner()
    }
  }

  return (
    <div className="miner">
      <div className="content">
        { walletLocked &&
          <div className="locked-status-container">
            <i className="fa fa-exclamation-triangle"></i>
            <span>Wallet is locked. You must unlock it before mining.</span>
          </div>
        }

        { !walletLocked &&
          <div className="wallet-controls-container">
            <div className="row blocks-mined-container">
              <div className="col col-1 label blocks-mined-label">Blocks Mined:</div>
              <div className="col col-2 value blocks-mined-value">{miningStatus.blocksmined}</div>
            </div>
            <div className="row stale-blocks-container">
              <div className="col col-1 label stale-blocks-label">Stale Blocks Mined:</div>
              <div className="col col-2 value stale-blocks-value">{miningStatus.staleblocksmined}</div>
            </div>

            <div className="divider"></div>

            <div className="row miner-status-container">
              <div className="col col-1 label miner-status-label">CPU Mining:</div>
              <div className={"col col-2 value miner-status-value " + (miningStatus.cpumining ? "enabled" : "disabled")}>
                {miningStatus.cpumining ? "ON" : "OFF"}
              </div>
            </div>

            <div className="row hash-rate-container">
              <div className="col col-1 label hash-rate-label">CPU Hash Rate:</div>
              <div className="col col-2 value hash-rate-value">{getHashRateForDisplay()}</div>
            </div>

            <div className={"button mining-action-button " + (miningStatus.cpumining ? "stop" : "start")} onClick={miningActionOnClick}>
              {miningStatus.cpumining ? "Stop CPU Miner" : "Start CPU Miner"}
            </div>
          </div>
        }
      </div>
    </div>
  )
}

Miner.propTypes = {
  walletLocked: PropTypes.bool.isRequired,
  miningStatus: PropTypes.object.isRequired,
}

export default Miner
