import { put, take, fork, call, join, race } from 'redux-saga/effects'
import { takeEvery, delay } from 'redux-saga'
import { sentientdCall, offchainCall } from './helpers.js'
import * as actions from '../actions/topic.js'
import * as constants from '../constants/topic.js'
import { remote } from 'electron'
const analytics = remote.getGlobal('analytics')

// Send an error notification.
const sendError = (e) => {
	SentientAPI.showError({
		title: 'Sentient Hub Wallet Error',
		content: typeof e.message !== 'undefined' ? e.message : e.toString(),
	})
}

// Topic plugin sagas
// Sagas are an elegant way of handling asynchronous side effects.
// All side effects logic is contained entirely in this file.
// See https://github.com/yelouafi/redux-saga to read more about redux-saga.

//  Call /wallet and dispatch the appropriate actions from the returned JSON.
function* getWalletBalanceSaga() {
	try {
    const wallet    = yield sentientdCall('/wallet')
    if (wallet.unlocked) {
      const confirmed = SentientAPI.hastingsToSen(wallet.confirmedsenbalance)

      const unconfirmedIncoming = SentientAPI.hastingsToSen(wallet.unconfirmedincomingsen)
      const unconfirmedOutgoing = SentientAPI.hastingsToSen(wallet.unconfirmedoutgoingsen)
      const unconfirmed = unconfirmedIncoming.minus(unconfirmedOutgoing)

      const unlocked  = wallet.unlocked
      const height    = wallet.height
      yield put(
        actions.setWalletBalance(confirmed.round(2).toString(),
        unlocked,
        unconfirmed.round(2).toString(),
        height,
      ))
    }
	} catch (e) {
		console.error('error fetching lock status: ' + e.toString())
	}
}

// Call /consensus/satus
function* getConsensusStatus() {
  try {
    const status = yield sentientdCall('/consensus/version')
    yield put(actions.setConsensusStatus(status))
  } catch (e) {
    console.error('error fetching consunsus status: ' + e.toString())
  }
}

// get topics by identity
function getTopicsBy(identity) {
  try {
    return sentientdCall(`/topic/list/${identity}`)
  } catch(e) {
    sendError(e)
    console.error('error fetching topics by identity: ' + e.toString())
  }
}

// get topics by ids
function fetchTopics(ids) {
  try {
    const ops = ids.map(id => offchainCall('/Topic', { topicId: id }))
    return Promise.all(ops)
  } catch(e) {
    sendError(e)
    console.error('error fetching topics by ids: ' + e.toString())
  }
}

async function fetchTopicsFor(identities, topicType) {
  let topics = []
  await Promise.all(identities.map(async (identity) => {
    const topicIds = await getTopicsBy(identity)
    if(topicIds[topicType]) {
      const fetched = await fetchTopics(topicIds[topicType])
      topics = [...topics, ...fetched]
    }
  }))
  return topics
}

//  Call /identity/list and dispatch the appropriate actions from the returned JSON.
function* getTopicsSaga({ topicType }) {
	try {
    const { identities } = yield sentientdCall('/identity/list')
    const topics = yield fetchTopicsFor(identities, topicType)
    yield put(actions.setTopics(topics))
	} catch (e) {
		console.error('error fetching identities: ' + e.toString())
	}
}

// call /topic/create api to create a new topic and return data
function* submitTopic({ metadata }) {
  analytics.event('App', 'create-topic', {p: '/topics'}).send()
  const { question, reward, duration, members } = metadata
  const categories = Object.keys(metadata).filter(key => /option\d+/.test(key)).map((filtered) => metadata[filtered])
  const parameters = JSON.stringify({
    groups: [SentientAPI.config.offchain_api.group],
    limit: 1,
  })
  const topicMetadata = {
    name: question,
    creator: "SentientHub",
    categories,
  }
	try {
    const { topicid: topicId, transactionid: transactionId, topic: { metadatahash }} = yield sentientdCall({
      url: '/topic/create',
      method: 'POST',
      timeout: 1.7e8, // two days
      body: {
        params: {
          rules: {
            ruletype: 2,
            parameters,
          },
          difficulty: "340282366920938463463374607431768211456",
          expiry: parseInt(duration),
          minaggregationsize: 8,
          maxaggregationsize: 256,
          numcategories: categories.length,
        },
        finances: {
          maxdatums: parseInt(members),
          datumcost: 0,
          mineddatumreward: 0,
          datumreward: SentientAPI.senToHastings(reward / members),
        },
        metadata: topicMetadata,
      }
    })
    yield offchainCall('/AddCustomTopic', {
      topicId,
      transactionId,
      groups: [SentientAPI.config.offchain_api.group],
      metadata: JSON.stringify(topicMetadata),
      metadataHash: metadatahash,
    })
    yield put(actions.topicSubmitted(topicId))
	} catch (e) {
    sendError(e)
		console.error('error posting the topic: ' + e.toString())
	}
}

// exported redux-saga action watchers
export function* dataFetcher() {
	while (true) {
		let tasks = []
		tasks = tasks.concat(yield fork(getWalletBalanceSaga))
		tasks = tasks.concat(yield fork(getConsensusStatus))
		yield join(...tasks)
		yield race({
			task: call(delay, 2000),
			cancel: take(constants.FETCH_DATA),
		})
	}
}

export function* watchTopicSubmit() {
	yield* takeEvery(constants.SUBMIT_TOPIC, submitTopic)
}

export function* getTopics() {
  yield* takeEvery(constants.GET_TOPICS, getTopicsSaga)
}
