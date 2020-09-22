import React from 'react'
import Topic from '../containers/topic.js'
import UpgradeMessage from '../containers/upgradeMessage.js'

export default () => (
  <div className="app">
    { true && <UpgradeMessage /> }
    { false && <Topic /> }
  </div>
)
