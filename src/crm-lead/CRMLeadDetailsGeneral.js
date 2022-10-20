import { Button, Icon, Paper, Typography, List, ListItem } from "@mui/material";
import { ReactComponent as ActivityDesktopSvg } from "assets/svgs/crm-client-details-activity-desktop.svg";
import { ReactComponent as ActivityMobileSvg } from "assets/svgs/crm-client-details-activity-mobile.svg";
import { ReactComponent as ActivityUSSDSvg } from "assets/svgs/crm-client-details-activity-mobile1.svg";
import dfnFormatDistanceToNow from "date-fns/formatDistanceToNow";

function CRMLeadDetailsGeneral(props) {
  const {} = props;

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
              {
                IconSvg: ActivityUSSDSvg,
                label: "Logged in the USSD",
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
      </div>
    </>
  );
}

export default CRMLeadDetailsGeneral;
