/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { createHashHistory } from 'history';
import thunk from 'redux-thunk';

import './app.global.css';
import App from './App';
import rootReducer from './store/reducers';

const history = createHashHistory();

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
