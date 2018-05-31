import React from 'react'

const SendButton = ({actions}) => {
  const onClick = () => actions.startSendPrompt()
  return (
    <div className="wallet-button send-button" onClick={onClick}>
      <div className="send-button-icon"></div>
      <span>Send</span>
    </div>
  )
}

SendButton.propTypes = {
}

export default SendButton
