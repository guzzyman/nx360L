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
import { useState } from "react";
import * as yup from "yup";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { RouteEnum } from "common/Constants";

function EDRTransactionFreshDetailsSingleRepayment(props) {
  const { open, onClose, id } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [q, setQ] = useState("");

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const [createEDRMutation, createEDRMutationResult] =
    nxEDRTransactionApi.useCreateEDRMutation();

  const searchClientsQueryResult = nxEDRTransactionApi.useGetClientsEDRQuery(
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

  const clientLoansQueryResult = nxEDRTransactionApi.useGetClientLoansEDRQuery(
    debouncedQ
      ? {
          fields: "id,loanProductName",
          sqlSearch: `l.loan_status_id in (300) AND l.client_id=${formik.values.client?.id}`,
        }
      : {},
    { skip: !formik.values.client?.id || !open }
  );

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
              { label: "REPAYMENT", value: 2 },
              { label: "FUND_WALLET", value: 3 },
              { label: "PREPAY", value: 4 },
              { label: "FORECLOSURE", value: 5 },
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
          {!!clientLoansQueryResult.data?.pageItems?.length && (
            <TextField
              select
              fullWidth
              label="Select Loan"
              {...getTextFieldFormikProps(formik, "loanClientId")}
            >
              {clientLoansQueryResult.data?.pageItems?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.loanProductName}
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

export default EDRTransactionFreshDetailsSingleRepayment;
