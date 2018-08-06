import React from 'react';
import PropTypes from 'prop-types';

import classes from './Register.css';
import { fileImg } from '../../../../assets/img/img';

const register = props => (
  <div className={classes.Registration}>
    <div className={classes.Content}>
      <h1>2SDS ACCESS POINT</h1>
      <h2>Powered by 2SDS Blockchain</h2>
      <div className={classes.Inputs}>
        <input
          type="password"
          tabIndex={-1}
          value={props.password}
          placeholder="enter password"
        />
        <input
          type="password"
          tabIndex={-1}
          value={props.repeatPassword}
          placeholder="repeat password"
        />
      </div>
      <div className={classes.FileLine}>
        <img src={fileImg} alt="file-img" />
        <div>
          <div>
            <p>private key</p>
          </div>
          <div>
            <h2>DOWNLOAD YOUR PRIVATE KEY</h2>
          </div>
          <div>
            <p>only access to administrator</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

register.propTypes = {
  password: PropTypes.string,
  repeatPassword: PropTypes.string
};

register.defaultProps = {
  password: '',
  repeatPassword: ''
};

export default register;

