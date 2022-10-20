import { Fragment } from "react";
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
import { ReactComponent as LoanBalanceSvg } from "assets/svgs/crm-client-details-loan-balance.svg";
import { ReactComponent as TotalSavingsSvg } from "assets/svgs/crm-client-details-savings.svg";
import { ReactComponent as InvestmentsSvg } from "assets/svgs/crm-client-details-investments.svg";
import dfnFormatDistanceToNow from "date-fns/formatDistanceToNow";

function CRMClientDetailsGeneral(props) {

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
                value: new Date(),
              },
              {
                IconSvg: ActivityMobileSvg,
                label: "Logged in the mobile app",
                value: new Date(),
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
                    <Typography>{dfnFormatDistanceToNow(value)}</Typography>
                    <Icon className="text-primary-main">alarm</Icon>
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
          <div className="flex justify-center">
            <Button endIcon={<Icon>chevron_right</Icon>}>
              View All Activities
            </Button>
          </div>
        </Paper>
        <Paper className="p-4">
          <Typography variant="h6" className="font-bold mb-4">
            Products
          </Typography>
          <div className="flex flex-col sm:flex-row">
            {[
              {
                IconSvg: LoanBalanceSvg,
                label: "Last Loan Balance",
                value: 30000,
              },
              {
                IconSvg: TotalSavingsSvg,
                label: "Total Savings",
                value: 30000,
              },
              {
                IconSvg: InvestmentsSvg,
                label: "Investments",
                value: 30000,
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
                  <Typography variant="h6" className="text-center">
                    {value}
                  </Typography>
                </div>
              </Fragment>
            ))}
          </div>
        </Paper>
      </div>
    </>
  );
}

export default CRMClientDetailsGeneral;