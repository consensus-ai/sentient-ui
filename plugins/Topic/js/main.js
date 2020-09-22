import React from 'react'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import rootSaga from './sagas/index.js'
import TopicApp from './components/app.js'

// initTopic initializes a new topic plugin and returns the root react
// component for the plugin.
export const initTopic = () => {
  // initialize the redux store
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
  )
  sagaMiddleware.run(rootSaga)

  // update state when plugin is focused
  window.onfocus = () => {
  }

  // return the topic plugin root component, a redux Provider wrapping the
  // root topic component
  return (
    <Provider store={store}>
      <TopicApp />
    </Provider>
  )
}

