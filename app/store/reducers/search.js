import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/utils';

const initialState = {
  searchText: undefined,
  filteredObject: {}
};

const actionStart = (state, action) => (updateObject(state, {
  searchText: action.searchText,
  filteredObject: action.filteredObject
}));

const reducer = (state = initialState, action) => {
  if (action) {
    switch (action.type) {
      case actionTypes.SET_SEARCH_TEXT: return actionStart(state, action);
      default: return state;
    }
  }

  return state;
};

export default reducer;
