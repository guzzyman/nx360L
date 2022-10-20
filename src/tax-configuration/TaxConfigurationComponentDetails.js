import { Button, Paper, Typography, Icon, Grid } from "@mui/material";
import PageHeader from "common/PageHeader";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { nimbleX360TaxComponentApi } from "./TaxConfigurationComponentStoreQuerySlice";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";

function TaxConfigurationComponentDetails(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } =
    nimbleX360TaxComponentApi.useGetTaxComponentByIdQuery(id);

  const StartDate = new Date(data?.startDate.toString());

  return (
    <>
      <PageHeader
        title="Manage Tax Component"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Products", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          {
            name: "Tax Components",
            to: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_COMPONENTS,
          },
          {
            name: "Manage Tax Component",
          },
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <div className="max-w-full flex justify-center">
            <div className="w-full">
              <div className="flex items-center justify-end gap-4 my-4">
                <Button
                  variant="outlined"
                  startIcon={<Icon>edit</Icon>}
                  onClick={() =>
                    navigate(
                      generatePath(
                        RouteEnum.ADMINISTRATION_PRODUCTS_TAX_COMPONENTS_EDIT,
                        { id }
                      )
                    )
                  }
                >
                  Edit
                </Button>
                <Button color="error" startIcon={<Icon>delete</Icon>}>
                  Delete
                </Button>
              </div>
              <Paper className="max-w-full p-4 md:p-8 mb-4">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Name:
                    </Typography>
                    <Typography variant={"h6"}>{data?.name}</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Percentage:
                    </Typography>
                    <Typography variant={"h6"}>{data?.percentage}</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Credit Account Type:
                    </Typography>
                    <Typography variant={"h6"}>
                      {data?.creditAccountType?.value}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Credit Account:
                    </Typography>
                    <Typography variant={"h6"}>
                      {data?.creditAccount?.name}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Start Date:
                    </Typography>
                    <Typography variant={"h6"}>
                      {StartDate.toDateString()}
                    </Typography>
                  </Grid>
                </div>
              </Paper>
            </div>
          </div>
        )}
      </LoadingContent>
    </>
  );
}

export default TaxConfigurationComponentDetails;
