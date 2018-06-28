import React from 'react'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import rootSaga from './sagas/index.js'
import { fetchData } from './actions/miner.js'
import MinerApp from './components/app.js'

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

  // return the miner plugin root component, a redux Provider wrapping the
  // root miner component
  return (
    <Provider store={store}>
      <MinerApp />
    </Provider>
  )
}

