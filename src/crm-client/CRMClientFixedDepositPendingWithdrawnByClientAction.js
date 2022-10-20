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

export default function CRMClientFixedDepositPendingWithdrawnByClientAction (
  props
) {
  const {onClose, isReoccurringDeposit, ...rest} = props;

  const {fixedDepositId} = useParams ();

  const [addMutation, {isLoading}] = isReoccurringDeposit
    ? nimbleX360CRMClientApi.useAddCRMClientReoccurringFixedDepositDetailsActionMutation ()
    : nimbleX360CRMClientApi.useAddCRMClientFixedDepositDetailsActionMutation ();

  const {enqueueSnackbar} = useSnackbar ();

  const formik = useFormik ({
    initialValues: {
      dateFormat: 'dd MMMM yyyy',
      locale: 'en',
      note: '',
      withdrawnOnDate: format (new Date (), 'dd MMMM yyyy'),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object ({
      note: Yup.string ().required (),
    }),

    onSubmit: async values => {
      try {
        await addMutation ({
          fixedDepositId,
          params: {command: 'withdrawnByApplicant'},
          ...values,
        }).unwrap ();
        enqueueSnackbar (`Withdrawn Successful!`, {
          variant: 'success',
        });
        onClose ();
      } catch (error) {
        enqueueSnackbar (`Withdrawn Failed!`, {
          variant: 'error',
        });
        enqueueSnackbar (getUserErrorMessage (error.data.errors), {
          variant: 'error',
        });
      }
    },
  });

  return (
    <Modal
      onClose={onClose}
      size="md"
      title="Withdrawn by Client Appplication"
      {...rest}
    >
      <TextField
        label="Note"
        multiline
        rows={3}
        fullWidth
        {...getTextFieldFormikProps (formik, 'note')}
      />
      <div className="mt-5 flex gap-3 justify-between">
        <Button
          variant="outlined"
          color="warning"
          fullWidth
          onClick={() => onClose ()}
        >
          Cancel
        </Button>
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Withdrawn
        </LoadingButton>
      </div>
    </Modal>
  );
}
