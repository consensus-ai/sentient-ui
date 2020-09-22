import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Header from '../containers/header'
import NewTopicForm from '../containers/newTopicForm'
import TopicCards from '../containers/TopicCards'

const Topic = ({ topicId, topicType, actions }) => {
  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(()=> {
    actions.getTopics(topicType)
  }, [topicType])

  useEffect(()=> {
    setShowNewForm(false)
    actions.getTopics('opentopicids')
  }, [topicId])

  const cahgeTopicsToDispay = (type) => {
    setShowNewForm(false)
    actions.changeTopicType(type)
  }

  return (
    <div className="topic">
      <Header />
      <div className="topic-container">
        <div className="tab">
          <div>
            <button
              className="tablinks new"
              onClick={() => setShowNewForm(true)}
            >
              New topic
            </button>
          </div>
          <div>
            <button
              className={`tablinks radius ${topicType === 'opentopicids' && !showNewForm ? 'active' : ''}`}
              onClick={() => cahgeTopicsToDispay('opentopicids')}
            >
              Current topics
            </button>
            <button
              className={`tablinks radius ${topicType === 'closedtopicids' && !showNewForm ? 'active' : ''}`}
              onClick={() => cahgeTopicsToDispay('closedtopicids')}
            >
              Past topics
            </button>
          </div>
        </div>
        <div className="tabcontent">
          <div className="topic-list-view">
            {showNewForm ? (
              <NewTopicForm />
            ): (
              <TopicCards />
            )}
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
  topicId: PropTypes.string.isRequired,
}

export default Topic
