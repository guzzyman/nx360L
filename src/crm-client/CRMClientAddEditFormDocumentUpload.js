import { useRef, useState } from "react";
import {
  Button,
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import FileOpenButton from "common/FileOpenButton";
import FileUploadInput from "common/FileUploadInput";
import { getBase64, removeBase64Meta, generateUUIDV4 } from "common/Utils";
import { nimbleX360Api } from "common/StoreQuerySlice";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { format } from "date-fns/esm";

import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import { useMemo } from "react";
import { dateLocaleFormat } from "common/Constants";
import { A_YEAR_FROM_NOW } from "./CRMClientConstants";

function CRMClientAddEditFormDocumentUpload({ formik, isEdit }) {
  const documentRef = useRef();
  const passPortPhotographRef = useRef();

  const [clientConfiguration, setClientConfiguration] = useState(1);
  const [clientConfigurationCodes, setClientConfigurationCodes] = useState("");

  const { data: clientConfigurationCodesList } =
    nimbleX360CRMClientApi.useGetCRMClientConfigurationCodesQuery(
      {
        cdlConfigurationId: clientConfiguration,
      },
      { skip: !clientConfiguration }
    );

  const { data: clientIdentifierList } = nimbleX360Api.useGetCodeValuesQuery(
    useMemo(() => clientConfigurationCodes, [clientConfigurationCodes]),
    { skip: !clientConfigurationCodes }
  );

  const [documentData, setDocumentData] = useState({
    attachmentLocation: "",
    attachmentFileName: "",
    attachmentName: "",
    attachmentSize: "",
    attachmentType: "",
    attachmentDescription: "",
    expiryDate: "",
    documentTypeId: "",
  });

  const handleDocumentChange = (e, i) => {
    let file = e.target.files[0];

    getBase64(file)
      .then((result) => {
        console.log("result", result);
        setDocumentData((prevState) => ({
          ...prevState,
          attachmentLocation: removeBase64Meta(result),
          attachmentFileName: file.name,
          attachmentName: file.name,
          attachmentSize: file.size,
          attachmentType: file.type,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePassPortPhotographChange = (e) => {
    let file = e.target.files[0];

    getBase64(file)
      .then((result) => {
        formik.setFieldValue("avatar", result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const activeDocumentType = clientIdentifierList?.find(
    (e) => e.id === documentData?.documentTypeId
  );

  const handleAdddDocument = () => {
    const clientIdentifierLength = formik?.values?.clientIdentifiers?.length;
    const i = clientIdentifierLength >= 1 ? clientIdentifierLength : 0;

    formik.setFieldValue(
      `clientIdentifiers.${[i]}.documentKey`,
      `${generateUUIDV4()}-${new Date().getTime()}`
    );
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.documentTypeId`,
      documentData.documentTypeId
    );
    formik.setFieldValue(`clientIdentifiers.${[i]}.status`, "ACTIVE");
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.expiryDate`,
      activeDocumentType?.mandatory
        ? new Date(documentData.expiryDate)
        : A_YEAR_FROM_NOW || A_YEAR_FROM_NOW
    );
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.dateFormat`,
      dateLocaleFormat.DATE_FORMAT
    );
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.locale`,
      dateLocaleFormat.LOCALE
    );
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.attachment.fileName`,
      documentData.attachmentFileName
    );
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.attachment.name`,
      documentData.attachmentName
    );
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.attachment.size`,
      documentData.attachmentSize
    );
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.attachment.type`,
      documentData.attachmentType
    );
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.attachment.location`,
      documentData.attachmentLocation
    );
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.attachment.location`,
      documentData.attachmentLocation
    );
    formik.setFieldValue(
      `clientIdentifiers.${[i]}.attachment.description`,
      documentData.attachmentDescription
    );

    // Reset input
    setClientConfiguration("");
    setClientConfigurationCodes("");
    setDocumentData({
      attachmentFileName: "",
      attachmentName: "",
      attachmentSize: "",
      attachmentType: "",
      attachmentDescription: "",
      expiryDate: "",
      documentTypeId: "",
    });
    documentRef.current.value = null;
  };

  const handleDocumentEditChange = (e, i) => {
    let file = e.target.files[0];

    getBase64(file)
      .then((result) => {
        formik.setFieldValue(
          `clientIdentifiers.${[i]}.attachment.location`,
          removeBase64Meta(result)
        );
        formik.setFieldValue(
          `clientIdentifiers.${[i]}.attachment.fileName`,
          file.name
        );
        formik.setFieldValue(
          `clientIdentifiers.${[i]}.attachment.size`,
          file.size
        );
        formik.setFieldValue(
          `clientIdentifiers.${[i]}.attachment.name`,
          file.name
        );
        formik.setFieldValue(
          `clientIdentifiers.${[i]}.attachment.type`,
          file.type
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [updateDocument, setUpdateDocument] = useState({});

  return (
    <div>
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div className="max-w-3xl">
          <div>
            <Typography variant="h5">
              <b>Document Upload</b>
            </Typography>
            <div
              class="bg-pink-100 rounded-sm text-pink-600 p-4 mt-3"
              role="alert"
            >
              <p>
                Ensure all documents are uploaded and tagged properly. Files
                should be in .jpg, .png or .pdf formats.
              </p>
            </div>
          </div>

          <Box mt={5}>
            <Box>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} md={5}>
                  <FileUploadInput
                    fileRef={passPortPhotographRef}
                    label="Passport photograph"
                    fullWidth
                    onChange={handlePassPortPhotographChange}
                    error={!!formik.touched.avatar && !!formik.errors.avatar}
                    helperText={!!formik.touched.avatar && formik.errors.avatar}
                    inputProps={{ accept: ".jpg, .jpeg, .png" }}
                  />
                </Grid>

                <Grid xs={12} md={2} item>
                  <FileOpenButton fileRef={passPortPhotographRef} />
                </Grid>
              </Grid>
            </Box>

            <div className="flex justify-center flex-col  rounded-lg p-5 mt-10 bg-gray-100">
              <Box className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FileUploadInput
                  fileRef={documentRef}
                  label="Customer Document*"
                  fullWidth
                  onChange={handleDocumentChange}
                  inputProps={{ accept: ".jpg, .jpeg, .png, .pdf" }}
                />

                <TextField
                  select
                  onChange={(e) => {
                    const { value } = e.target;
                    setClientConfigurationCodes(value);
                  }}
                  value={clientConfigurationCodes}
                  fullWidth
                  label="Document Type"
                >
                  {clientConfigurationCodesList?.codeData &&
                    clientConfigurationCodesList?.codeData
                      ?.filter((e) => e.systemDefined)
                      ?.map((document, i) => (
                        <MenuItem key={i} value={document.id}>
                          {document.name}
                        </MenuItem>
                      ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Document List"
                  value={documentData?.documentTypeId || ""}
                  onChange={(e) => {
                    const { value } = e.target;
                    setDocumentData((prevState) => ({
                      ...prevState,
                      documentTypeId: value,
                    }));
                  }}
                >
                  {clientIdentifierList &&
                    clientIdentifierList.map((document, i) => (
                      <MenuItem
                        key={i}
                        value={document.id}
                        onClick={() => {
                          setDocumentData((prevState) => ({
                            ...prevState,
                            attachmentDescription: document.name,
                          }));
                        }}
                      >
                        {document.name}
                      </MenuItem>
                    ))}
                </TextField>

                {activeDocumentType?.mandatory && (
                  <DesktopDatePicker
                    label="Expiry Date*"
                    inputFormat="dd/MM/yyyy"
                    onChange={(newValue) => {
                      setDocumentData((prevState) => ({
                        ...prevState,
                        expiryDate: newValue,
                      }));
                    }}
                    disablePast
                    value={documentData.expiryDate}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                )}

                {/* <FileOpenButton fileRef={documentRef} /> */}
              </Box>

              <Button
                className="mt-3"
                disabled={
                  (!documentData.expiryDate && activeDocumentType?.mandatory) ||
                  !documentData.attachmentLocation ||
                  !documentData.documentTypeId
                }
                startIcon={<Icon>add</Icon>}
                onClick={handleAdddDocument}
              >
                Add Document
              </Button>

              <FormHelperText className="text-center">
                Upload a means of identification, this could be Drivers License,
                National ID or International Passport in .jpg, .png or .pdf
                format{" "}
              </FormHelperText>
            </div>

            <div className="mt-10">
              {formik.values?.clientIdentifiers &&
                formik.values?.clientIdentifiers?.map(
                  (clientIdentifier, index) => (
                    <Box className="m-7" key={index}>
                      <div className="grid grid-cols-2 max-w-md items-end">
                        <Typography className="uppercase font-bold">
                          {clientIdentifier?.attachment?.description}{" "}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() =>
                            setUpdateDocument((prev) => ({
                              ...prev,
                              [index]: !updateDocument?.[index],
                            }))
                          }
                        >
                          Update
                        </Button>
                      </div>

                      <div className="mt-3 flex gap-3 items-center">
                        {updateDocument?.[index] && (
                          <FileUploadInput
                            label={`${
                              clientIdentifier?.attachment?.description ||
                              "Document"
                            }`}
                            onChange={(e) => handleDocumentEditChange(e, index)}
                            inputProps={{ accept: ".jpg, .jpeg, .png, .pdf" }}
                          />
                        )}

                        {/* {!isEdit && (
                          <IconButton
                            onClick={() => {
                              let clientIdentifiersList =
                                formik?.values?.clientIdentifiers;
                              delete clientIdentifiersList[index];
                              formik.setFieldValue(
                                `clientIdentifiers`,
                                clientIdentifiersList.filter(
                                  (el) => el !== undefined
                                )
                              );
                            }}
                            color="warning"
                          >
                            <Icon>cancel</Icon>
                          </IconButton>
                        )} */}
                      </div>
                    </Box>
                  )
                )}
            </div>
          </Box>
        </div>
      </Paper>
    </div>
  );
}

export default CRMClientAddEditFormDocumentUpload;
