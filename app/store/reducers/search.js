import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utility';

const initialState = {
  searchText: ''
};

const actionStart = (state, action) => (updateObject(state, {
  searchText: action.searchText
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      case actionTypes.SET_SEARCH_WORD: return actionStart(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
