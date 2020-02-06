import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  TextField,
  MenuItem
} from '@material-ui/core';
import { validate, validators }  from 'validate.js';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import {
  formatIncompletePhoneNumber,
  parsePhoneNumberFromString,
  parseNumber,
  formatNumber,
  isValidNumber,
  getNumberType,
  isPossibleNumber,
  getExampleNumber,
  AsYouType
} from 'libphonenumber-js/custom';
import metadata from 'libphonenumber-js/metadata.full.json';
import examples from 'libphonenumber-js/examples.mobile.json'
import en from 'react-phone-number-input/locale/en.json'


const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(2),
    minWidth: 150,
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
}));

const renderOptions = () => {
  return getCountries().map((country) => {
    return (
      <MenuItem
        key={country}
        label={country}
        name={country}
        value={country}
      >
        {en[country]}
        {' '}
          + 
        {getCountryCallingCode(country)}
      </MenuItem>
    );
  });
};


const CellPhoneInput = props => {
  const { handleChange,
    nameFormCountry,
    nameFormCell,
    value,
    valueCountryCell,
    label,
    labelCountry,
    t
  } = props;
  const classes = useStyles();

  const [formState2, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    trad: {
      [nameFormCell]: {
        cust: 'some options',
        presence: { allowEmpty: false, message: t('IS_REQUIRED') },
        length: {
          maximum: 20
        }
      },
      [nameFormCountry]: {
        type: 'string',
        presence: { allowEmpty: false, message: t('IS_REQUIRED') },
      },
    }
  });
  
  useEffect(() => {
    const errors = validate(formState2.values, formState2.trad);
    const helper = getExampleNumber(formState2.values[nameFormCountry], examples, metadata);

    setFormState(formState2 => ({
      ...formState2,
      isValid: errors ? false : true,
      errors: errors || {},
      //helperMessage: helper ? helper : null,

    }));
  }, [formState2.values, formState2.trad]);
  
  
  
  const handleChange2 = event => {    event.persist();
    if(event.target.name === nameFormCell) {
      event.target.value = formatIncompletePhoneNumber(event.target.value, formState2.values[nameFormCountry], metadata);
    }
  
    setFormState(formState2 => ({
      ...formState2,
      values: {
        ...formState2.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState2.touched,
        [event.target.name]: true
      },
      helperMessage: {
        ...formState2.helperMessage,
        [event.target.name]: getExampleNumber(formState2.values[nameFormCountry], examples, metadata)
      }
    }));

    props.handleChange(event);
  };

  
  const helperMessage = field =>
    formState2.helperMessage[field].nationalNumber;

  const hasHelperMessage = field =>
    formState2.touched[field] && formState2.helperMessage[field] ? true : false;

  const hasError = field =>
    formState2.touched[field] && formState2.errors[field] ? true : false;

  let maxLengthCellPhone = null;
  let maxLengthCellPhoneSize = null;

  validators.cust = (value, options, key, attributes) => {

    const asYouType = new AsYouType(formState2.values[nameFormCountry], metadata);
    asYouType.input(value);
    if(value) {
    
      maxLengthCellPhone = asYouType.template;
      maxLengthCellPhone = maxLengthCellPhone ? maxLengthCellPhone.size : undefined;
        
      const numb = asYouType.getNumber();
      const phoneNumber = numb.number ? parsePhoneNumberFromString(numb.number, metadata) : null;
    
      if(isValidNumber(numb.number, metadata) 
          && isPossibleNumber(numb.number, metadata) 
            && getNumberType(numb.number, metadata) === 'MOBILE' ) {
    
        return '';
      } else if(phoneNumber && phoneNumber.isValid()
            && phoneNumber.getType() 
              && isPossibleNumber(numb.number, metadata) !== 'MOBILE') {
        return t('USER_CELLPHONE_NOT_VALID');
      }
      return t('USER_CELLPHONE_NOT_VALID');
    }
    return '';
  };
    

  return (
    <Grid
      container
      item
      spacing={0}
      xs      
    >
    
      <Grid
        item
        style={{ padding: 1 }}
        xs={6}
        zeroMinWidth
      >
        <TextField
          className={classes.textField}
          fullWidth
          helperText={
            hasHelperMessage(nameFormCountry) ? helperMessage(nameFormCountry) : null
          } 
          label={labelCountry}
          name={nameFormCountry}
          onChange={handleChange2}
          select
          // eslint-disable-next-line react/jsx-sort-props
          SelectProps={{ native: false }}
          value={valueCountryCell}
          variant="outlined"
        >
          {renderOptions()}
        </TextField>


      </Grid>

      <Grid
        item
        style={{ padding: 1 }}
        xs={6}
        zeroMinWidth
      >      
        <TextField
          className={classes.textField}
          error={hasError(nameFormCell)}
          fullWidth
          helperText={
            hasError(nameFormCell) ? formState2.errors[nameFormCell][0] : null
          }        
          inputProps={{ maxLength: maxLengthCellPhoneSize }}
          // eslint-disable-next-line react/jsx-sort-props
          label={label}
          name={nameFormCell}
          onChange={handleChange2}
          SelectProps={{ native: false }}
          value={value}
          variant="outlined"
        >
          {renderOptions()}
        </TextField>
      </Grid>
    </Grid>

  );
};

CellPhoneInput.defaultProps = {
  nameFormCell: null,
  nameFormCountry: null,
  handleChange: null,
  value: null,
  valueCountryCell: null,
  label: null,
  labelCountry: null,
  t: null
};

CellPhoneInput.propTypes = {
  handleChange: PropTypes.func,
  label: PropTypes.string,
  labelCountry: PropTypes.string,
  nameFormCell: PropTypes.string,
  nameFormCountry: PropTypes.string,
  t: PropTypes.func,
  value: PropTypes.string,
  valueCountryCell: PropTypes.string,
};

export default CellPhoneInput;
