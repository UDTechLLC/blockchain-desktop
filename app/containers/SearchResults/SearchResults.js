import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';

// import css from './Homepage.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss };

class SearchResults extends Component {
  render() {
    return (
      <div
        className={[
          styles.wh100,
          styles.paddingMd,
          styles.flexColumn
        ].join(' ')}
      >
        <h3 className={[styles.w100, styles.marginMdBottom, styles.flexAllCenter].join(' ')}>
          {`Searching "${this.props.searchText}"`}
        </h3>
        <div
          className={[
            styles.wh100,
            styles.flex,
            styles.justifyBetween
          ].join(' ')}
        >
          {
            Object.keys(this.props.filteredObject).map(k => (
              <div key={uuidv4()}>
                <h2>{k}</h2>
                <ul>
                  {
                    Object.keys(this.props.filteredObject[k]).map(key => (
                      <li key={uuidv4()}>
                        {this.props.filteredObject[k][key].name}
                      </li>
                    ))
                  }
                </ul>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

SearchResults.propTypes = {
  searchText: PropTypes.string,
  filteredObject: PropTypes.shape({})
};

SearchResults.defaultProps = {
  searchText: undefined,
  filteredObject: {}
};

const mapStateToProps = state => ({
  searchText: state.search.searchText,
  filteredObject: state.search.filteredObject
});

export default connect(mapStateToProps)(SearchResults);
