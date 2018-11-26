import React from 'react'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import rootSaga from './sagas/index.js'
import { fetchData, setHashRate } from './actions/miner.js'
import MinerApp from './components/app.js'
import zeromq from 'zeromq'

// initMiner initializes a new miner plugin and returns the root react
// component for the plugin.
export const initMiner = () => {
  // initialize the redux store
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
  )
  sagaMiddleware.run(rootSaga)

  // update state when plugin is focused
  window.onfocus = () => {
    store.dispatch(fetchData())
  }

  //connect to socket to get hashrate
  const socket = zeromq.socket('sub')
  socket.connect('tcp://127.0.0.1:5555');
  socket.subscribe('');

  socket.on('message', function(message) {
    store.dispatch(setHashRate(message.toString()))
  });

  // return the miner plugin root component, a redux Provider wrapping the
  // root miner component
  return (
    <Provider store={store}>
      <MinerApp />
    </Provider>
  )
}

