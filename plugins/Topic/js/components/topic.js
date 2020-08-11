import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// import LockedWallet from './lockedwallet'
// import UnlockedWallet from '../containers/unlockedwallet'

const Topic = ({ walletUnlocked, confirmedBalance }) => {
  const formattedConfirmedBalance = confirmedBalance.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')

  const [optionsCount, setOptionsCount] = useState(2)
  const [values, setValues] = useState({})

  const addOption = () => {
    setOptionsCount(optionsCount + 1)
  }

  const handleChanges = (e) => {
    const { name, value } = e.target
    console.log(name)
    console.log(value)
    setValues({ ...values, [name]: value })
  }

  const submit = () => {
    if (!isFormValid()) return
    console.log(values)
  }

  const isFormValid = () => {
    const { duration, question, reward } = values

    const optionsPresent = Array(optionsCount).fill('').map((_, index) => {
      let optionValue = values[`option${index}`]
      return optionValue && optionValue.length > 0
    }).filter((value) => value === true).length

    return optionsPresent && reward > 0 && duration > 0 && question.length > 0
  }

  return (
    <div className="topic">
      <div className="balance-info-container">
        <div className="balance-info">
          <div className="balance-info-icon balance-info-synced-icon"></div>
          <div className="balance-info-amount-container" title="0 SEN pending">
            <span className="balance-info-amount">{formattedConfirmedBalance}</span>
            <span className="balance-info-currency">SEN</span>
          </div>
        </div>
      </div>
      <div className="topic-container">
        <div className="new-topic-div">
          <h3>SOME COPY GOES HERE</h3>
          <div className="question-container">
            <label>Question</label>
            <input
              className="question-input"
              type="text"
              placeholder="Type your question here"
              name="question"
              onChange={(e) => {handleChanges(e)}}
              autoFocus
            />
          </div>
          <div className="option-container">
            { Array(optionsCount).fill('').map((_, index) => {
              return (<div key={index}>
                <label>Option {index + 1}</label>
                <input
                  className="question-input"
                  type="text"
                  placeholder={`Answer option ${index + 1}`}
                  name={`option${index}`}
                  onChange={(e) => {handleChanges(e)}}
                />
              </div>)
            })}
            <div className="button add-option active" onClick={addOption}>
              <div className="add-option-label">+ add option</div>
            </div>
          </div>
          <div className="topic-options">
            <div>
              <label>Duration</label>
              <input
                className="topic-duration"
                type="number"
                onChange={(e) => {handleChanges(e)}}
                step="1"
                placeholder="Days"
                name="duration" />
            </div>
            <div>
              <label>SEN reward</label>
              <input
                className="sen-reward"
                type="text"
                placeholder="SEN amount"
                onChange={(e) => {handleChanges(e)}}
                name="reward"
              />
            </div>
          </div>
          <div className={`button ${isFormValid() ? 'active' : ''} submit-topic`} onClick={submit}>
            <div className="submit-topic-icon"></div>
            <div className="submit-topic-label">Submit topic</div>
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
