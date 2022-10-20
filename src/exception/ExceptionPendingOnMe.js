import useTable from "hooks/useTable";
import DynamicTable from "common/DynamicTable";
import * as dfn from "date-fns";
import ExceptionStatusChip from "./ExceptionStatusChip";
import { generatePath, useNavigate } from "react-router-dom";
import { RouteEnum } from "common/Constants";

function ExceptionPendingOnMe(props) {
  const { exceptionPendingOnMeResult, isLoading, isError, refetch, ButtonBase } = props;
  const exceptionPendingOnMeTableInstance = useTable({
    columns,
    data: exceptionPendingOnMeResult,
    manualPagination: true,
    totalPages: exceptionPendingOnMeResult?.totalFilteredRecords,
  });

  const navigate = useNavigate();

  return (
    <>
      <DynamicTable
        instance={exceptionPendingOnMeTableInstance}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        RowComponent={ButtonBase}
        rowProps={(row) => ({
          onClick: () =>
            navigate(
              generatePath(RouteEnum.SEQUEST_EXCEPTION_DETAILS, {
                id: row.original.exceptionId,
              })
            ),
        })}
      />
    </>
  );
}

export default ExceptionPendingOnMe;

const columns = [
  {
    Header: "Exception ID",
    accessor: "exceptionId",
  },
  {
    Header: "Exception Title",
    accessor: "title",
  },
  {
    Header: "Exception Category",
    accessor: "category",
  },
  {
    Header: "Exception SubCategory",
    accessor: "subCategory",
  },
  {
    Header: "Creator Name",
    accessor: "creatorName",
  },
  {
    Header: "Responsible Person",
    accessor: "responsiblePerson",
  },
  {
    Header: "Created Date",
    accessor: (row) => dfn.format(new Date(row?.dateCreated), "dd MMMM yyyy"),
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }) => <ExceptionStatusChip status={value} />,
    width: 100,
  },
];
