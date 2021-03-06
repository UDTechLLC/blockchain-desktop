/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createHashHistory } from 'history';
import thunk from 'redux-thunk';

import authReducer from './store/reducers/auth';
import commonInfoReducer from './store/reducers/commonInfo';
import blockchainReducer from './store/reducers/blockchain';
import digestReducer from './store/reducers/digest';
import notesReducer from './store/reducers/notes';

import './reset.css';
import './app.global.css';
import App from './App';

const history = createHashHistory();

const rootReducer = combineReducers({
  auth: authReducer,
  commonInfo: commonInfoReducer,
  blockchain: blockchainReducer,
  digest: digestReducer,
  notes: notesReducer
});

let composeEnhancers = null || compose;
if (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
