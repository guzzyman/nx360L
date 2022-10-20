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
} from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import { useFormik } from "formik";
import useDataRef from "hooks/useDataRef";
import useDebouncedState from "hooks/useDebouncedState";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { nxEDRTransactionApi } from "./EDRTransactionStoreQuerySlice";
import { useSnackbar } from "notistack";

function EDRTransactionPartiallyProcessedDetailsTransactionDetailsEdit(props) {
  const { open, onClose, transaction } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { tid } = useParams();

  const [q, setQ] = useState("");

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const [updateEDRTransactionMutation, updateEDRTransactionMutationResult] =
    nxEDRTransactionApi.useUpdateEDRTransactionMutation();

  const searchClientQueryResult =
    nxEDRTransactionApi.useClientSearchEDRTransactionQuery(
      debouncedQ ? { displayName: debouncedQ } : {},
      { skip: !debouncedQ || !open }
    );

  const formik = useFormik({
    initialValues: {
      employeeName: "",
      employeeNumber: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      employeeName: yup.string().label("Employee Name").required(),
      employeeNumber: yup.string().label("Staff ID").required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        await updateEDRTransactionMutation({ edrId: tid, ...values });
        onClose();
        enqueueSnackbar("Transaction Employee Updated", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Failed to Update Transaction Employee", {
          variant: "error",
        });
      }
    },
  });

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    dataRef.current.formik.setValues({
      employeeName: transaction?.employeeName || "",
      employeeNumber: transaction?.employeeNumber || "",
    });
    setQ(transaction?.employeeName || "");
  }, [dataRef, transaction?.employeeName, transaction?.employeeNumber]);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Update Transaction</DialogTitle>
      <DialogContent>
        <div className="grid gap-4 my-4">
          <TextField
            // type="number"
            label="Staff ID"
            {...getTextFieldFormikProps(formik, "employeeNumber")}
          />
          <Autocomplete
            loading={searchClientQueryResult.isFetching}
            freeSolo
            options={searchClientQueryResult?.data?.pageItems || []}
            getOptionLabel={(option) =>
              option?.displayName
                ? `${option.id}-${option.displayName}`
                : option
            }
            isOptionEqualToValue={(option, value) => {
              return option.displayName === value;
            }}
            inputValue={q}
            onInputChange={(_, value) => setQ(value)}
            value={formik.values.employeeName}
            onChange={(_, value) => {
              formik.setFieldValue("employeeName", value?.displayName || "");
            }}
            renderInput={(params) => (
              <TextField
                label="Employee Name"
                //   {...getTextFieldFormikProps(formik, "employeeName")}
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchClientQueryResult.isFetching ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          disabled={updateEDRTransactionMutationResult.isLoading}
          loading={updateEDRTransactionMutationResult.isLoading}
          loadingPosition="end"
          endIcon={<></>}
          type="submit"
          onClick={formik.handleSubmit}
        >
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default EDRTransactionPartiallyProcessedDetailsTransactionDetailsEdit;
