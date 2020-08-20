import React from 'react'

const TopicCards = ({ topics, height }) => {
  return (
    <React.Fragment>
      {topics.map(({ topicId, metadata, topic, status }) => {
        const { name, categories } = metadata
        const { finances: { datumreward }, parameters: { expiry }} = topic
        const { tally, aggregateddatums, submitteddatums, expired } = status
        const reward = SentientAPI.hastingsToSen(datumreward)

        return (
          <div key={topicId}>
            <div className="topic-card">
              <div className="topic-id"><b>Topic ID</b>{topicId}</div>
              <div className="topic-title">{name}</div>
              <div className="options-wrapper">
                {categories.map((category, index) => (
                  <div key={`${topicId}_${index}`} className="option-row">
                    <div>{category}</div>
                    <span className="option-value">{tally[index]}</span>
                  </div>
                ))}
              </div>
              <div className="topic-info">
                <div>
                  <div>Submitted votes: {submitteddatums}</div>
                  <div>Counted votes: {aggregateddatums}</div>
                </div>
                <div>
                  <div>Reward: {reward.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} SEN</div>
                  <div>
                    {expired
                      ? `Expired ${height - expiry} blocks ago`
                      : `Expires in ${expiry - height} blocks`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </React.Fragment>
  )
}

export default TopicCards
