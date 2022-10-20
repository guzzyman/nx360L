import { Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import { ReactComponent as ProductLoan } from "assets/svgs/product-loan.svg";

function SystemList(props) {
  return (
    <>
      <PageHeader
        title="System"
        breadcrumbs={[
          { name: "Administration", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          { name: "System" },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    name: "Document Configuration",
    description: "Configure Documents",
    Icon: ProductLoan,
    to: RouteEnum.DOCUMENT_CONFIGURATIONS,
  },
  {
    name: "Manage Survey",
    description: "Define component and task group",
    Icon: ProductLoan,
    to: RouteEnum.SURVEYS,
  },
  {
    name: "Manage Roles and Permissions",
    description: "Define or modify roles and associated permissions",
    Icon: ProductLoan,
    to: RouteEnum.ROLES,
  },
];
