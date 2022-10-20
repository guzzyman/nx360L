import { RouteEnum } from "common/Constants";
import DynamicTable from "common/DynamicTable";
import LoadingContent from "common/LoadingContent";
import useTable from "hooks/useTable";
import { generatePath, useNavigate } from "react-router-dom";
import UserManagementStatusChip from "./UserManagementStatusChip"

function UserManagementMyTeam(props) {
    const { myTeamQueryResults, isLoading, isError, refetch, ButtonBase } = props;
    const myTeamRequestTableInstance = useTable({
        columns,
        data: myTeamQueryResults,
        manualPagination: true,
        totalPages: myTeamQueryResults?.totalFilteredRecords,
    });
    const navigate = useNavigate();

    return (
        <>
            <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
                {() => (
                    <DynamicTable
                        instance={myTeamRequestTableInstance}
                        loading={isLoading}
                        error={isError}
                        onReload={refetch}
                        RowComponent={ButtonBase}
                        rowProps={(row) => ({
                            onClick: () =>
                                navigate(
                                    generatePath(RouteEnum.STAFF_DETAILS, {
                                        id: row.original.id,
                                    })
                                ),
                        })}
                    />
                )}
            </LoadingContent>
        </>
    );
}

export default UserManagementMyTeam;

const columns = [
    { Header: "First Name", accessor: "firstname" },
    { Header: "Last Name", accessor: "lastname" },
    {
        Header: "Team Lead",
        accessor: (row) => `${row?.organisationalRoleParentStaff?.displayName}`
    },
    { Header: "Mobile No", accessor: "mobileNo" },
    {
        Header: "Available",
        accessor: (row) => <UserManagementStatusChip status={row?.isHoliday} />,
        width: 100,
    },
    {
        Header: "Loan Officer?",
        accessor: (row) => <UserManagementStatusChip status={row?.isLoanOfficer} />,
        width: 100,
    },
]