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

export default function CRMClientLoanUndoSalesLoanApproval (props) {
  const {onClose, ...rest} = props;

  const {loanId} = useParams ();
  const [
    addMutation,
    {isLoading},
  ] = nimbleX360CRMClientApi.useAddCRMClientLoanAssignLoanMutation ();

  const {enqueueSnackbar} = useSnackbar ();

  const formik = useFormik ({
    initialValues: {
      note: '',
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
          loanId,
          params: {command: 'undosalesapproval'},
          ...values,
        }).unwrap ();
        enqueueSnackbar (`Undo Sales Approval Successful!`, {
          variant: 'success',
        });
        onClose ();
      } catch (error) {
        enqueueSnackbar (`Undo Sales Approval Failed!`, {
          variant: 'error',
        });
        enqueueSnackbar (getUserErrorMessage (error.data.errors), {
          variant: 'error',
        });
      }
    },
  });

  return (
    <Modal onClose={onClose} size="md" title="Undo Sales Approval" {...rest}>
      <TextField
        {...getTextFieldFormikProps (formik, 'note')}
        label="Note"
        fullWidth
        multiline
        rows={5}
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
          Undo Sales Approval
        </LoadingButton>
      </div>
    </Modal>
  );
}
