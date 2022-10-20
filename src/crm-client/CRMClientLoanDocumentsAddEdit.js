import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { FormHelperText, MenuItem, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/system";
import FileUploadInput from "common/FileUploadInput";
import { nimbleX360Api } from "common/StoreQuerySlice";

export default function CRMClientLoanDocumentsAddEdit(props) {
  const { onClose, loanDocumentId, clientLoanQueryResult, ...rest } = props;
  const isEdit = !!loanDocumentId;

  const [clientConfiguration, setClientConfiguration] = React.useState("");
  const [clientConfigurationCodes, setClientConfigurationCodes] =
    React.useState("");

  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientLoanDocumentMutation();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      file: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      name: Yup.string().required(),
      description: Yup.string().required(),
      file: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        await addMutation({ loanId, ...values }).unwrap();

        enqueueSnackbar(
          `document ${isEdit ? "update" : "creation"} Successful!`,
          {
            variant: "success",
          }
        );
        onClose();
      } catch (error) {
        enqueueSnackbar(`document ${isEdit ? "update" : "creation"} Failed!`, {
          variant: "error",
        });
      }
    },
  });

  const { data: clientConfigurationCodesList } =
    nimbleX360CRMClientApi.useGetCRMClientConfigurationCodesQuery(
      {
        cdlConfigurationId: clientConfiguration,
      },
      { skip: !clientConfiguration }
    );

  const { data: clientIdentifierList } = nimbleX360Api.useGetCodeValuesQuery(
    React.useMemo(() => clientConfigurationCodes, [clientConfigurationCodes]),
    { skip: !clientConfigurationCodes }
  );

  const handleFileChange = (e) => {
    let file = e.target.files[0];
    formik.setFieldValue("file", file);
  };

  return (
    <Modal
      onClose={onClose}
      title={`${isEdit ? "update" : "Add"} Document`}
      {...rest}
    >
      <Box mt={5}>
        <div className="grid grid-cols-1 gap-4">
          <TextField
            onChange={(e) => {
              const { value } = e.target;
              setClientConfiguration(value);
              setClientConfigurationCodes("");
            }}
            value={clientConfiguration}
            select
            fullWidth
            label="Document Configuration"
          >
            {clientLoanQueryResult?.data?.configs &&
              clientLoanQueryResult?.data?.configs
                ?.filter((e) => !e.disabled)
                ?.map((document, i) => (
                  <MenuItem key={i} value={document.id}>
                    {document.name}
                  </MenuItem>
                ))}
          </TextField>

          <TextField
            select
            {...formik.getFieldProps("description")}
            value={formik.values.description || ""}
            error={!!formik.touched.description && !!formik.errors.description}
            helperText={
              !!formik.touched.description && formik.errors.description
            }
            label="Document"
            fullWidth
          >
            {clientConfigurationCodesList?.codeData &&
              clientConfigurationCodesList?.codeData
                ?.filter((e) => e.systemDefined)
                ?.map((document, i) => (
                  <MenuItem
                    key={i}
                    value={document.name}
                    onClick={() => {
                      setClientConfigurationCodes(document.id);
                    }}
                  >
                    {document.name}
                  </MenuItem>
                ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Document Type"
            {...formik.getFieldProps("name")}
            error={!!formik.touched.name && !!formik.errors.name}
            helperText={!!formik.touched.name && formik.errors.name}
          >
            {clientIdentifierList &&
              clientIdentifierList.map((document, i) => (
                <MenuItem key={i} value={document.name}>
                  {document.name}
                </MenuItem>
              ))}
          </TextField>

          <FileUploadInput
            fullWidth
            label="File*"
            onChange={handleFileChange}
            error={!!formik.touched.file && !!formik.errors.file}
            helperText={!!formik.touched.file && formik.errors.file}
            inputProps={{ accept: ".jpg, .jpeg, .png, .pdf" }}
          />

          <LoadingButton
            size="large"
            loading={isLoading}
            fullWidth
            onClick={formik.handleSubmit}
          >
            {isEdit ? "update" : "Add"} Document
          </LoadingButton>
        </div>
        <FormHelperText>
          Upload a means of identification in .jpg, .png or .pdf format{" "}
        </FormHelperText>
      </Box>
      {/* <div className="mt-5">
        <LoadingButton
          size="large"
          loading={isLoading || updateLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          {isEdit ? "update" : "Add"} Document
        </LoadingButton>
      </div> */}
    </Modal>
  );
}
