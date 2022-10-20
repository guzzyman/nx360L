import { Button, Paper, Typography, Icon, Grid } from "@mui/material";
import PageHeader from "common/PageHeader";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { nimbleX360ChargeProductApi } from "./ChargeProductStoreQuerySlice";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";

function ChargeProductDetails(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } =
    nimbleX360ChargeProductApi.useGetChargeProductByIdQuery(id);

  return (
    <>
      <PageHeader
        title="Manage Charge Product"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Products", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          { name: "Charges", to: RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES },
          {
            name: "Manage Charge Product",
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
                        RouteEnum.ADMINISTRATION_PRODUCTS_CHARGES_EDIT,
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
                      Currency:
                    </Typography>
                    <Typography variant={"h6"}>
                      {data?.currency.name}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Amount:
                    </Typography>
                    <Typography variant={"h6"}>
                      {data?.currency?.displaySymbol}
                      {data?.amount}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Charge Applies To:
                    </Typography>
                    <Typography variant={"h6"}>
                      {data?.chargeAppliesTo?.value}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Charge Calculation Type:
                    </Typography>
                    <Typography variant={"h6"}>
                      {data?.chargeCalculationType.value}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Charge Payment Mode
                    </Typography>
                    <Typography variant={"h6"}>
                      {data?.chargePaymentMode?.value}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Charge Time Type
                    </Typography>
                    <Typography variant={"h6"}>
                      {data?.chargeTimeType?.value}
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

export default ChargeProductDetails;
