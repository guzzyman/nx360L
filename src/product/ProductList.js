import { Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import { PRODUCTS } from "./ProductConstants";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function ProductList(props) {
  return (
    <>
      <PageHeader
        title="Products"
        breadcrumbs={[
          { name: "Administration", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          { name: "Products" },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map(
          ({
            permissions,
            validateAllPermissions,
            negatePermissionsValidation,
            name,
            description,
            Icon,
            to,
          }) => (
            <AuthUserUIPermissionRestrictor
              permissions={permissions}
              validateAll={validateAllPermissions}
              negateValidation={negatePermissionsValidation}
            >
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
            </AuthUserUIPermissionRestrictor>
          )
        )}
      </div>
    </>
  );
}

export default ProductList;
