import React from 'react';
import PropTypes from 'prop-types';

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
// import NoteManipulation from './NoteManipulation/NoteManipulation';

import css from './InfoPanel.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

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
            disableManipulationButtons={props.disableManipulationButtons}
            showRemoveButton={props.showRemoveButton}
            toggleShowRemoveButton={() => props.toggleShowRemoveButton()}
            onTopManipulationButtonClick={() => props.onTopManipulationButtonClick()}
            onBottomManipulationButtonClick={() => props.onBottomManipulationButtonClick()}
            manipulationFirstButtonText={props.manipulationFirstButtonText}
            timepickerDate={props.timepickerDate}
            onTimepickerChange={date => props.onTimepickerChange(date)}
            onTimebombSet={() => props.onTimebombSet()}
          />
        );
        break;
      // case 'NoteManipulation':
      //   block = (
      //     <NoteManipulation
      //       key={Math.random()}
      //       disableManipulationButtons={props.disableManipulationButtons}
      //       handleEditNote={() => props.handleEditNote()}
      //       handleRemoveNote={() => props.handleRemoveNote()}
      //       showRemoveButton={props.showRemoveButton}
      //       toggleShowRemoveButton={() => props.toggleShowRemoveButton()}
      //     />
      //   );
      //   break;
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
  const content = (
    <div
      className={[
        styles.wh100,
        styles.flexBetweenCenter,
        styles.Content
      ].join(' ')}
    >
      {props.columns.map(block => getBlock(block))}
    </div>
  );
  return (
    <div className={styles.InfoPanel}>
      <InfoPanelWrapper
        action={() => props.handleTogglePanel()}
        hide={props.hide}
      >
        <div className={styles.InnerWrapper}>
          {content}
        </div>
      </InfoPanelWrapper>
    </div>
  );
};

infoPanel.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string),
  handleTogglePanel: PropTypes.func.isRequired,
  hide: PropTypes.bool,
  //  manipulation section
  //  buttons
  disableManipulationButtons: PropTypes.bool,
  showRemoveButton: PropTypes.bool,
  toggleShowRemoveButton: PropTypes.func,
  onTopManipulationButtonClick: PropTypes.func,
  onBottomManipulationButtonClick: PropTypes.func,
  manipulationFirstButtonText: PropTypes.string,
  //  timebomb
  timepickerDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onTimepickerChange: PropTypes.func,
  onTimebombSet: PropTypes.func
};

infoPanel.defaultProps = {
  hide: false,
  columns: [
    'SecurityLayer',
    'Manipulation'
  ],
  disableManipulationButtons: false,
  showRemoveButton: false,
  toggleShowRemoveButton: null,
  onTopManipulationButtonClick: null,
  onBottomManipulationButtonClick: null,
  manipulationFirstButtonText: 'download',
  timepickerDate: new Date(),
  onTimepickerChange: null,
  onTimebombSet: null
};

export default infoPanel;
