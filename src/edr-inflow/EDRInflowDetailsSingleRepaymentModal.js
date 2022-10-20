import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  CircularProgress,
  MenuItem,
  ListItemText,
} from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import { useFormik } from "formik";
import useDebouncedState from "hooks/useDebouncedState";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { nxEDRInflowApi } from "./EDRInflowStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import { EDRPaymentTypeEnum } from "edr/EDRConstants";
import useDataRef from "hooks/useDataRef";

function EDRInflowDetailsSingleRepaymentModal(props) {
  const { open, onClose, id } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [q, setQ] = useState("");

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const [createEDRMutation, createEDRMutationResult] =
    nxEDRInflowApi.useCreateEDRMutation();

  const searchClientsQueryResult = nxEDRInflowApi.useGetEDRClientsQuery(
    debouncedQ
      ? {
          fields:
            "id,displayName,accountNo,bvn,bvnValidationStatus,dateOfBirth,mobileNo",
          sqlSearch: [
            "display_name",
            "id",
            "account_no",
            "email_address",
            "mobile_no",
            "bvn",
          ]
            .map((key) => `c.${key} like '%${debouncedQ}%'`)
            .join(" or "),
        }
      : {},
    { skip: !debouncedQ || !open }
  );

  const formik = useFormik({
    initialValues: {
      client: null,
      loanClientId: "",
      isSingle: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      loanClientId: yup.string().label("Loan ID").required(),
      // journalId: yup.string().label("Journal ID").required(),
      isSingle: yup.number().label("Payment Type").required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        const data = await createEDRMutation({
          loanClientId: values.loanClientId,
          journalId: id,
          isSingle: values.isSingle,
        }).unwrap();
        onClose(data);
        helper.resetForm();
        navigate(RouteEnum.EDR);
        enqueueSnackbar(
          data?.defaultUserMessage || "Single Repayment Processed Successful",
          {
            variant: "success",
          }
        );
      } catch (error) {
        enqueueSnackbar(
          error?.data?.defaultUserMessage || "Failed to Process Repayment",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const clientLoansQueryResult = nxEDRInflowApi.useGetEDRClientLoansQuery(
    debouncedQ
      ? {
          fields: "id,loanProductName",
          sqlSearch: `l.loan_status_id in (300) AND l.client_id=${formik.values.client?.id}`,
        }
      : {},
    {
      skip: !(
        formik.values.client?.id &&
        open &&
        !!formik.values.isSingle &&
        formik.values.isSingle != EDRPaymentTypeEnum.FUND_WALLET
      ),
    }
  );

  const clientSavingsAccountsQueryResult =
    nxEDRInflowApi.useGetEDRClientSavingsAccountsQuery(
      debouncedQ
        ? {
            fields: "id,savingsProductName",
            sqlSearch: `sa.deposit_type_enum=100 AND sa.status_enum in (300) AND sa.client_id=${formik.values.client?.id}`,
          }
        : {},
      {
        skip: !(
          formik.values.client?.id &&
          open &&
          !!formik.values.isSingle &&
          formik.values.isSingle == EDRPaymentTypeEnum.FUND_WALLET
        ),
      }
    );

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (
      formik.values.client?.id &&
      formik.values.isSingle == EDRPaymentTypeEnum.FUND_WALLET
    ) {
      dataRef.current.formik.setFieldValue(
        "loanClientId",
        formik.values.client?.savingsAccountId
      );
    }
  }, [
    dataRef,
    formik.values.client?.id,
    formik.values.client?.savingsAccountId,
    formik.values.isSingle,
  ]);

  return (
    <Dialog maxWidth="xs" open={open} fullWidth>
      <DialogTitle>Process Single Repayment</DialogTitle>
      <DialogContent>
        <div className="grid gap-4 my-4">
          <TextField
            fullWidth
            label="Payment Type"
            required
            select
            placeholder="Select Payment Type"
            {...getTextFieldFormikProps(formik, "isSingle")}
          >
            {[
              { label: "REPAYMENT", value: EDRPaymentTypeEnum.REPAYMENT },
              { label: "FUND_WALLET", value: EDRPaymentTypeEnum.FUND_WALLET },
              { label: "PREPAY", value: EDRPaymentTypeEnum.PREPAY },
              { label: "FORECLOSURE", value: EDRPaymentTypeEnum.FORECLOSURE },
            ].map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Autocomplete
            fullWidth
            loading={searchClientsQueryResult.isFetching}
            freeSolo
            options={searchClientsQueryResult?.data?.pageItems || []}
            filterOptions={(options) => options}
            getOptionLabel={(option) =>
              option?.displayName ? option?.displayName : option
            }
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <ListItemText
                  primary={`(${option.id}) ${option.displayName}`}
                  secondary={`${option.bvn}-${option.mobileNo}`}
                />
              </li>
            )}
            isOptionEqualToValue={(option, value) => {
              return option.id === value?.id;
            }}
            inputValue={q}
            onInputChange={(_, value) => setQ(value)}
            value={formik.values.client}
            onChange={(_, value) => {
              formik.setFieldValue("client", value);
            }}
            renderInput={(params) => (
              <TextField
                label="Search Client"
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchClientsQueryResult.isFetching ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {formik.values.isSingle == EDRPaymentTypeEnum.FUND_WALLET
            ? !!clientSavingsAccountsQueryResult.data?.pageItems?.length && (
                <TextField
                  select
                  fullWidth
                  label="Select Savings Account"
                  {...getTextFieldFormikProps(formik, "loanClientId")}
                >
                  {clientSavingsAccountsQueryResult.data?.pageItems?.map(
                    (option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.savingsProductName} ({option.id})
                      </MenuItem>
                    )
                  )}
                </TextField>
              )
            : !!clientLoansQueryResult.data?.pageItems?.length && (
                <TextField
                  select
                  fullWidth
                  label="Select Loan"
                  {...getTextFieldFormikProps(formik, "loanClientId")}
                >
                  {clientLoansQueryResult.data?.pageItems?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.loanProductName} ({option.id})
                    </MenuItem>
                  ))}
                </TextField>
              )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            formik.resetForm();
            onClose();
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          disabled={createEDRMutationResult.isLoading}
          loading={createEDRMutationResult.isLoading}
          loadingPosition="end"
          endIcon={<></>}
          type="submit"
          onClick={formik.handleSubmit}
        >
          Process
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default EDRInflowDetailsSingleRepaymentModal;
