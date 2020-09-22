import React, { useState } from 'react'
import { toast } from 'react-toastify'

import AddButton from './addButton'
import OptionRow from './optionRow'

const NewTopicForm = ({ walletUnlocked, actions }) => {
  const [optionsCount, setOptionsCount] = useState(2)
  const [values, setValues] = useState({ reward: 0, members: 0, duration: 0 })

  const addOption = () => setOptionsCount(optionsCount + 1)
  const removeOption = index => {
    delete values[`option${index}`]
    setValues({ values })
    setOptionsCount(optionsCount - 1)
  }

  const walletLocked = () => {
    toast.error("Wallet is locked. You must unlock it before creating topic", { autoClose: 7000 })
  }
  const handleChanges = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const submit = () => {
    if (!walletUnlocked) {
      walletLocked()
      return
    }
    if (!isFormValid()) return
    actions.submitTopic(values)
    toast.success("Topic has been created. It will be available soon...")
  }

  const isFormValid = () => {
    const { duration, question, reward } = values

    const optionsPresent = Array(optionsCount).fill('').map((_, index) => {
      const optionValue = values[`option${index}`]
      return optionValue && optionValue.length > 0
    }).filter((value) => value === true).length

    return optionsPresent && reward > 0 && duration >= 144 && question.length > 0
  }

  return (
    <div className="new-topic-div">
      <div className="topic-content">
        <div className="topic-body">
          <div className="question-container">
            <div className="question-container">
              <label>Question</label>
              <textarea
                className="question-input"
                rows="3"
                placeholder="Type your question here"
                name="question"
                onChange={(e) => { handleChanges(e) }}
                autoFocus
              />
            </div>
            <div className="option-container">
              { Array(optionsCount).fill('').map((_, index) => (
                <OptionRow
                  key={index}
                  index={index}
                  onChange={handleChanges}
                  removeOption={() => removeOption(index)}
                />
              ))}
              <AddButton addOption={addOption} />
            </div>
          </div>
        </div>
        <div className="topic-options">
          <div>
            <label>SEN reward</label>
            <input
              className="sen-reward"
              type="number"
              placeholder="SEN amount"
              step={1}
              min={0}
              name="reward"
              onChange={(e) => { handleChanges(e) }}
            />
          </div>
          <div>
            <label>Max members <i>(min 8)</i></label>
            <input
              className="sen-reward"
              type="number"
              step={1}
              min={8}
              placeholder="Count of members"
              name="members"
              onChange={(e) => { handleChanges(e) }}
            />
          </div>
          <Revard reward={values.reward} members={values.members} />
          <div className="topic-duration-container">
            <label>Duration <i>(min 144)</i></label>
            <input
              className="topic-duration"
              type="number"
              step={1}
              min={144}
              placeholder="Blocks"
              name="duration"
              onChange={(e) => { handleChanges(e) }}
            />
          </div>
        </div>
      </div>
      <div className={`button ${isFormValid() ? 'active' : ''} submit-topic`} onClick={submit}>
        <div className="submit-topic-icon"></div>
        <div className="submit-topic-label">Submit topic</div>
      </div>
    </div>
  )
}

const Revard = ({ reward, members }) => (
  <div>
    <label>Reward for each: <strong>{reward > 0 && members > 0 ? parseFloat(reward / members).toFixed(2) : 0} SEN</strong></label>
  </div>
)

export default NewTopicForm
