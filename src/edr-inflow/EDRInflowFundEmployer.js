import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import useToggle from "hooks/useToggle";
import { nxEDRInflowApi } from "./EDRInflowStoreQuerySlice";
import { useMemo, useState } from "react";
import useDebouncedState from "hooks/useDebouncedState";
import CurrencyTypography from "common/CurrencyTypography";
import currencyjs from "currency.js";
import { useSnackbar } from "notistack";
import { getTextFieldFormikProps } from "common/Utils";

function EDRInflowFundEmployer({ transactions, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();

  const [isFundEmployerModal, toggleFundEmployerModal] = useToggle();

  const [q, setQ] = useState("");

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const [fundEmployerFromEDRMutation, fundEmployerFromEDRMutationResult] =
    nxEDRInflowApi.useFundEmployerFromEDRMutation();

  const searchEmployersQueryResult = nxEDRInflowApi.useGetEDREmployersQuery(
    {
      selectOnlyParentEmployer: true,
      ...(debouncedQ ? { name: debouncedQ } : {}),
    },
    { skip: !debouncedQ || !isFundEmployerModal }
  );

  const transactionsAmount = currencyjs(
    transactions?.reduce((acc, curr) => {
      return acc.add(curr?.tranAmount);
    }, currencyjs(0)) || 0
  ).value;

  function closeDialog() {
    formik.resetForm();
    setQ("");
    toggleFundEmployerModal();
  }

  const formik = useFormik({
    initialValues: {
      employer: null,
    },
    validationSchema: yup.object({
      employer: yup.mixed().label("Employer").required(),
    }),
    onSubmit: async (values) => {
      try {
        const data = await fundEmployerFromEDRMutation({
          fcmbIds: transactions?.map((transaction) => transaction.id),
          businessId: values.employer.businessId,
        }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage || "Employer Funded Successful",
          { variant: "success" }
        );
        closeDialog();
        onSuccess?.();
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.[0]?.defaultUserMessage ||
            "Failed to Fund Employer",
          { variant: "error" }
        );
      }
    },
  });

  return (
    <>
      <Button onClick={toggleFundEmployerModal}>Fund Employer</Button>
      <Dialog fullWidth open={isFundEmployerModal}>
        <DialogTitle>Fund Employer</DialogTitle>
        <DialogContent>
          <div className="flex items-center flex-wrap mb-3">
            <Typography className="font-bold">Total</Typography>
            <div className="flex-1" />
            <CurrencyTypography className="font-bold">
              {transactionsAmount}
            </CurrencyTypography>
          </div>
          <Paper variant="outlined">
            <List className="max-h-36 overflow-y-auto" dense>
              {transactions?.map((transaction) => {
                return (
                  <ListItem key={transaction.id}>
                    <ListItemText
                      primary={transaction.tranId}
                      secondary={
                        <CurrencyTypography component="span">
                          {transaction.tranAmount}
                        </CurrencyTypography>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
          <Autocomplete
            fullWidth
            loading={searchEmployersQueryResult.isFetching}
            freeSolo
            options={searchEmployersQueryResult?.data?.pageItems || []}
            filterOptions={(options) => options}
            getOptionLabel={(option) => (option?.name ? option?.name : option)}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option?.id}>
                <ListItemText
                  primary={`${option?.name} (${option?.sector?.name})`}
                  secondary={`${option?.businessId}-${option?.mobileNo}`}
                />
              </li>
            )}
            isOptionEqualToValue={(option, value) => {
              return option?.id === value?.id;
            }}
            inputValue={q}
            onInputChange={(_, value) => setQ(value)}
            value={formik.values.employer}
            onChange={(_, value) => {
              formik.setFieldValue("employer", value);
            }}
            renderInput={(params) => (
              <TextField
                margin="normal"
                label="Search Employers"
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchEmployersQueryResult.isFetching ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                {...getTextFieldFormikProps(formik, "employer")}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={closeDialog}>
            Cancel
          </Button>
          <LoadingButton
            disabled={fundEmployerFromEDRMutationResult.isLoading}
            loading={fundEmployerFromEDRMutationResult.isLoading}
            loadingPosition="end"
            endIcon={<></>}
            type="submit"
            onClick={formik.handleSubmit}
          >
            Fund
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EDRInflowFundEmployer;
