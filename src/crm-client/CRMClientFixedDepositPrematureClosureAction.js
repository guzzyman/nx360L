import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import { Button, MenuItem, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { DesktopDatePicker } from "@mui/lab";
import { format, isValid } from "date-fns";
import { daysFromNow } from "./CRMClientUtils";
import CurrencyField from "common/CurrencyField";
import { useEffect } from "react";

export default function CRMClientFixedDepositPrematureClosureAction(props) {
  const { onClose, isReoccurringDeposit, ...rest } = props;

  const { fixedDepositId } = useParams();

  const [addMutation, { isLoading }] = isReoccurringDeposit
    ? nimbleX360CRMClientApi.useAddCRMClientReoccurringFixedDepositDetailsActionMutation()
    : nimbleX360CRMClientApi.useAddCRMClientFixedDepositDetailsActionMutation();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
      closedOnDate: format(new Date(), "dd MMMM yyyy"),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({}),

    onSubmit: async (values) => {
      try {
        await addMutation({
          fixedDepositId,
          params: { command: "prematureClose" },
          ...values,
        }).unwrap();
        enqueueSnackbar(`Premature Closure Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Premature Closure Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });
  const [calculatePrematureAmount, { data }] = isReoccurringDeposit
    ? nimbleX360CRMClientApi.useAddCRMClientReoccurringFixedDepositDetailsActionMutation()
    : nimbleX360CRMClientApi.useAddCRMClientFixedDepositDetailsActionMutation();

  //   useEffect(() => {
  //     if (formik?.values?.onAccountClosureId === 200) {
  //       formik.setFieldValue("amount", data?.maturityAmount);
  //     } else {
  //       formik.resetForm();
  //     }
  //     // eslint-disable-next-line
  //   }, [data, formik?.values?.onAccountClosureId]);

  useEffect(() => {
    calculatePrematureAmount({
      fixedDepositId,
      params: { command: "calculatePrematureAmount" },
      closedOnDate: formik?.values?.closedOnDate,
      dateFormat: "dd MMMM yyyy",
      locale: "en",
    });
    // eslint-disable-next-line
  }, [fixedDepositId, formik?.values?.closedOnDate]);

  console.log(formik);

  return (
    <Modal onClose={onClose} size="md" title="Premature Closure" {...rest}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mb-4">
        <DesktopDatePicker
          label="Premature Close Date is*"
          inputFormat="dd/MM/yyyy"
          minDate={daysFromNow(20, "past")}
          maxDate={new Date()}
          disabled
          error={!!formik.touched.closedOnDate && !!formik.errors.closedOnDate}
          helperText={
            !!formik.touched.closedOnDate && formik.errors.closedOnDate
          }
          onChange={(newValue) => {
            if (isValid(new Date(newValue))) {
              formik.setFieldValue(
                "closedOnDate",
                format(new Date(newValue), "dd MMMM yyyy")
              );
            }
          }}
          value={formik.values?.closedOnDate || new Date()}
          renderInput={(params) => <TextField fullWidth {...params} />}
        />

        {data && (
          <>
            <CurrencyField
              label="Maturity Amount"
              fullWidth
              inputProps={{ readOnly: true }}
              value={data?.maturityAmount}
              focused
            />

            <TextField
              label="Action"
              fullWidth
              {...getTextFieldFormikProps(formik, "onAccountClosureId")}
              select
            >
              {data?.onAccountClosureOptions &&
                data?.onAccountClosureOptions?.map((option, i) => (
                  <MenuItem key={i} value={option.id}>
                    {option.value}
                  </MenuItem>
                ))}
            </TextField>

            {formik?.values?.onAccountClosureId === 200 && (
              <>
                <TextField
                  label="Transfer To Savings"
                  fullWidth
                  {...getTextFieldFormikProps(formik, "toSavingsAccountId")}
                  select
                >
                  {data?.savingsAccounts &&
                    data?.savingsAccounts?.map((option, i) => (
                      <MenuItem key={i} value={option.id}>
                        {option.accountNo}
                      </MenuItem>
                    ))}
                </TextField>

                <TextField
                  label="Transfer Description"
                  fullWidth
                  {...getTextFieldFormikProps(formik, "transferDescription")}
                />
              </>
            )}
          </>
        )}
      </div>

      {data && (
        <TextField
          label="Note"
          multiline
          rows={3}
          fullWidth
          {...getTextFieldFormikProps(formik, "note")}
        />
      )}
      <div className="mt-5 flex gap-3 justify-between">
        <Button
          variant="outlined"
          color="warning"
          fullWidth
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Premature Closure
        </LoadingButton>
      </div>
    </Modal>
  );
}
