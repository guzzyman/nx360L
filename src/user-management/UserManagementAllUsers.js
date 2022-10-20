import { RouteEnum } from "common/Constants";
import DynamicTable from "common/DynamicTable";
import LoadingContent from "common/LoadingContent";
import SearchTextField from "common/SearchTextField";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import { generatePath, useNavigate } from "react-router-dom";

function UserManagementAllUsers(props) {
    const { usersQueryResult, isLoading, isError, refetch, ButtonBase, q, extractedSearchParams, setSearchParams } = props;
    const navigate = useNavigate();

    const tableInstance = usePaginationSearchParamsTable({
        columns,
        data: usersQueryResult,
        manualPagination: true,
        dataCount: usersQueryResult?.totalFilteredRecords,
    });

    return <>

        <div className="flex">
            <div className="flex-1" />
            <SearchTextField
                size="small"
                value={q}
                onChange={(e) =>
                    setSearchParams(
                        { ...extractedSearchParams, q: e.target.value },
                        { replace: true }
                    )
                }
            />
        </div>
        <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
            {() => (
                <DynamicTable
                    instance={tableInstance}
                    loading={isLoading}
                    error={isError}
                    onReload={refetch}
                    RowComponent={ButtonBase}
                    rowProps={(row) => ({
                        onClick: () =>
                            navigate(
                                generatePath(RouteEnum.USER_DETAILS, {
                                    id: row.original.id,
                                })
                            ),
                    })}
                />
            )}
        </LoadingContent>
    </>
}

export default UserManagementAllUsers;

const columns = [
    { Header: "First Name", accessor: "firstname" },
    { Header: "Last Name", accessor: "lastname" },
    { Header: "User Name", accessor: "username" },
    { Header: "Email Address", accessor: "email" },
    {
        Header: "Role",
        accessor: (row) => `${row?.selectedRoles?.map((item, index) => {
            return item.name.toUpperCase()
        })}`
    },
]