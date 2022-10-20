import React from 'react';
import {nimbleX360CRMClientApi} from './CRMClientStoreQuerySlice';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {useFormik} from 'formik';
import Modal from 'common/Modal';
import {getTextFieldFormikProps, getUserErrorMessage} from 'common/Utils';
import {Button, TextField} from '@mui/material';
import {useParams} from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import {format} from 'date-fns';

export default function CRMClientRejectLoanAction (props) {
  const {onClose, ...rest} = props;

  const {loanId} = useParams ();
  const [
    addMutation,
    {isLoading},
  ] = nimbleX360CRMClientApi.useAddCRMClientLoanAssignLoanMutation ();

  const {enqueueSnackbar} = useSnackbar ();

  const formik = useFormik ({
    initialValues: {
      dateFormat: 'dd MMMM yyyy',
      locale: 'en',
      rejectedOnDate: format (new Date (), 'dd MMMM yyyy'),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object ({}),

    onSubmit: async values => {
      try {
        await addMutation ({
          loanId,
          params: {command: 'reject'},
          ...values,
        }).unwrap ();
        enqueueSnackbar (`Loan Rejected Successfully!`, {
          variant: 'success',
        });
        onClose ();
      } catch (error) {
        enqueueSnackbar (`Loan Rejection Failed!`, {
          variant: 'error',
        });
        enqueueSnackbar (getUserErrorMessage (error.data.errors), {
          variant: 'error',
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Reject Loan" {...rest}>
      <div className="my-2">
        {/* <DesktopDatePicker              
value={formik.values?.approvedOnDate || new Date()}
            label="Rejected on**"
            inputFormat="dd/MM/yyyy"
            minDate={daysFromNow(20, "past")}
            maxDate={new Date()}
            error={
              !!formik.touched.rejectedOnDate && !!formik.errors.rejectedOnDate
            }
            helperText={
              !!formik.touched.rejectedOnDate && formik.errors.rejectedOnDate
            }
            onChange={(newValue) => {
              formik.setFieldValue(
                "rejectedOnDate",
                format(new Date(newValue), "dd MMMM yyyy")
              );
            }}
            value={formik.values?.rejectedOnDate || new Date()}
            renderInput={(params) => <TextField fullWidth {...params} />}
          /> */}
      </div>

      <TextField
        {...getTextFieldFormikProps (formik, 'note')}
        label="Note"
        fullWidth
        multiline
        rows={5}
      />

      <div className="mt-5 flex gap-3 justify-between">
        <Button variant="outlined" fullWidth onClick={() => onClose ()}>
          Cancel
        </Button>
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Reject Loan
        </LoadingButton>
      </div>
    </Modal>
  );
}
