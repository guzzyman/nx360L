import { Button, Icon, Paper, Typography } from "@mui/material";
import { DateConfig, RouteEnum } from "common/Constants";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import PageHeader from "common/PageHeader";
import { getUserErrorMessage, parseDateToString } from "common/Utils";
import { useConfirmDialog } from "react-mui-confirm";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import RecoveryManageRescheduleLoanDetailsPreview from "./RecoveryManageRescheduleLoanDetailsPreview";

export default function RecoveryManageRescheduleLoanDetails() {
  const { id } = useParams();
  const { data: templateOptionData, isLoading: templateOptionDataIsLoading } =
    nimbleX360CRMClientApi.useGetCRMClientRescheduleLoanDetailsQuery({
      id,
    });

  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirmDialog();
  const navigate = useNavigate();
  const [openReschedulePreview, setOpenReschedulePreview] = useState(false);

  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.usePostCRMClientRescheduleLoanMutation();

  const transactionDetails = [
    {
      name: "Reschedule from Installment On*",
      value:
        parseDateToString(templateOptionData?.rescheduleFromDate) || "____",
    },
    {
      name: "Reason for Rescheduling*",
      value: templateOptionData?.rescheduleReasonCodeValue?.name || "____",
    },
    {
      name: "Submitted On*",
      value:
        parseDateToString(templateOptionData?.timeline?.submittedOnDate) ||
        "____",
    },
    {
      name: "Comments*",
      value: templateOptionData?.rescheduleReasonComment || "____",
    },
    {
      name: "Installment Rescheduled to *",
      value:
        parseDateToString(
          templateOptionData?.loanTermVariationsData?.[0]?.adjustedDueDate
        ) || "____",
    },
    {
      name: "Change Repayment Date",
      value:
        parseDateToString(
          templateOptionData?.loanTermVariationsData?.[0]?.dateValue
        ) || "____",
    },

    // {
    //   name: "Introduce Mid-term grace periods",
    //   value:
    //     parseDateToString(
    //       templateOptionData?.loanTermVariationsData?.[0]?.dateValue
    //     ) || "____",
    // },
    {
      name: "Principal Grace Periods",
      value: templateOptionData?.graceOnPrincipal || "____",
    },
    {
      name: "Interest Grace Periods",
      value: templateOptionData?.graceOnInterest || "____",
    },
    // {
    //   name: "Extend Repayment Period",
    //   value:
    //     templateOptionData?.loanTermVariationsData?.graceOnInterest || "____",
    // },
    {
      name: "Number Of new Repayments",
      value: templateOptionData?.extraTerms || "____",
    },
    {
      name: "Adjust interest rates for remainder of loan",
      value: templateOptionData?.newInterestRate || "____",
    },
  ];

  const handleActivate = (id) =>
    confirm({
      title: "Are you sure you want to Approve Reschedule?",
      onConfirm: async () => {
        try {
          const payLoad = {
            dateFormat: DateConfig.HYPHEN_dd_MM_yyyy,
            locale: DateConfig.LOCALE,
            approvedOnDate: format(new Date(), DateConfig.HYPHEN_dd_MM_yyyy),
          };
          await addMutation({
            id,
            params: { command: "approve" },
            ...payLoad,
          }).unwrap();
          enqueueSnackbar(`Approved Reschedule Successfully`, {
            variant: "success",
          });
          navigate(RouteEnum.RESCHEDULE_LOAN);
        } catch (error) {
          enqueueSnackbar(
            getUserErrorMessage(error?.data?.errors) || `Undo Loan  Failed`,
            { variant: "error" }
          );
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  const handleReject = (id) =>
    confirm({
      title: "Are you sure you want to Reject Reschedule?",
      onConfirm: async () => {
        try {
          const payLoad = {
            dateFormat: DateConfig.HYPHEN_dd_MM_yyyy,
            locale: DateConfig.LOCALE,
            rejectedOnDate: format(new Date(), DateConfig.HYPHEN_dd_MM_yyyy),
          };
          await addMutation({
            id,
            params: { command: "reject" },
            ...payLoad,
          }).unwrap();
          enqueueSnackbar(`Reschedule Rejected Successfully`, {
            variant: "success",
          });
          navigate(RouteEnum.RESCHEDULE_LOAN);
        } catch (error) {
          enqueueSnackbar(
            getUserErrorMessage(error?.data?.errors) ||
              `Reschedule Reject  Failed`,
            { variant: "error" }
          );
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  return (
    <>
      <PageHeader
        title="Reschedule Loan"
        breadcrumbs={[
          {
            name: "Reschedule Loan",
            to: RouteEnum.RESCHEDULE_LOAN,
          },
          { name: "View Loan Reschedule Request" },
        ]}
      >
        <Button
          color="success"
          endIcon={<Icon>add</Icon>}
          onClick={() => handleActivate(id)}
          disabled={isLoading}
        >
          Accept
        </Button>

        <Button
          color="error"
          endIcon={<Icon>close</Icon>}
          onClick={() => handleReject(id)}
          disabled={isLoading}
        >
          Reject
        </Button>

        <Button
          disabled={isLoading}
          endIcon={<Icon>remove_red_eye</Icon>}
          onClick={() => setOpenReschedulePreview(true)}
        >
          View New Repayment Reschedule
        </Button>
      </PageHeader>
      <Paper className="p-4">
        <div className="mt-4">
          {transactionDetails.map((item, i) => (
            <div key={i} className="grid grid-cols-2 mb-2">
              <Typography className="font-bold">{item.name}</Typography>
              <Typography>{item.value}</Typography>
            </div>
          ))}
        </div>
      </Paper>

      {openReschedulePreview && (
        <RecoveryManageRescheduleLoanDetailsPreview
          open={openReschedulePreview}
          onClose={() => setOpenReschedulePreview(false)}
        />
      )}
    </>
  );
}
