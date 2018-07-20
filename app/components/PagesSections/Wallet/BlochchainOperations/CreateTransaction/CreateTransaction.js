import React, { Component } from 'react';
import PropTypes from 'prop-types';

import checkValidity from '../../../../../utils/validation';
import Spinner from '../../../../UI/Spinner/Spinner';
import Input from '../../../../UI/Input/Input';
import Button from '../../../../UI/Button/Button';

import commonCss from '../../../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss };

class CreateTransaction extends Component {
  state = {
    controls: {
      to: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Wallet number'
        },
        id: 'wallet-to',
        label: 'To',
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        errorMessage: undefined
      },
      amount: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          placeholder: 'Amount',
          min: '0',
          pattern: '[0-9]*',
          step: '0.0001'
        },
        value: '0',
        id: 'amount-to',
        label: '',
        validation: {
          required: true,
          isNumeric: true,
        },
        valid: false,
        touched: false,
        errorMessage: undefined
      }
    }
  };
  inputChangedHandler = (val, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: val,
        valid: checkValidity(
          val,
          this.state.controls[controlName].validation,
          controlName
        ).isValid,
        errorMessage: checkValidity(
          val,
          this.state.controls[controlName].validation,
          controlName
        ).errorMessage,
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  onSubmitForm = () => {
    this.props.handleSubmitTransaction(
      this.state.controls.to.value,
      this.state.controls.amount.value
    );
  };

  render() {
    // form
    const formElementsArray = [];
    // eslint-disable-next-line no-restricted-syntax,guard-for-in
    for (const key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = (
      <form
        onSubmit={e => { e.preventDefault(); this.onSubmitForm(); }}
      >
        {
          formElementsArray.map((formElement, index) => {
            const input = (
              <Input
                errorMessage={formElement.config.errorMessage}
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                id={formElement.config.id}
                label={formElement.config.label}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation.required}
                touched={formElement.config.touched}
                changed={val => this.inputChangedHandler(val, formElement.id)}
              />
            );
            if (formElementsArray.length === index + 1) {
              return (
                <div className={styles.flex} key={formElement.id}>
                  {input}
                  <Button
                    btnStyles={['marginSmLeft']}
                    disabled={
                      !this.state.controls.to.valid ||
                      !this.state.controls.amount.value > 0 ||
                      this.props.transactionLoading
                    }
                  >
                    Send
                  </Button>
                </div>
              );
            }
            return input;
          })
        }
      </form>
    );

    if (this.state.transactionLoading) { form = <Spinner />; }

    return (
      <div className={[styles.w100, styles.marginSmBottom, styles.flexColumn].join(' ')}>
        <h3 className={[styles.orangeHeader, styles.marginXsBottom].join(' ')}>
          My wallet and Transaction
        </h3>
        <div>
          {form}
        </div>
      </div>
    );
  }
}

CreateTransaction.propTypes = {
  handleSubmitTransaction: PropTypes.func.isRequired,
  transactionLoading: PropTypes.bool.isRequired
};

export default CreateTransaction;
