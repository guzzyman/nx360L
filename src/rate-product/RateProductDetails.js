import { Button, Paper, Typography, Icon, Grid } from "@mui/material";
import PageHeader from "common/PageHeader";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { nimbleX360RateProductApi } from "./RateProductStoreQuerySlice";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";

function RateProductDetails(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } =
    nimbleX360RateProductApi.useGetRateProductByIdQuery(id);

  return (
    <>
      <PageHeader
        title="Manage Rate Product"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Products", to: RouteEnum.ADMINISTRATION_PRODUCTS },
            { name: "Rates", to: RouteEnum.ADMINISTRATION_PRODUCTS_RATES },
          {
            name: "Manage Rate Product",
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
                        RouteEnum.ADMINISTRATION_PRODUCTS_RATES_EDIT,
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
                      Charge Applies To:
                    </Typography>
                    <Typography variant={"h6"}>
                      {data?.productApply?.value}
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

export default RateProductDetails;
