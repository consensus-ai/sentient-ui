import * as constants from '../constants/topic.js'

export const getTopics = (topicType) => ({
  type: constants.GET_TOPICS,
  topicType,
})

export const setTopics = (topics) => ({
  type: constants.SET_TOPICS,
  topics,
})

export const setConsensusStatus = (status) => ({
  type: constants.SET_CONSENSUS_STATUS,
  status,
})

export const changeTopicType = (topicType) => ({
  type: constants.CHANGE_TOPIC_TYPE,
  topicType,
})

export const setWalletBalance = (confirmedBalance, walletUnlocked, unconfirmedBalance, height) => ({
  type: constants.SET_WALLET_BALANCE,
  confirmedBalance,
  walletUnlocked,
  unconfirmedBalance,
  height,
})

export const topicSubmitted = (topicId) => ({
  type: constants.TOPIC_SUBMITTED,
  topicId,
})

export const submitTopic = (metadata) => ({
  type: constants.SUBMIT_TOPIC,
  metadata,
})
