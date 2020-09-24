import React from 'react'
import PropTypes from 'prop-types'
import { shell } from 'electron'

import Header from '../containers/header'

const UpgradeMessage = ({ status }) => {
  return (
    <div className="topic">
      <Header />
      <div className="topic-container">
        <div className="tabcontent">
          <div className="upgrade-list-view">
            <div className="upgrade-image"></div>
            <div className="upgrade-info">
              <div className="upgrade-info-row">Sentient Blockchain now uses a democratic method to accept or rejects new changes to the structure of blocks. The way this works is that each new block mined onto the blockchain has a "Supports" field that indicates the highest block version they accept.</div>
              <div className="upgrade-info-row">The change that we would like to propose is explained in depth in the following <span onClick={() => shell.openExternal('https://medium.com/consensus-ai/provably-anonymous-data-aggregation-on-the-blockchain-bfe68b7c79ce')}>medium article</span>. Once a sufficient number of users upgrade their code to the new binary, we will submit a Version Proposal to the network. The Version Proposal will indicate what fraction of the past votes support the new version before it passes. Once the Version Proposal is active, its details will appear below:</div>
              {status.exists ? (
                <div>
                  <b>Version Proposal</b><br/>
                  Version: {status.proposal.version}<br/>
                  Activation Window: {status.proposal.activationwindow}<br/>
                  Activation Threshold: {status.proposal.activationthreshold}<br/>
                  Timeout: {status.proposal.timeout}<br/>
                  Deadline: {status.proposal.version}<br/>
                  Status: {`Last Supporting Block: ${status.status.LastSupportingBlock}, Range Count: ${status.status.RangeCount}, State ID: ${status.status.StateID}`}
                </div>
              ) : (
                <div className="upgrade-info-row"><b>No Version Proposal Yet</b></div>
              ) }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

UpgradeMessage.propTypes = {
  status: PropTypes.object,
}

export default UpgradeMessage
