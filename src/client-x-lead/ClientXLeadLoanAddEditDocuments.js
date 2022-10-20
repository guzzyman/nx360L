import {
  Box,
  Grid,
  MenuItem,
  FormHelperText,
  TextField,
  Button,
} from "@mui/material";
import { Icon } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import IconButton from "@mui/material/IconButton";
import { nimbleX360Api } from "common/StoreQuerySlice";
import FileUploadInput from "common/FileUploadInput";
import { getBase64, removeBase64Meta } from "common/Utils";
import React from "react";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";

function ClientXLeadLoanAddEditDocuments({ formik, loanId }) {
  return (
    <div>
      <ClientXLeadLoanAddEditDocumentsItem loanId={loanId} formik={formik} />

      {formik?.values?.length >= 1 && (
        <table class="table-auto w-full max-w-md mt-10">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {formik?.values?.map((value, index) => (
              <tr className="py-3 text-center">
                <td key={index}>{index + 1}</td>
                <td key={index}>{value?.name}</td>
                <td key={index}>{value?.description}</td>
                <td>
                  <IconButton
                    onClick={() => {
                      let documentList = formik?.values;
                      delete documentList[index];
                      formik.setValues(
                        documentList.filter((el) => el !== undefined)
                      );
                    }}
                  >
                    <Icon color="warning">cancel</Icon>
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ClientXLeadLoanAddEditDocumentsItem({ formik, loanId }) {
  const clientLoanQueryResult =
    nimbleX360CRMClientApi.useGetClientLoadDetailsQuery({
      loanId,
      associations: "all",
      exclude: "guarantors,futureSchedule",
    });

  const [clientConfiguration, setClientConfiguration] = React.useState("");
  const [clientConfigurationCodes, setClientConfigurationCodes] =
    React.useState("");

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

  const localFormik = useFormik({
    initialValues: {},
    validateOnChange: false, // this one
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      try {
        formik.setValues([
          ...formik?.values,
          {
            name: values?.name,
            location: values?.location,
            description: values?.description,
            fileName: values?.fileName,
            size: values?.size,
            type: values?.type,
          },
        ]);
        // formik.setValues([]);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleFileChange = (e) => {
    let file = e.target.files[0];
    getBase64(file)
      .then((result) => {
        localFormik.setFieldValue("location", removeBase64Meta(result));
        localFormik.setFieldValue("fileName", file.name);
        localFormik.setFieldValue("size", file.size);
        localFormik.setFieldValue("type", file.type);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log("localFormik", localFormik);

  return (
    <Box mt={5} className="max-w-3xl">
      <div className="grid grid-cols-2 gap-4">
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
          {...localFormik.getFieldProps("description")}
          value={localFormik.values.description || ""}
          error={
            !!localFormik.touched.description &&
            !!localFormik.errors.description
          }
          helperText={
            !!localFormik.touched.description && localFormik.errors.description
          }
          fullWidth
          label="Document"
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
          {...localFormik.getFieldProps("name")}
          error={!!localFormik.touched.name && !!localFormik.errors.name}
          helperText={!!localFormik.touched.name && formik.errors.name}
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
          error={
            !!localFormik.touched.location && !!localFormik.errors.location
          }
          helperText={
            !!localFormik.touched.location && localFormik.errors.location
          }
          inputProps={{ accept: ".jpg, .jpeg, .png, .pdf" }}
        />

        <div className="col-span-2">
          <Button
            size="medium"
            type="submit"
            fullWidth
            startIcon={<Icon>add</Icon>}
            onClick={() => localFormik.handleSubmit()}
          >
            Click To Add Document
          </Button>
        </div>
      </div>
      <FormHelperText className="text-center">
        Upload means of identification in .jpg, .png or .pdf format{" "}
      </FormHelperText>
    </Box>
  );
}

export default ClientXLeadLoanAddEditDocuments;
