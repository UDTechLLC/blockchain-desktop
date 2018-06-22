/* eslint-disable import/prefer-default-export */
import * as actionTypes from './actionTypes';

export const setSearchWord = searchText => ({
  type: actionTypes.SET_SEARCH_WORD,
  searchText
});
