import { Paper, ButtonBase, Typography, Icon, Button } from "@mui/material";
import { RouteEnum } from "common/Constants";
import { useNavigate, generatePath, useParams, Link } from "react-router-dom";
import DynamicTable from "common/DynamicTable";
import { nimbleX360CRMEmployerApi } from "./CRMEmployerStoreQuerySlice";
import CRMEmployerStatusChip from "./CRMEmployerStatusChip";
import { useMemo } from "react";
import useTable from "hooks/useTable";

function CRMEmployerBranches(props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } =
    nimbleX360CRMEmployerApi.useGetEmployerBranchesQuery({
      id,
    });

  const finalData = useMemo(() => data || [], [data]);

  const tableInstance = useTable({
    columns,
    data: finalData,
    manualPagination: false,
    dataCount: data?.length,
  });

  return (
    <>
      <Paper className=" p-4">
        <div className="flex items-center gap-4 mb-4">
          <Typography variant="h6" className="font-bold">
            Branches
          </Typography>

          <Button
            endIcon={<Icon>add</Icon>}
            variant="outlined"
            component={Link}
            to={generatePath(RouteEnum.CRM_EMPLOYER_ADD_BRANCH, {
              parentId: id,
            })}
          >
            Add Branch
          </Button>
        </div>
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () =>
              navigate(
                generatePath(RouteEnum.CRM_EMPLOYER_DETAILS, {
                  id: row.original.id,
                })
              ),
          })}
        />
      </Paper>
    </>
  );
}

export default CRMEmployerBranches;

const columns = [
  { Header: "Name", accessor: "name" },
  {
    Header: "Employer Type",
    accessor: (row) => row?.clientType?.name,
  },
  {
    Header: "Industry",
    accessor: (row) => row?.industry?.name,
  },
  {
    Header: "Office Type",
    accessor: (row) => (row?.parent?.id ? "Branch" : "Head Office"),
  },
  {
    Header: "Active",
    accessor: (row) => <CRMEmployerStatusChip status={row?.active} />,
  },
];
