import { Button, MenuItem, Paper, TextField } from "@mui/material";
import { LoadingButton, DatePicker } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { getTextFieldFormikProps } from "common/Utils";
import { useFormik } from "formik";
import useDataRef from "hooks/useDataRef";
import { useEffect, useMemo } from "react";
import { useParams, useNavigate, generatePath } from "react-router-dom";
import * as yup from "yup";
import { nxEDRInflowApi } from "./EDRInflowStoreQuerySlice";
import { useSnackbar } from "notistack";
import { DateConfig, RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import useAuthUser from "hooks/useAuthUser";
import * as dfn from "date-fns";

function EDRInflowCreateEdit(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const authUser = useAuthUser();

  const isEdit = !!id;

  const [createEDRInflowMutation, createEDRInflowMutationResult] =
    nxEDRInflowApi.useCreateEDRInflowMutation();

  const [updateEDRInflowMutation, updateEDRInflowMutationResult] =
    nxEDRInflowApi.useUpdateEDRInflowMutation();

  const glAccountsQueryResult = nxEDRInflowApi.useGetEDRGLAccountsQuery();

  const glAccounts = useMemo(
    () =>
      glAccountsQueryResult?.data?.filter(
        (account) => account?.glCode == "0238850014"
      ),
    [glAccountsQueryResult?.data]
  );

  const { data, isLoading, isError, refetch } =
    nxEDRInflowApi.useGetEDRInflowQuery({ fcmbId: id }, { skip: !id });

  const inflow = data;

  const goBack = () =>
    navigate(
      isEdit ? generatePath(RouteEnum.EDR_DETAILS, { id }) : RouteEnum.EDR
    );

  const formik = useFormik({
    initialValues: {
      tranId: "",
      tranAmount: "",
      tranParticular: "",
      tranDate: new Date(),
      valueDate: new Date(),
      accountName: "",
      reference: "",
      locale: DateConfig.LOCALE,
      dateFormat: DateConfig.FORMAT,
      accountId: "",
      isManualEntry: true,
    },
    validationSchema: yup.object({
      tranId: yup.string().label("Transaction ID").required(),
      tranAmount: yup.string().label("Transaction Amount").required(),
      tranParticular: yup.string().label("Transaction Particular").optional(),
      accountName: yup.string().label("Account Name").required(),
      reference: yup.string().label("Reference").optional(),
      tranDate: yup.date().label("Transaction Date").required(),
      valueDate: yup.date().label("Value Date").required(),
    }),
    onSubmit: async (values) => {
      try {
        const func = isEdit ? updateEDRInflowMutation : createEDRInflowMutation;
        const data = await func({
          ...values,
          fcmbId: id,
          createdbyId: authUser.id,
          note: values.tranParticular,
          tranDate: dfn.format(values.tranDate, DateConfig.FORMAT),
          valueDate: dfn.format(values.valueDate, DateConfig.FORMAT),
          ...(isEdit
            ? {
                tranId: undefined,
                tranParticular: undefined,
                reference: undefined,
                createdbyId: undefined,
                accountName: undefined,
                tranDate: undefined,
                valueDate: undefined,
              }
            : {}),
        }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage || "Inflow Creation Successful",
          { variant: "success" }
        );
        goBack();
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.[0]?.defaultUserMessage ||
            "Failed to Create Inflow",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (isEdit) {
      const values = dataRef.current.formik.values;
      dataRef.current.formik.setValues({
        ...values,
        tranId: inflow?.tranId || values.tranId,
        tranAmount: inflow?.tranAmount || values.tranAmount,
        tranParticular: inflow?.tranParticular || values.tranParticular,
        accountName: inflow?.accountName || values.accountName,
        accountId: inflow?.gLAccountData?.id || values.accountId,
        reference: inflow?.reference || values.reference,
      });
    }
  }, [
    dataRef,
    inflow?.accountName,
    inflow?.gLAccountData?.id,
    inflow?.reference,
    inflow?.tranAmount,
    inflow?.tranId,
    inflow?.tranParticular,
    isEdit,
  ]);

  return (
    <>
      <PageHeader title={`${isEdit ? "Update" : "Create"} FCMB Inflow`} />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <div className="max-w-2xl mx-auto">
            <Paper className="p-4">
              <div className="grid sm:grid-cols-2 gap-4 py-4">
                <TextField
                  fullWidth
                  label="Transaction ID"
                  {...getTextFieldFormikProps(formik, "tranId")}
                  {...(isEdit ? { onChange: () => {}, disabled: true } : {})}
                />
                <TextField
                  fullWidth
                  label="Transaction Amount"
                  {...getTextFieldFormikProps(formik, "tranAmount")}
                />
                <TextField
                  fullWidth
                  label="Account Name"
                  {...getTextFieldFormikProps(formik, "accountName")}
                  {...(isEdit ? { onChange: () => {}, disabled: true } : {})}
                />
                <TextField
                  select
                  fullWidth
                  label="Account GL"
                  {...getTextFieldFormikProps(formik, "accountId")}
                >
                  {glAccounts?.map((option) => (
                    <MenuItem key={option?.id} value={option?.id}>
                      {option.glCode} - {option?.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Reference"
                  {...getTextFieldFormikProps(formik, "reference")}
                  {...(isEdit ? { onChange: () => {}, disabled: true } : {})}
                />
                <DatePicker
                  disableFuture
                  label="Transaction Date"
                  value={formik.values.tranDate}
                  onChange={(newValue) => {
                    formik.setFieldValue("tranDate", newValue);
                  }}
                  {...(isEdit ? { onChange: () => {}, disabled: true } : {})}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      required
                      {...getTextFieldFormikProps(formik, "tranDate")}
                      {...params}
                    />
                  )}
                />
                <DatePicker
                  disableFuture
                  label="Value Date"
                  value={formik.values.valueDate}
                  onChange={(newValue) => {
                    formik.setFieldValue("valueDate", newValue);
                  }}
                  {...(isEdit ? { onChange: () => {}, disabled: true } : {})}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      required
                      {...getTextFieldFormikProps(formik, "valueDate")}
                      {...params}
                    />
                  )}
                />
                <TextField
                  className="sm:col-span-2"
                  multiline
                  minRows={3}
                  maxRows={5}
                  fullWidth
                  label="Narration"
                  {...getTextFieldFormikProps(formik, "tranParticular")}
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outlined" onClick={goBack}>
                  Cancel
                </Button>
                <LoadingButton
                  disabled={
                    createEDRInflowMutationResult.isLoading ||
                    updateEDRInflowMutationResult.isLoading
                  }
                  loading={
                    createEDRInflowMutationResult.isLoading ||
                    updateEDRInflowMutationResult.isLoading
                  }
                  loadingPosition="end"
                  endIcon={<></>}
                  onClick={formik.handleSubmit}
                >
                  Submit
                </LoadingButton>
              </div>
            </Paper>
          </div>
        )}
      </LoadingContent>
    </>
  );
}

export default EDRInflowCreateEdit;
