import { Button, Paper, Typography, Icon, Box, FormHelperText, IconButton } from "@mui/material";
import PageHeader from "common/PageHeader";
import { DateConfig, RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import { useSnackbar } from "notistack";
import FileUploadInput from "common/FileUploadInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { parseDateToString, urlSearchParamsExtractor } from "common/Utils";
import { useMemo, useRef } from "react";
import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import { nimbleX360CRMLeadApi } from "./CRMLeadStoreQuerySlice";
import { useSearchParams } from "react-router-dom";
import useDebouncedState from "hooks/useDebouncedState";
import { LEAD_TABLE_PAGINATION_DEFAULT } from "./CRMLeadConstant";
import CRMLeadStatusChip from "./CRMLeadStatusChip";
import { LoadingButton } from "@mui/lab";

function CRMLeadUploadForm(props) {

  const { enqueueSnackbar } = useSnackbar();

  const requestAttachmentRef = useRef();

  const [searchParams, setSearchParams] = useSearchParams();

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        ...LEAD_TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { q, offset, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const [
    downloadLeadTemplateMutation,
    downloadLeadTemplateMutationResult,
  ] = nimbleX360CRMLeadApi.useDownloadLeadTemplateMutation();

  const formik = useFormik({
    initialValues: {
      file: null,
      locale: "en",
      dateFormat: DateConfig.FORMAT_JOURNALENTRIES,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object({
    }),
    onSubmit: async (values) => {
      try {
        await addMutation({ ...values }).unwrap();
        enqueueSnackbar("Lead Template Uploaded Successfully",
          {
            variant: "success",
          }
        );
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.length ? (
            <div>
              {error?.data?.errors?.map((error, key) => (
                <Typography key={key}>{error?.defaultUserMessage}</Typography>
              ))}
            </div>
          ) : "Lead Template Upload Failed!",
          { variant: "error" }
        );
      }
    },
  });

  const handlerequestAttachmentChange = async (e) => {
    try {
      let file = e.target.files[0];
      formik.setFieldValue("file", file);
    } catch (error) {
      enqueueSnackbar(`Failed to attach files`, { variant: "error" });
    }
  };

  async function handleDownloadLeadTemplate() {
    try {
      await downloadLeadTemplateMutation({
        locale: 'en',
        dateFormat: DateConfig.FORMAT_JOURNALENTRIES,
        legalFormType: 'CLIENTS_PERSON',
        officeId: 1
      });
    } catch (error) {
      enqueueSnackbar("Failed to Download Lead Template", { variant: "error" });
    }
  }

  const documentColumn = useMemo(() => [
    { Header: "Name", accessor: "name", width: 450 },
    { Header: "Import Time", accessor: (row) => `${parseDateToString(row.importTime)}` },
    { Header: "End Time", accessor: (row) => `${parseDateToString(row.endTime)}` },
    { Header: "Completed", accessor: (row) => <CRMLeadStatusChip status={row.completed} /> },
    { Header: "Total Records", accessor: "totalRecords" },
    { Header: "Success Count", accessor: "successCount" },
    { Header: "Failure Count", accessor: "failureCount" },
    {
      Header: "Download", accessor: (row) =>
        row?.completed ? (<div className="flex items-center">
          <IconButton size="small"
            onClick={() => {
              const link = document.createElement("a");
              link.href = `${process.env.REACT_APP_API_URL}/imports/downloadOutputTemplate?importDocumentId=${row.documentId}&tenantIdentifier=default`;
              link.click();
            }}
          >
            <Icon>cloud_download</Icon>
          </IconButton>
        </div>) : (<></>),
    },
  ], []);

  const { data, isLoading, isError, refetch } = nimbleX360CRMLeadApi.useGetImportedDocumentListQuery();
  const [addMutation, { }] = nimbleX360CRMLeadApi.useUploadtemplateMutation();

  const tableInstance = useTable({
    columns: documentColumn,
    data: data,
    manualPagination: true,
    hideRowCounter: true,
  });

  return <>
    <PageHeader
      title="Import Leads"
      breadcrumbs={[
        { name: "CRM", to: RouteEnum.DASHBOARD },
        { name: "Leads", to: RouteEnum.CRM_LEADS },
        {
          name: "Import Leads",
        },
      ]}
    />
    <LoadingContent
      loading={isLoading}
      error={isError}
      onReload={refetch}
    >
      {() => (
        <div className="max-w-full flex justify-center">
          <div className="w-full">
            <Paper className="max-w-full p-4 md:p-8 mb-4 item">
              <>
                <Typography variant="h6" className="font-bold">
                  Lead Template
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Use the button below to donwload lead(s) template.
                </Typography>
              </>
              <>
                <Button onClick={handleDownloadLeadTemplate}><Icon className="mr-2">cloud_download</Icon> Download lead template</Button>
              </>
            </Paper>
            <Paper className="max-w-full p-4 md:p-8 mb-4 item">
              <>
                <Typography variant="h6" className="font-bold">
                  Import Leads
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Use the upload field below to bulk upload/import leads.
                </Typography>
              </>
              <>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <Box className="col-span-1">
                    <FileUploadInput
                      fileRef={requestAttachmentRef}
                      label="Select Attachment"
                      onChange={handlerequestAttachmentChange}
                      fullWidth
                      error={!!formik.touched.file && !!formik.errors.file}
                      helperText={
                        !!formik.touched.file && formik.errors.file
                      }
                      inputProps={{
                        accept: ".xls, .xlxs",
                      }}
                    />
                    <FormHelperText>
                      Upload attachment with the following file format .xls, .xlxs,
                    </FormHelperText>
                    <LoadingButton className="mt-4" loading={isLoading} onClick={formik.handleSubmit}>
                      <Icon className="mr-2">cloud_upload</Icon> Upload leads
                    </LoadingButton>
                  </Box>

                </div>
              </>
              {/* <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                            </div> */}
            </Paper>
            <Paper className="max-w-full p-4 md:p-8 mb-4 item">
              <>
                <Typography variant="h6" className="font-bold mb-5">
                  Documents
                </Typography>
              </>
              <>
                <DynamicTable
                  instance={tableInstance}
                  loading={isLoading}
                  error={isError}
                  onReload={refetch}
                />
              </>
            </Paper>
          </div>
        </div>
      )}
    </LoadingContent>
  </>
}

export default CRMLeadUploadForm;