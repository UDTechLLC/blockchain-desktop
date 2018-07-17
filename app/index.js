/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createHashHistory } from 'history';
import thunk from 'redux-thunk';

import common from './store/reducers/common';
import auth from './store/reducers/auth';
import raft from './store/reducers/raft';
import blockchain from './store/reducers/blockchain';
import digest from './store/reducers/digest';
import search from './store/reducers/search';

import './app.global.css';
import App from './App';

const history = createHashHistory();

const rootReducer = combineReducers({
  common,
  auth,
  raft,
  blockchain,
  digest,
  search
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
