import { useMemo } from "react";
import { Button, Paper, Typography, Icon } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import PageHeader from "common/PageHeader";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { nimbleX360TaxGroupApi } from "./TaxConfigurationGroupStoreQuerySlice";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import { format } from "date-fns";
import useTable from "hooks/useTable";

function TaxConfigurationGroupDetails(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } =
    nimbleX360TaxGroupApi.useGetTaxGroupByIdQuery(id);
  const taxGroupData = useMemo(
    () => data?.taxAssociations,
    [data?.taxAssociations]
  );

  const tableInstance = useTable({
    columns,
    data: taxGroupData,
  });

  return (
    <>
      <PageHeader
        title="Tax Group"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Products", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          {
            name: "Tax Groups",
            to: RouteEnum.ADMINISTRATION_PRODUCTS_TAX_GROUPS,
          },
          {
            name: "Tax Groups",
          },
        ]}
      >
        <Button
          variant="outlined"
          startIcon={<Icon>edit</Icon>}
          onClick={() =>
            navigate(
              generatePath(RouteEnum.ADMINISTRATION_PRODUCTS_TAX_GROUPS_EDIT, {
                id,
              })
            )
          }
        >
          Edit Tax Group
        </Button>
      </PageHeader>
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        <div className="max-w-full w-full">
          <Paper className="p-4 md:p-8 mb-4">
            <Typography variant="h6" className="font-bold">
              Tax Group Details
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="max-w-sm mb-4"
            >
              Below are the tax group details
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
            </div>
          </Paper>
          <Paper className="p-4 md:p-8 mb-4">
            <div className="flex flex-row gap-3 mb-4">
              <Typography variant="h6" className="font-bold">
                Tax Components
              </Typography>
            </div>
            <DynamicTable instance={tableInstance} />
          </Paper>
        </div>
      </LoadingContent>
    </>
  );
}
export default TaxConfigurationGroupDetails;

const columns = [
  {
    Header: "Tax Component",
    accessor: (row) => row?.taxComponent?.name,
  },
  {
    Header: "Start Date",
    accessor: (row) => format(new Date(row?.startDate), "dd MMMM yyyy"),
  },
  {
    Header: "End Date",
    accessor: (row) =>
      row?.endDate ? format(new Date(row?.endDate), "dd MMMM yyyy") : undefined,
    Width: "200px",
  },
];
