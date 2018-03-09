import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import checkValidity from '../../../utils/validation';

class Registration extends Component {
  state = {
    controls: {
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password'
        },
        label: 'Password',
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false,
        errorMessage: 'Password field is empty'
      },
      repeatPassword: {
        elementType: 'password',
        elementConfig: {
          type: 'text'
        },
        label: 'Repeat Password',
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false,
        errorMessage: 'Repeat Password field is empty'
      }
    }
  };
  handleInputChange = (event, controlName) => {
    // eslint-disable-next-line max-len
    const cV = checkValidity(event.target.value, this.state.controls[controlName].validation, controlName);
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: cV.isValid,
        errorMessage: cV.errorMessage,
        touched: true
      }
    };
    this.setState({
      controls: updatedControls
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    //  check standart validation
    const cV0 = checkValidity(this.state.controls.password.value, this.state.controls.password.validation, 'password');
    const cV1 = checkValidity(this.state.controls.repeatPassword.value, this.state.controls.repeatPassword.validation, 'repeatPassword');
    //  check if there is valid password and it match
    if (this.state.controls.password.value && this.state.controls.repeatPassword.value
      && cV0.isValid && cV1.isValid
      && this.state.controls.password.value === this.state.controls.repeatPassword.value) {
      //  update state to valid
      const updatedControls = {
        ...this.state.controls,
        password: {
          ...this.state.controls.password,
          valid: true,
          errorMessage: null
        },
        repeatPassword: {
          ...this.state.controls.repeatPassword,
          valid: true,
          errorMessage: null
        }
      };
      this.setState({
        controls: updatedControls
      });
      //  and register
      this.props.cachePassword(this.state.controls.password.value);
      this.props.handleRegister(this.state.controls.password.value);
    } else {
      //  if password doesnt match
      let notMatch;
      if (this.state.controls.password.value && this.state.controls.repeatPassword.value
        && this.state.controls.password.value !== this.state.controls.repeatPassword.value) {
        notMatch = 'Passwords doesn\'t match';
      }
      const updatedControls = {
        ...this.state.controls,
        password: {
          ...this.state.controls.password,
          valid: false,
          errorMessage: !notMatch ? this.state.controls.password.errorMessage : notMatch,
          touched: true
        },
        repeatPassword: {
          ...this.state.controls.repeatPassword,
          valid: false,
          errorMessage: !notMatch ? this.state.controls.repeatPassword.errorMessage : notMatch,
          touched: true
        }
      };
      //  show the message
      this.setState({
        controls: updatedControls
      });
    }
  };
  render() {
    return (
      <div>
        <h1>New wallet registration</h1>
        <div>
          <form onSubmit={e => this.handleSubmit(e)}>
            {
              Object.keys(this.state.controls).map(key => (
                <Input
                  key={key}
                  id={key}
                  value={this.state.controls[key].value}
                  elementType={this.state.controls[key].elementType}
                  elementConfig={this.state.controls[key].elementConfig}
                  label={this.state.controls[key].label}
                  changed={event => this.handleInputChange(event, key)}
                  errorMessage={this.state.controls[key].errorMessage}
                  invalid={!this.state.controls[key].valid}
                  shouldValidate={this.state.controls[key].validation.required}
                  touched={this.state.controls[key].touched}
                />
              ))
            }
            <Button>Generate</Button>
          </form>
        </div>
        <div>
          {
            this.props.userData.csk
              ?
              (
                <div>
                  <p>csk: {this.props.userData.csk}</p>
                  <p>cpk: {this.props.userData.cpk}</p>
                  <p>address: {this.props.userData.address}</p>
                </div>
              )
              : null
          }
        </div>
      </div>
    );
  }
}

Registration.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string,
    cpk: PropTypes.string,
    address: PropTypes.string
  }),
  handleRegister: PropTypes.func.isRequired,
  cachePassword: PropTypes.func.isRequired
};

Registration.defaultProps = {
  userData: {
    csk: null,
    cpk: null,
    address: null
  }
};

export default Registration;
