import { combineReducers } from 'redux';

import common from './common';
import auth from './auth';
import raft from './raft';
import blockchain from './blockchain';
import digest from './digest';
import search from './search';

export default combineReducers({
  common,
  auth,
  raft,
  blockchain,
  digest,
  search
});
