import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import BackButton from "common/BackButton";
import { DateConfig, RouteEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import {
  getCheckFieldFormikProps,
  getTextFieldFormikProps,
} from "common/Utils";
import { useFormik } from "formik";
import useDataRef from "hooks/useDataRef";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useNavigate, useParams, generatePath } from "react-router-dom";
import * as yup from "yup";
import { nxDocumentConfigurationApi } from "./DocumentConfigurationStoreQuerySlice";
import { DocumentGlobalEntityTypeOptions } from "./DocumentConfigurationConstants";

function DocumentConfigurationAddEdit(props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();

  const isEdit = !!id;

  const documentConfigurationQueryResult =
    nxDocumentConfigurationApi.useGetDocumentConfigurationQuery(id, {
      skip: !id,
    });

  const documentConfiguration = documentConfigurationQueryResult.data;

  const [
    addDocumentConfigurationMutation,
    addDocumentConfigurationMutationResult,
  ] = nxDocumentConfigurationApi.useAddDocumentConfigurationMutation();

  const [
    updateDocumentConfigurationMutation,
    updateDocumentConfigurationMutationResult,
  ] = nxDocumentConfigurationApi.useUpdateDocumentConfigurationMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      entityEnum: 1,
      globalEntityType: "",
      description: "",
      disabled: false,
      locale: DateConfig.LOCALE,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: yup.object({
      name: yup.string().label("Name").trim().required(),
      globalEntityType: yup.number().label("Entity Type").required(),
      description: yup.string().label("Description").trim().optional(),
      disabled: yup.bool().label("Enabled").notRequired(),
    }),
    onSubmit: async (values) => {
      const func = isEdit
        ? updateDocumentConfigurationMutation
        : addDocumentConfigurationMutation;
      try {
        await func(values).unwrap();
        enqueueSnackbar(
          `Configuration ${isEdit ? "Updated" : "Added"} Successful`,
          {
            variant: "success",
          }
        );
        navigate(RouteEnum.DOCUMENT_CONFIGURATIONS);
      } catch (error) {
        enqueueSnackbar(
          `Failed to ${isEdit ? "Update" : "Add"} Configuration`,
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
        id: documentConfiguration?.id,
        name: documentConfiguration?.name || values?.name,
        entityEnum: documentConfiguration?.entityEnumId || values?.entityEnum,
        globalEntityType:
          documentConfiguration?.globalEntityTypeId || values?.globalEntityType,
        description: documentConfiguration?.description || values?.description,
        disabled:
          typeof documentConfiguration?.disabled === "boolean"
            ? documentConfiguration?.disabled
            : values?.disabled,
        locale: DateConfig.LOCALE,
      });
    }
  }, [
    dataRef,
    documentConfiguration?.description,
    documentConfiguration?.disabled,
    documentConfiguration?.entityEnumId,
    documentConfiguration?.globalEntityTypeId,
    documentConfiguration?.id,
    documentConfiguration?.name,
    isEdit,
  ]);

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        title={`${isEdit ? "Update" : "Add"} Document Configuration`}
        breadcrumbs={[
          {
            name: "Document Configurations",
            to: RouteEnum.DOCUMENT_CONFIGURATIONS,
          },
          { name: "Document Configuration" },
        ]}
      />
      <div className="w-full mx-auto" style={{ maxWidth: 600 }}>
        <div className="flex items-center justify-end gap-4 mb-4">
          <Button
            onClick={() =>
              navigate(
                generatePath(RouteEnum.DOCUMENT_CONFIGURATIONS_SETTINGS, {
                  id,
                })
              )
            }
          >
            Edit Settings
          </Button>
        </div>
        <Paper className="p-4" component="form" onSubmit={formik.handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <TextField
              fullWidth
              label="Name"
              {...getTextFieldFormikProps(formik, "name")}
              className="sm:col-span-2"
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              {...getTextFieldFormikProps(formik, "description")}
              className="sm:col-span-2"
            />
            <TextField
              fullWidth
              select
              label="Entity Type"
              displayEmpty
              {...getTextFieldFormikProps(formik, "globalEntityType")}
            >
              {DocumentGlobalEntityTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              label="Disabled"
              control={
                <Checkbox {...getCheckFieldFormikProps(formik, "disabled")} />
              }
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <Button
              variant="outlined"
              color="error"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              disabled={
                addDocumentConfigurationMutationResult.isLoading ||
                updateDocumentConfigurationMutationResult.isLoading
              }
              loading={
                addDocumentConfigurationMutationResult.isLoading ||
                updateDocumentConfigurationMutationResult.isLoading
              }
              loadingPosition="end"
              endIcon={<></>}
            >
              {isEdit ? "Update" : "Submit"}
            </LoadingButton>
          </div>
        </Paper>
      </div>
    </>
  );
}

export default DocumentConfigurationAddEdit;
