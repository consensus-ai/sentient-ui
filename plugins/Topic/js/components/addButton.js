import React from 'react'

const AddButton = ({ addOption }) => (
  <div className="button add-option active" onClick={addOption}>
    <div className="add-option-label">+ add option</div>
  </div>
)

export default AddButton
