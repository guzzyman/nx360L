import { useMemo } from "react";
import {
  Button,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Icon,
} from "@mui/material";
import DynamicTable from "common/DynamicTable";
import PageHeader from "common/PageHeader";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { nimbleX360FloatingRateApi } from "./FloatingRateProductStoreQuerySlice";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import { format } from "date-fns";
import useTable from "hooks/useTable";
import FloatingRateStatusChip from "./FloatingRateStatusChip";

function FloatingRateDetails(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } =
    nimbleX360FloatingRateApi.useGetFloatingRatesByIdQuery(id);

  const floatingRateData = useMemo(
    () => data?.ratePeriods,
    [data?.ratePeriods]
  );

  const tableInstance = useTable({
    columns,
    data: floatingRateData,
  });

  return (
    <>
      <PageHeader
        title="Manage Floating Rates"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Products", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          {
            name: "Floating Rates",
            to: RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES,
          },
          {
            name: "Floating Rate Details",
          },
        ]}
      >
        <Button
          variant="outlined"
          startIcon={<Icon>edit</Icon>}
          onClick={() =>
            navigate(
              generatePath(
                RouteEnum.ADMINISTRATION_PRODUCTS_FLOATING_RATES_EDIT,
                { id }
              )
            )
          }
        >
          Edit Floating Rate
        </Button>
      </PageHeader>
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        <div className="max-w-full w-full">
          <Paper className="p-4 md:p-8 mb-4">
            <Typography variant="h6" className="font-bold">
              Floating Rates Details
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="max-w-sm mb-4"
            >
              Below are the floating rate details for
            </Typography>
            <div className="max-w-3xl grid gap-4 sm:grid-cols-2 md:grid-cols-2 mb-4">
              <div className="col-span-2">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-1"
                >
                  Name
                </Typography>
                <Typography variant="h6">{<div>{data?.name}</div>}</Typography>
              </div>
              <FormControlLabel
                label="Is this a base lending rate?"
                readOnly
                control={
                  <Checkbox
                    checked={data?.isBaseLendingRate}
                    value={data?.isBaseLendingRate}
                  />
                }
              />
              <FormControlLabel
                label="Active"
                readOnly
                control={
                  <Checkbox checked={data?.isActive} value={data?.isActive} />
                }
              />
            </div>
          </Paper>
          <Paper className="p-4 md:p-8 mb-4">
            <div className="flex flex-row gap-3 mb-4">
              <Typography variant="h6" className="font-bold">
                Floating Rates Periods
              </Typography>
            </div>
            <DynamicTable instance={tableInstance} />
          </Paper>
        </div>
      </LoadingContent>
    </>
  );
}
export default FloatingRateDetails;

const columns = [
  {
    Header: "From Date",
    accessor: (row) => format(new Date(row?.fromDate), "dd MMMM yyyy"), //"fromDate", //(row) => format(new Date(row?.fromDate), "dd MMMM yyyy"),
  },
  {
    Header: "Interest Rate",
    accessor: "interestRate",
  },
  {
    Header: "Is Differential?",
    accessor: "isDifferentialToBaseLendingRate",
    Cell: ({ value }) => <FloatingRateStatusChip status={value} />,
    Width: "200px",
  },
];
