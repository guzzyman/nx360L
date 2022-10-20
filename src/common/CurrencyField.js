import {TextField} from '@mui/material';
import React from 'react';
import FormatToCurrency from './FormatToCurrency';

/**
 *
 * @param {CurrencyInput} props
 * @returns
 */
export default function CurrencyField (props) {
  const {InputProps, ...rest} = props;
  return (
    <TextField
      {...rest}
      InputProps={{
        ...(InputProps ? InputProps : {}),
        inputComponent: FormatToCurrency,
      }}
    />
  );
}
