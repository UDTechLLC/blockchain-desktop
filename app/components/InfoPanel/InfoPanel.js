import React from 'react';
import PropTypes from 'prop-types';

import classes from './InfoPanel.css';

import InfoPanelWrapper from '../UI/InfoPanelWrapper/InfoPanelWrapper';
import ProgressBar from './ProgressBar/ProgressBar';
import NavMenu from './NavMenu/NavMenu';
import Data from './Data/Data';
import Graph from './Graph/Graph';
import Data2 from './Data2/Data2';
import Statistic from './Statistic/Statistic';
import SecurityLayer from './SecurityLayer/SecurityLayer';
import NewBlock from './NewBlock/NewBlock';
import CreateFolder from './CreateFolder/CreateFolder';
import NodesMenu from './NodesMenu/NodesMenu';
import Manipulation from './Manipulation/Manipulation';

const infoPanel = props => {
  const getBlock = name => {
    let block;
    switch (name) {
      case 'ProgressBar': block = <ProgressBar key={Math.random()} />; break;
      case 'NavMenu': block = <NavMenu key={Math.random()} />; break;
      case 'Data': block = <Data key={Math.random()} />; break;
      case 'Graph': block = <Graph key={Math.random()} />; break;
      case 'Data2': block = <Data2 key={Math.random()} />; break;
      case 'Statistic': block = <Statistic key={Math.random()} />; break;
      case 'SecurityLayer': block = <SecurityLayer key={Math.random()} />; break;
      case 'NewBlock': block = <NewBlock key={Math.random()} />; break;
      case 'CreateFolder': block = <CreateFolder key={Math.random()} />; break;
      case 'NodesMenu': block = <NodesMenu key={Math.random()} />; break;
      case 'Manipulation':
        block = (
          <Manipulation
            key={Math.random()}
            handleDownloadFile={() => props.handleDownloadFile()}
            handleRemoveFile={() => props.handleRemoveFile()}
          />
        );
        break;
      default:
        block = (
          <div key={Math.random()}>
            Placeholder
          </div>
        );
        return;
    }
    return block;
  };
  const leftColumn = (
    <div className={classes.LeftColumn}>
      {props.leftColumn.map(block => getBlock(block))}
    </div>
  );
  const rightColumn = (
    <div className={classes.RightColumn}>
      {props.rightColumn.map(block => getBlock(block))}
    </div>
  );
  return (
    <div className={classes.InfoPanel}>
      <InfoPanelWrapper
        action={() => props.handleTogglePanel()}
        hide={props.hide}
      >
        <div className={classes.InnerWrapper}>
          {leftColumn}
          {rightColumn}
        </div>
      </InfoPanelWrapper>
    </div>
  );
};

infoPanel.propTypes = {
  leftColumn: PropTypes.arrayOf(PropTypes.string),
  rightColumn: PropTypes.arrayOf(PropTypes.string),
  handleTogglePanel: PropTypes.func.isRequired,
  hide: PropTypes.bool,
  handleDownloadFile: PropTypes.func,
  handleRemoveFile: PropTypes.func
};

infoPanel.defaultProps = {
  hide: false,
  leftColumn: [
    'CreateFolder',
    'NodesMenu'
  ],
  rightColumn: [
    'SecurityLayer',
    'Manipulation'
  ],
  handleDownloadFile: null,
  handleRemoveFile: null
};

export default infoPanel;