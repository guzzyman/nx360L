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
import { useMemo } from "react";
import { useEffect } from "react";
import FormatToNumber from "common/FormatToNumber";

export default function CRMClientFixedDepositChargesAction(props) {
  const { onClose, ...rest } = props;
  const { fixedDepositId } = useParams();

  const { data } =
    nimbleX360CRMClientApi.useGetCRMClientsChargesDetailListQuery({
      fixedDepositId,
    });

  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientChargesMutation();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      dateFormat: "dd MMMM yyyy",
      locale: "en",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({}),

    onSubmit: async (values) => {
      try {
        await addMutation({
          fixedDepositId,
          ...values,
        }).unwrap();
        enqueueSnackbar(`Add Charges Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`Add Charges Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  const { data: dataCharges } =
    nimbleX360CRMClientApi.useGetCRMClientsChargesDetailQuery(
      useMemo(
        () => ({
          id: formik?.values?.chargeId,
          template: true,
        }),
        [formik?.values?.chargeId]
      ),
      { skip: !formik?.values?.chargeId }
    );

  useEffect(() => {
    // formik.resetForm();
    formik.setFieldValue("amount", dataCharges?.amount);
    // eslint-disable-next-line
  }, [dataCharges]);

  console.log(formik);

  return (
    <Modal onClose={onClose} size="md" title="Add Charges" {...rest}>
      <TextField
        {...getTextFieldFormikProps(formik, "chargeId")}
        label="Charges"
        select
        fullWidth
      >
        {data?.chargeOptions?.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name} ( {option.currency.name} )
          </MenuItem>
        ))}
      </TextField>

      {dataCharges && (
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <CurrencyField
            {...getTextFieldFormikProps(formik, "amount")}
            label="Amount"
            focused
            fullWidth
          />
          <TextField
            {...getTextFieldFormikProps(formik, "chargeCalculationType")}
            label="Charge Calculation"
            disabled
            value={
              formik?.values?.chargeCalculationType ||
              dataCharges?.chargeCalculationType?.id
            }
            select
            fullWidth
          >
            {dataCharges?.chargeCalculationTypeOptions?.map((option, i) => (
              <MenuItem key={i} value={option.id}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            {...getTextFieldFormikProps(formik, "chargeTimeType")}
            label="Charge time type"
            disabled
            value={
              formik?.values?.chargeTimeType || dataCharges?.chargeTimeType?.id
            }
            select
            fullWidth
          >
            {dataCharges?.chargeTimeTypeOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          {!(
            dataCharges?.chargeTimeType?.value === "Withdrawal Fee" ||
            dataCharges?.chargeTimeType?.value === "Saving No Activity Fee"
          ) &&
            !(
              dataCharges?.chargeTimeType?.value === "Annual Fee" ||
              dataCharges?.chargeTimeType?.value === "Monthly Fee"
            ) && (
              <DesktopDatePicker
                label="Due for collection on"
                inputFormat="dd/MM/yyyy"
                minDate={daysFromNow(7, "past")}
                maxDate={new Date()}
                error={!!formik.touched.dueDate && !!formik.errors.dueDate}
                helperText={!!formik.touched.dueDate && formik.errors.dueDate}
                onChange={(newValue) => {
                  if (isValid(new Date(newValue))) {
                    formik.setFieldValue(
                      "dueDate",
                      format(new Date(newValue), "dd MMMM yyyy")
                    );
                  }
                }}
                value={formik.values?.dueDate || new Date()}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            )}
          {!(
            dataCharges?.chargeTimeType?.value === "Withdrawal Fee" ||
            dataCharges?.chargeTimeType?.value === "Saving No Activity Fee"
          ) &&
            (dataCharges?.chargeTimeType?.value === "Annual Fee" ||
              dataCharges?.chargeTimeType?.value === "Monthly Fee") && (
              <DesktopDatePicker
                label="Due On"
                inputFormat="dd/MM/yyyy"
                minDate={daysFromNow(7, "past")}
                maxDate={new Date()}
                error={
                  !!formik.touched.feeOnMonthDay &&
                  !!formik.errors.feeOnMonthDay
                }
                helperText={
                  !!formik.touched.feeOnMonthDay && formik.errors.feeOnMonthDay
                }
                onChange={(newValue) => {
                  if (isValid(new Date(newValue))) {
                    formik.setFieldValue(
                      "feeOnMonthDay",
                      format(new Date(newValue), "dd MMMM yyyy")
                    );
                  }
                }}
                value={formik.values?.feeOnMonthDay || new Date()}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            )}
          {dataCharges?.chargeTimeType?.value === "Monthly Fee" && (
            <TextField
              {...getTextFieldFormikProps(formik, "feeInterval")}
              label="Repeats Every"
              type={"number"}
              InputProps={{
                inputComponent: FormatToNumber,
                inputProps: { min: 0, max: 12 },
              }}
              fullWidth
            />
          )}
        </div>
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
          Add Charges
        </LoadingButton>
      </div>
    </Modal>
  );
}
