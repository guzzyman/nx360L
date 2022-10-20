import { Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import PageHeader from "common/PageHeader";
import { ReactComponent as ProductLoan } from "assets/svgs/product-loan.svg";

function SystemList(props) {
  return (
    <>
      <PageHeader title="Organizations" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-5">
        {SYSTEMS.map(({ name, description, Icon, to }) => (
          <Paper
            key={name}
            component={Link}
            to={to}
            className="flex flex-col items-center p-4"
          >
            <div className="mb-2">
              <Icon />
            </div>
            <Typography variant="h6" className="text-center font-bold">
              {name}
            </Typography>
            <Typography
              className="text-center"
              variant="body2"
              color="textSecondary"
            >
              {description}
            </Typography>
          </Paper>
        ))}
      </div>
    </>
  );
}

export default SystemList;

const SYSTEMS = [
  {
    name: "Manage Offices",
    description:
      "Add new office or modify or deactivate office or modify office hierarchy",
    Icon: ProductLoan,
    to: "",
  },
  {
    name: "Manage Holidays",
    description: "Define holidays for office",
    Icon: ProductLoan,
    to: "",
  },
  {
    name: "Manage Employees",
    description:
      "A employee represents loan officers with no access to systems",
    Icon: ProductLoan,
    to: "",
  },
  {
    name: "Standing Instructions History",
    description: "View logged history of standing instructions",
    Icon: ProductLoan,
    to: "",
  },
  {
    name: "Password Preferences",
    description:
      "Define standards for enforcing the usage of stronger passwords",
    Icon: ProductLoan,
    to: "",
  },
  {
    name: "Loan Provisioning Criteria",
    description: "Define Loan Provisioning Criteria for Organization",
    Icon: ProductLoan,
    to: "",
  },
  {
    name: "Manage Funds",
    description: "Funda are associated with loans",
    Icon: ProductLoan,
    to: "",
  },
  {
    name: "Bulk Load Reassignment",
    description: "Easy way to reassign all the loan from one LO to another LO",
    Icon: ProductLoan,
    to: "",
  },
  {
    name: "Working Days",
    description:
      "Define working days and configure behavior of payments due on holidays",
    Icon: ProductLoan,
    to: "",
  },
  {
    name: "Payment Type",
    description: "Manage payment types",
    Icon: ProductLoan,
    to: "",
  },
  {
    name: "SMS Campaigns",
    description: "Define SMS Campaigns for Organization",
    Icon: ProductLoan,
    to: "",
  },
];
