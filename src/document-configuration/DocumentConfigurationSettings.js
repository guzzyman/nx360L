import { LoadingButton } from "@mui/lab";
import { Button, Checkbox, FormControlLabel, Paper } from "@mui/material";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import PageHeader from "common/PageHeader";
import { getCheckFieldFormikProps } from "common/Utils";
import { useFormik } from "formik";
import useDataRef from "hooks/useDataRef";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { nxDocumentConfigurationApi } from "./DocumentConfigurationStoreQuerySlice";

function DocumentConfigurationSettings(props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();

  const [
    updateDocumentConfigurationSettingsMutation,
    updateDocumentConfigurationSettingsMutationResult,
  ] =
    nxDocumentConfigurationApi.useUpdateDocumentConfigurationSettingsMutation();

  const settingsQueryResults =
    nxDocumentConfigurationApi.useGetDocumentConfigurationSettingsQuery(id, {
      skip: !id,
    });

  const settings = settingsQueryResults?.data;
  const { initialFormikValues } = useMemo(
    () =>
      settings?.codeData?.reduce(
        (acc, curr) => {
          acc.normalizedCodeData[curr.name] = curr;
          acc.initialFormikValues[curr.name] = !!curr.systemDefined;
          return acc;
        },
        { normalizedCodeData: {}, initialFormikValues: {} }
      ) || {},
    [settings?.codeData]
  );

  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      try {
        await updateDocumentConfigurationSettingsMutation({
          id,
          settings: values,
        }).unwrap();
        enqueueSnackbar(`Settings Updated Successful`, { variant: "success" });
      } catch (error) {
        enqueueSnackbar(`Failed to Update Settings`, { variant: "error" });
      }
    },
  });

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (initialFormikValues) {
      dataRef.current.formik.setValues({ ...initialFormikValues });
    }
  }, [dataRef, initialFormikValues]);

  return (
    <>
      <PageHeader
        title="Document Configuration Settings"
        breadcrumbs={[
          {
            name: "Document Configurations",
            to: RouteEnum.DOCUMENT_CONFIGURATIONS,
          },
          {
            name: "Document Configuration",
            to: generatePath(RouteEnum.DOCUMENT_CONFIGURATIONS_EDIT, { id }),
          },
          { name: "Settings" },
        ]}
      />
      <LoadingContent
        loading={settingsQueryResults.isLoading}
        error={settingsQueryResults.isError}
        onReload={settingsQueryResults.refetch}
      >
        {() => (
          <>
            <Paper
              className="p-4"
              component="form"
              onSubmit={formik.handleSubmit}
            >
              <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                {Object.keys(formik.values).map((key) => (
                  <FormControlLabel
                    key={key}
                    label={key}
                    control={
                      <Checkbox {...getCheckFieldFormikProps(formik, key)} />
                    }
                  />
                ))}
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
                    updateDocumentConfigurationSettingsMutationResult.isLoading
                  }
                  loading={
                    updateDocumentConfigurationSettingsMutationResult.isLoading
                  }
                  loadingPosition="end"
                  endIcon={<></>}
                >
                  Submit
                </LoadingButton>
              </div>
            </Paper>
          </>
        )}
      </LoadingContent>
    </>
  );
}

export default DocumentConfigurationSettings;
