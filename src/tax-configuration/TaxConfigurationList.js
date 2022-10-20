import { Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import { TAXCONFIGURATION } from "./TaxConfigurationConstants";

function TaxConfigurationList(props) {
  return (
    <>
      <PageHeader
        title="Tax Configuration"
        breadcrumbs={[
          { name: "Administration", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          { name: "Products", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          { name: "Tax Configuration List" },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {TAXCONFIGURATION.map(({ name, description, Icon, to }) => (
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

export default TaxConfigurationList;
