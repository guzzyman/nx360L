import { DateConfig, RouteEnum, UIPermissionEnum } from "common/Constants";
import { useParams } from "react-router";
import ClientXLeadDetails from "client-x-lead/ClientXLeadDetails";
import { nimbleX360CRMEmployerApi } from "./CRMEmployerStoreQuerySlice";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import ClientXLeadDetailsGeneral from "client-x-lead/ClientXLeadDetailsGeneral";
import CRMEmployerStatusChip from "./CRMEmployerStatusChip";
import CRMEmployerProfile from "./CRMEmployerProfile";
import CRMEmployerWalletlist from "./CRMEmployerWalletlist";
import ClientXLeadDetailsInteractions from "client-x-lead/ClientXLeadDetailsInteractions";
import { userTypeEnum } from "client-x-lead-x-request/ClientXLeadXRequestConstants";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useConfirmDialog } from "react-mui-confirm";
import { useSnackbar } from "notistack";
import CRMEmployerLoanProductConfiglist from "./CRMEmployerLoanProductConfiglist";
import { useEffect, useMemo } from "react";
import CRMEmployerDetailsGeneral from "./CRMEmployerDetailsGeneral";
import CRMEmployerBranches from "./CRMEmployerBranches";
import { useDropzone } from "react-dropzone";
import useToggle from "hooks/useToggle";
import DynamicTable from "common/DynamicTable";
import useTable from "hooks/useTable";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import EmployerDetailDeductionReport from "employer-detail-deduction-report/EmployerDetailDeductionReport";

function CRMEmployerDetails(props) {
  const { id } = useParams();
  const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();

  const [isUploadErrorDialog, toggleUploadErrorDialog, setUploadErrorDialog] =
    useToggle();

  const clientQueryResult = nimbleX360CRMEmployerApi.useGetCRMEmployerQuery(id);

  const branch = !!clientQueryResult?.data?.parent?.id;

  const clientImageQueryResult =
    nimbleX360CRMClientApi.useGetCRMClientImageQuery(
      useMemo(
        () => clientQueryResult?.data?.businessId,
        [clientQueryResult?.data?.businessId]
      ),
      { skip: !clientQueryResult?.data?.businessId }
    );

  const [updateEmployer] =
    nimbleX360CRMEmployerApi.useUpdateCRMEmployerMutation();

  const [
    downloadEmployerEDRTemplateMutation,
    // downloadEmployerEDRTemplateMutationResult,
  ] = nimbleX360CRMEmployerApi.useDownloadEmployerEDRTemplateMutation();

  const [uploadEmployerEDRMutation, uploadEmployerEDRMutationResult] =
    nimbleX360CRMEmployerApi.useUploadEmployerEDRMutation();

  const uploadResult = uploadEmployerEDRMutationResult.data;
  const isUploadComplete = !!uploadResult?.completed;
  const uploadErrorData = useMemo(
    () =>
      isUploadComplete && uploadResult?.errorLog
        ? JSON.parse(uploadResult?.errorLog)
        : undefined,
    [isUploadComplete, uploadResult?.errorLog]
  );

  const uploadErrorTableInstance = useTable({
    data: uploadErrorData,
    columns: uploadErrorColumns,
  });

  useEffect(() => {
    setUploadErrorDialog(!!uploadErrorData);
  }, [setUploadErrorDialog, uploadErrorData]);

  const handleActivateEmployer = () =>
    confirm({
      title: "Are you sure you want to Activate Employer?",
      onConfirm: async () => {
        try {
          await updateEmployer({ id, active: true }).unwrap();
          enqueueSnackbar(`Employer Activation Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Employer Activation Failed`, { variant: "error" });
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  const handleDeactiveEmployer = () =>
    confirm({
      title: "Are you sure you want to Deactivate Employer?",
      onConfirm: async () => {
        try {
          await updateEmployer({ id, active: false }).unwrap();
          enqueueSnackbar(`Employer Deactivate Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Employer Deactivate Failed`, { variant: "error" });
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  async function handleDownloadEmployerEDRTemplate() {
    try {
      await downloadEmployerEDRTemplateMutation({
        employerId: id,
        fileName: `${clientQueryResult?.data?.name || ""} EDR Template`,
        locale: DateConfig.LOCALE,
        dateFormat: "MM YYYY",
      }).unwrap();
    } catch (error) {
      enqueueSnackbar("Failed to Download EDR Template", { variant: "error" });
    }
  }

  const dropzone = useDropzone({
    accept: ".xls",
    onDropAccepted: (files) => {
      confirm({
        title: "Are you sure you want to upload  EDR?",
        cancelButtonProps: {
          variant: "outlined",
          color: "error",
        },
        onConfirm: async () => {
          try {
            const data = await uploadEmployerEDRMutation({
              file: files[0],
              employerId: id,
              locale: DateConfig.LOCALE,
              dateFormat: "MM YYYY",
            }).unwrap();
            if (data?.errorLog) {
              throw new Error("Failed to upload EDR");
            }
            enqueueSnackbar(
              data?.defaultUserMessage || `EDRs Upload Successful`,
              {
                variant: "success",
              }
            );
          } catch (error) {
            if (error.data) {
              error.data?.errors?.forEach((err) =>
                enqueueSnackbar(err.defaultUserMessage, { variant: "error" })
              );
            } else {
              enqueueSnackbar(`Failed to Upload EDRs`, { variant: "error" });
            }
          }
        },
      });
    },
  });

  return (
    <ClientXLeadDetails
      defaultTab={1}
      id={id}
      breadcrumbName="Employers"
      leads
      breadcrumbTo={RouteEnum.CRM_EMPLOYER}
      imageQueryResult={clientImageQueryResult}
      detailsQueryResult={clientQueryResult}
      name={(data) => data?.name}
      summary={(data) => [
        {
          label: "Employer Type",
          value: data?.clientType?.name,
        },
        {
          label: "Industry",
          value: data?.industry?.name,
        },
        {
          label: "Sector",
          value: data?.sector?.name,
        },
        {
          label: "Employer Status",
          value: <CRMEmployerStatusChip status={data?.active} />,
        },
      ]}
      actions={
        <>
          <AuthUserUIPermissionRestrictor
            permissions={[UIPermissionEnum.PROCESS_EDR]}
          >
            <Button
              endIcon={<Icon>download</Icon>}
              variant="outlined"
              onClick={handleDownloadEmployerEDRTemplate}
            >
              Download EDR Template
            </Button>
          </AuthUserUIPermissionRestrictor>
          <AuthUserUIPermissionRestrictor
            permissions={[UIPermissionEnum.PROCESS_REPAYMENT_EDR]}
          >
            <div {...dropzone.getRootProps()}>
              <input {...dropzone.getInputProps()} />
              <LoadingButton
                variant="outlined"
                endIcon={<Icon>upload</Icon>}
                disabled={uploadEmployerEDRMutationResult.isLoading}
                loading={uploadEmployerEDRMutationResult.isLoading}
                loadingPosition="end"
              >
                Upload EDR
              </LoadingButton>
            </div>
            <Dialog open={!!isUploadErrorDialog} fullWidth>
              <DialogTitle>EDR Upload Errors</DialogTitle>
              <DialogContent>
                <DynamicTable instance={uploadErrorTableInstance} />;
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={toggleUploadErrorDialog}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </AuthUserUIPermissionRestrictor>
          {!branch &&
            (clientQueryResult?.data?.active ? (
              <Button
                endIcon={<Icon>chevron_right</Icon>}
                variant="outlined"
                color="warning"
                onClick={handleDeactiveEmployer}
              >
                Deactivate
              </Button>
            ) : (
              <Button
                endIcon={<Icon>chevron_right</Icon>}
                variant="outlined"
                onClick={handleActivateEmployer}
              >
                Activate
              </Button>
            ))}
        </>
      }
      tabs={(data) => [
        !branch && {
          name: "GENERAL",
          content: (
            <CRMEmployerDetailsGeneral
              customerId={data?.moreInfo?.clients?.accountNo || ""}
              userType={userTypeEnum.EMPLOYER}
              clientId={data?.id}
              businessId={data?.businessId}
            />
          ),
        },
        (branch || !branch) && {
          name: "PROFILE",
          content: <CRMEmployerProfile client={data} />,
        },
        !branch && { name: "BRANCHES", content: <CRMEmployerBranches /> },
        !branch && {
          name: "INTERACTIONS",
          content: (
            <ClientXLeadDetailsInteractions
              customerId={data?.businessId || ""}
              userType={userTypeEnum.EMPLOYER}
            />
          ),
        },
        !branch && {
          name: "WALLET",
          content: <CRMEmployerWalletlist businessId={data?.businessId} />,
        },
        !branch && {
          name: "LOAN PRODUCT CONFIG",
          content: (
            <CRMEmployerLoanProductConfiglist businessId={data?.businessId} />
          ),
        },
        {
          name: "EDR REPORTS",
          content: <EmployerDetailDeductionReport {...{ employerId: id }} />,
        },
      ]}
    />
  );
}

export default CRMEmployerDetails;

const uploadErrorColumns = [{ Header: "Message", accessor: "message" }];
