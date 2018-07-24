/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

import * as actionTypes from './actionTypes';

export const setSearchText = (searchText = '', searchObj) => {
  const filteredObject = _.mapValues(searchObj, o => (
    _.pickBy(o, v => v.name && v.name.indexOf(searchText) >= 0) || {}
  ));
  return {
    type: actionTypes.SET_SEARCH_TEXT,
    searchText,
    filteredObject
  };
};
