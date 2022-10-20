import React, { useState } from "react";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { sequestRequestApi, nx360RequestApi } from "./RequestStoreQuerySlice";
import useDebouncedState from "hooks/useDebouncedState";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import useAuthUser from "hooks/useAuthUser";

function RequestDetailsClientUpdate(props) {
  const { title, open, onClose, affectedPersonEmail, clientId, ...rest } =
    props;
  const [q, setQ] = useState("");
  const authUser = useAuthUser();
  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });
  const [updateClientMutation, updateClientMutationResult] =
    nx360RequestApi.useUpdateCRMClientMutation();
  const { enqueueSnackbar } = useSnackbar();
//   const navigate = useNavigate();
  const [updateSequestClientMutation, updateSequestClientMutationResults] =
    sequestRequestApi.useUpdateNewCustomerClientIdMutation();
  const searchClientsQueryResult = nx360RequestApi.useGetEDRClientsQuery(
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
      emailAddress: `${affectedPersonEmail}`,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      //   loanClientId: yup.string().label("Loan ID").required(),
      //   isSingle: yup.number().label("Payment Type").required(),
    }),
    onSubmit: async (values, helper) => {
      try {
        const data = await updateClientMutation({
          id: values.clients?.id,
          emailAddress: affectedPersonEmail,
        }).unwrap();
        onClose(data);
        helper.resetForm();

        enqueueSnackbar(
          data?.defaultUserMessage || "Client Details Updated Successfully!!!",
          {
            variant: "success",
          }
        );

        // Update the client email in sequest
        try {
          await updateSequestClientMutation({
            customerEmail: affectedPersonEmail,
            customerId: values.clients?.id,
            staffId: `${authUser?.staffId}`,
          }).unwrap();
          enqueueSnackbar(
            data?.defaultUserMessage ||
              "Sequest Client Details Updated Successfully!!!",
            {
              variant: "success",
            }
          );
        } catch (error) {
          enqueueSnackbar(
            error?.data?.defaultUserMessage ||
              "Failed to Update Sequest Client Details!!!",
            {
              variant: "error",
            }
          );
        }
      } catch (error) {
        enqueueSnackbar(
          error?.data?.defaultUserMessage ||
            "Failed to Update Client Details!!!",
          {
            variant: "error",
          }
        );
      }
    },
  });

  return (
    <Dialog maxWidth="xs" open={open} fullWidth>
      <DialogTitle>Update Client Details</DialogTitle>
      <DialogContent>
        <div className="grid gap-4 my-4">
          <TextField
            fullWidth
            label="Client Email"
            required
            disabled={true}
            placeholder="Client Email Address"
            value={affectedPersonEmail}
          />
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
              formik.setFieldValue("clients", value);
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
          disabled={updateClientMutationResult.isLoading}
          loading={updateClientMutationResult.isLoading}
          loadingPosition="end"
          endIcon={<></>}
          type="submit"
          onClick={formik.handleSubmit}
        >
          Update Client
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default RequestDetailsClientUpdate;
