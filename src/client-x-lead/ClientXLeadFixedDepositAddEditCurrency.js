import {Paper, Typography, TextField} from '@mui/material';


function ClientXLeadFixedDepositAddEditCurrency({formik, setProductId, data}) {
  return (
    <div className="grid gap-4">
      <Paper className="p-4 md:p-8">
        <Typography variant="h6" className="font-bold">
          Currency
        </Typography>
        <Typography variant="body2" className="mb-8" color="textSecondary">
          Kindly fill in all required information in the Fixed Deposit application form.
        </Typography>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl">
          <TextField
            label="Currency"
            inputProps={{readOnly: true}}
            value={data?.currency?.code}
            focused
            // {...getTextFieldFormikProps (formik, 'currency.code')}
          />

          <TextField
            label="Decimal Places"
            inputProps={{readOnly: true}}
            value={data?.currency?.decimalPlaces}
            focused
            // {...getTextFieldFormikProps (formik, 'decimalPlaces')}
          />

          <TextField
            label="Currency Multiples"
            inputProps={{readOnly: true}}
            value={data?.currency?.inMultiplesOf }
            focused
            // {...getTextFieldFormikProps (formik, 'currencyMultiple')}
          />
        </div>
      </Paper>
    </div>
  );
}

export default ClientXLeadFixedDepositAddEditCurrency;
