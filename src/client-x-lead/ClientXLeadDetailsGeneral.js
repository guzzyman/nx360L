import { Fragment, useState } from "react";
import {
  Button,
  Icon,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
} from "@mui/material";
import { ReactComponent as ActivityDesktopSvg } from "assets/svgs/crm-client-details-activity-desktop.svg";
import { ReactComponent as ActivityMobileSvg } from "assets/svgs/crm-client-details-activity-mobile.svg";
import { ReactComponent as ActivityUSSDSvg } from "assets/svgs/crm-client-details-activity-mobile.svg";
import { ReactComponent as LoanBalanceSvg } from "assets/svgs/crm-client-details-loan-balance.svg";
import { ReactComponent as TotalSavingsSvg } from "assets/svgs/crm-client-details-savings.svg";
import { ReactComponent as InvestmentsSvg } from "assets/svgs/crm-client-details-investments.svg";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import CurrencyTypography from "common/CurrencyTypography";
import { formatDistanceToNow, format } from "date-fns";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import { UIPermissionEnum } from "common/Constants";

function ClientXLeadDetailsGeneral(props) {
  const { clientId, customerId } = props;

  const getClientSummary = nimbleX360CRMClientApi.useGetCRMClientsSummaryQuery({
    clientId,
  });

  const getClientActivities =
    nimbleX360CRMClientApi.useGetClientActivitiesQuery({
      accountNumber: customerId,
    });

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-2 mb-4">
        <Paper className="p-4">
          <Typography variant="h6" className="font-bold mb-4">
            Recent Channel Activity
          </Typography>
          <List>
            {[
              {
                IconSvg: ActivityDesktopSvg,
                label: "Logged in the web portal",
                value:
                  getClientActivities.data?.find(
                    (e) => e.activationChannel.toLowerCase() === "web"
                  )?.timestampCreatedDate || "",
              },
              {
                IconSvg: ActivityMobileSvg,
                label: "Logged in the mobile app",
                value:
                  getClientActivities.data?.find(
                    (e) => e.activationChannel.toLowerCase() === "mobile"
                  )?.timestampCreatedDate || "",
              },
              {
                IconSvg: ActivityUSSDSvg,
                label: "Logged in the USSD",
                value:
                  getClientActivities.data?.find(
                    (e) => e.activationChannel.toLowerCase() === "ussd"
                  )?.timestampCreatedDate || "",
              },
            ].map(({ IconSvg, label, value }) => (
              <ListItem
                disableGutters
                className="items-center flex-wrap gap-3"
                key={label}
              >
                <IconSvg />
                <div className="flex-1 flex flex-wrap">
                  <Typography>{label}</Typography>
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <Typography>
                      {/* {dfnFormatDistanceToNow(value)} */}
                      {value ? (
                        <>
                          {format(new Date(value), "PPpp")} - (
                          {formatDistanceToNow(new Date(value))} ago)
                        </>
                      ) : (
                        "Not yet activated"
                      )}
                    </Typography>
                    <Icon className="text-primary-main">alarm</Icon>
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
          <AuthUserUIPermissionRestrictor
            permissions={[UIPermissionEnum.READ_ProgramDetails]}
          >
            <div className="flex justify-center">
              <Button endIcon={<Icon>chevron_right</Icon>}>
                View All Activities
              </Button>
            </div>
          </AuthUserUIPermissionRestrictor>
        </Paper>
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.READ_TxnRunningBalances]}
        >
          <Paper className="p-4">
            <Typography variant="h6" className="font-bold mb-4">
              Products
            </Typography>
            <div className="flex flex-col sm:flex-row">
              {[
                {
                  IconSvg: LoanBalanceSvg,
                  label: "Last Loan Balance",
                  value: getClientSummary?.data?.summaries?.[2]?.balance || 0,
                },
                {
                  IconSvg: TotalSavingsSvg,
                  label: "Total Savings",
                  value: getClientSummary?.data?.summaries?.[0]?.balance || 0,
                },
                {
                  IconSvg: InvestmentsSvg,
                  label: "Investments",
                  value: getClientSummary?.data?.summaries?.[1]?.balance || 0,
                },
              ].map(({ IconSvg, label, value }, index) => (
                <Fragment key={label}>
                  {!!index && <Divider orientation="vertical" flexItem />}
                  <div className="flex flex-col items-center flex-1">
                    <IconSvg />
                    <Typography
                      color="textSecondary"
                      className="text-center mt-2"
                    >
                      {label}
                    </Typography>
                    <CurrencyTypography variant="h6" className="text-center">
                      {value}
                    </CurrencyTypography>
                  </div>
                </Fragment>
              ))}
            </div>
          </Paper>
        </AuthUserUIPermissionRestrictor>
      </div>
    </>
  );
}

export default ClientXLeadDetailsGeneral;
