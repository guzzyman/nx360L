import {
  Avatar,
  Paper,
  Typography,
  Button,
  Icon,
  Modal,
  Link,
} from "@mui/material";
import { CalendarPicker } from "@mui/lab";
import { ReactComponent as DashboardWelcomeSvg } from "assets/svgs/dashboard-welcome.svg";
import { ReactComponent as DashboardCustomerSvg } from "assets/svgs/dashboard-customer-creation.svg";
import { ReactComponent as DashboardLeadCreationSvg } from "assets/svgs/dashboard-lead-creation.svg";
import { ReactComponent as DashboardLoanApprovalSvg } from "assets/svgs/dashboard-loan-approval.svg";
import { ReactComponent as DashboardLoanOriginationSvg } from "assets/svgs/dashboard-loan-origination.svg";
import { ReactComponent as DashboardRecoverySvg } from "assets/svgs/dashboard-recovery.svg";
import { ReactComponent as DashboardSequestSvg } from "assets/svgs/dashboard-sequest.svg";
import DashboardContactNowImage from "assets/images/dashboard-contact-now.png";
import dfnformat from "date-fns/format";
import useAuthUser from "hooks/useAuthUser";
import { useMemo, useState } from "react";
import Oops from "common/Oops";

const today = new Date();

function Dashboard(props) {
  const authUser = useAuthUser();
  const [watchLink, setWatchLink] = useState("");

  const lastLoggedIn = useMemo(
    () => new Date(authUser?.tfaToken?.validFrom),
    [authUser?.tfaToken?.validFrom]
  );

  return (
    <>
      <div className="flex flex-wrap gap-4 py-8 ">
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <Paper className="bg-primary-main text-primary-contrastText p-4 relative h-44">
            <div>
              <Typography variant="h5" className="font-bold">
                Welcome back {authUser.firstname}!
              </Typography>
              <Typography>
                Your last login was{" "}
                {dfnformat(lastLoggedIn, "h:mmaaa dd MMM, yyyy")}
              </Typography>
            </div>
            <div className="absolute right-0 top-0">
              <DashboardWelcomeSvg />
            </div>
          </Paper>

          <div
            className="p-2 flex items-center gap-4 rounded font-bold text-primary-main"
            style={{ backgroundColor: "#d0e6f6" }}
          >
            <Icon style={{ fontSize: 32 }}>screenshot_monitor</Icon>
            <Typography className="font-bold">
              Your Personalized Dashboard is coming soon
            </Typography>
          </div>

          <Paper className="flex-1 p-6">
            <div className="flex items-center mb-4">
              <Typography className="font-bold">Learning Aids</Typography>
              <div className="flex-1" />
              <Button variant="text">See more</Button>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
              {[
                {
                  IconSvg: DashboardLeadCreationSvg,
                  title: "Lead Creation",
                  link: "https://www.loom.com/embed/d6bf0357bf99403e8a3b8c6dcbcb9165",
                },
                {
                  IconSvg: DashboardCustomerSvg,
                  title: "Customer Creation",
                  link: "https://www.loom.com/embed/26b18c914d5e4ca88cd5acc07d35fd11",
                },
                {
                  IconSvg: DashboardLoanOriginationSvg,
                  title: "Loan Origination",
                  link: "",
                },
                {
                  IconSvg: DashboardSequestSvg,
                  title: "Sequest",
                  link: "",
                },
                {
                  IconSvg: DashboardRecoverySvg,
                  title: "Recovery",
                  link: "",
                },
                {
                  IconSvg: DashboardLoanApprovalSvg,
                  title: "Loan Approval",
                  link: "",
                },
              ].map(({ IconSvg, title, link }, index) => (
                <Paper key={index} elevation={0} className="bg-gray-100 p-4">
                  <IconSvg />
                  <Typography className="font-bold mb-4 mt-2">
                    {title}
                  </Typography>
                  <Link
                    className="flex items-center no-underline cursor-pointer group"
                    onClick={() => {
                      setWatchLink(link);
                    }}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      className="font-bold"
                    >
                      Watch Video
                    </Typography>
                    <Icon className="opacity-0 group-hover:opacity-100">
                      navigate_next
                    </Icon>
                  </Link>
                </Paper>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="max-w-sm text-center">
                <Typography variant="h6" className="font-bold">
                  Join the community!
                </Typography>
                <Typography variant="body2">
                  Check out our <Link>Teams</Link> and <Link>WhatsApp</Link>{" "}
                  channels for quick answers to your questions. Or call
                  07000123456
                </Typography>
              </div>
            </div>
          </Paper>
        </div>

        <div className="md:w-1/3 xl:w-1/4 flex flex-col gap-4 min-h-0 min-w-0">
          <Paper className="flex flex-col items-center justify-center p-4 h-44">
            <Avatar
              src="https://mui.com/static/images/avatar/1.jpg"
              className="w-20 h-20 mb-2 border-8"
            />
            <div>
              <Typography variant="h6" className="text-center font-bold">
                {authUser?.fullname}
              </Typography>
              <Typography color="textSecondary" className="text-center">
                {authUser?.officeName}
              </Typography>
            </div>
          </Paper>

          <Paper className="overflow-hidden">
            <CalendarPicker views={["day"]} date={today} onChange={() => {}} />
          </Paper>

          <Paper className="p-4">
            <div className="h-24 mb-4">
              <img
                src={DashboardContactNowImage}
                alt="contact-now"
                className="w-full h-full"
              />
            </div>
            <Typography variant="h6" className="font-bold">
              Need Help?
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Do you have any problem while using the Nimble-X 360?
            </Typography>
            <Button>Contact Now</Button>
          </Paper>
        </div>
      </div>
      <Modal
        className="flex items-center justify-center"
        open={!!watchLink}
        onBackdropClick={() => setWatchLink("")}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1024,
            outline: "none",
            padding: 32,
          }}
        >
          <div
            className="relative"
            style={{ paddingBottom: "56.25%", height: 0 }}
          >
            <iframe
              title="Watch Frame"
              src={watchLink}
              frameborder="0"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Dashboard;
