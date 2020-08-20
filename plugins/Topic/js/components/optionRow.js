import React from 'react'

const OptionRow = ({ index, onChange, removeOption }) => (
  <div className="option-wrapper">
    <label>Option {index + 1}</label>
    <input
      className="option-input"
      type="text"
      placeholder={`Answer option ${index + 1}`}
      name={`option${index}`}
      onChange={(e) => {onChange(e)}}
    />
    {index >= 2 && <span className="close-button" onClick={removeOption}>✖</span>}
  </div>
)

export default OptionRow
