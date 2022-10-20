import React from "react";
import { useMemo } from "react";
import { Button, Icon, Paper, ButtonBase } from "@mui/material";
import { RouteEnum, TABLE_PAGINATION_DEFAULT } from "common/Constants";
import PageHeader from "common/PageHeader";
import {
  useNavigate,
  useSearchParams,
  generatePath,
  useParams,
} from "react-router-dom";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import SearchTextField from "common/SearchTextField";
import { urlSearchParamsExtractor } from "common/Utils";
import { BankScheduleStoreQuerySlice } from "./BankScheduleStoreQuerySlice";
import useDebouncedState from "hooks/useDebouncedState";
import { useConfirmDialog } from "react-mui-confirm";
import { useSnackbar } from "notistack";
import useAuthUser from "hooks/useAuthUser";

export default function BankScheduleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        name: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const { name, offset, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(name, {
    wait: 1000,
    enableReInitialize: true,
  });

  const [bankScheduleDelete, bankScheduleDeleteQuery] =
    BankScheduleStoreQuerySlice.useDeleteBankScheduleMutation();

  const { data, isLoading, isError, refetch } =
    BankScheduleStoreQuerySlice.useGetBankScheduleQuery({
      id,
      Page: offset,
      PageSize: limit,
      ...(debouncedQ
        ? {
          SearchTerm: debouncedQ,
          // firstName: debouncedQ,
          // lastName: debouncedQ,
        }
        : {}),
    });

  const [downloadBankSchedule, downloadBankScheduleResult] =
    BankScheduleStoreQuerySlice.useLazyDownloadBankSchedulesQuery(id);

  async function handleDownloadBankSchedule(id) {
    try {
      await downloadBankSchedule(id);
    } catch (error) {
      console.log(error)
      enqueueSnackbar("Failed to Download Template", { variant: "error" });
    }
  }
  const handleDeleteSchedule = (id, user) =>
    confirm({
      title: "Are you sure you want to Delete Bank Schedule?",
      onConfirm: async () => {
        try {
          await bankScheduleDelete({
            id,
            employerId: user.id,
            employerName: user.fullname,
            email: user.email,
          }).unwrap();
          enqueueSnackbar(`Bank Schedule Deletion Successfully`, {
            variant: "success",
          });
          navigate(RouteEnum.BANK_SCHEDULE);
        } catch (error) {
          enqueueSnackbar(`Bank Schedule Deletion Failed`, {
            variant: "error",
          });
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });
  const tableInstance = usePaginationSearchParamsTable({
    columns,
    data: data?.data?.records,
    manualPagination: true,
    dataCount: data?.data?.totalRecords,
  });

  return (
    <>
      <PageHeader
        title={id}
        breadcrumbs={[
          { name: "CRM", to: "/" },
          { name: "Bank Schedule", to: RouteEnum.BANK_SCHEDULE },
          { name: "Bank Schedule Details" },
        ]}
      ></PageHeader>
      <Paper className="grid gap-4 p-4">
        <div className="flex">
          <div className="flex-1 flex gap-2 flex-2">
            <Button
              disabled={
                downloadBankScheduleResult.isLoading ||
                downloadBankScheduleResult.isFetching
              }
              onClick={() => handleDownloadBankSchedule(id)}
              variant="outlined"
              endIcon={<Icon>download</Icon>}
            >
              Download Bank Schedule
            </Button>

            <Button
              variant="outlined"
              disabled={bankScheduleDeleteQuery.isLoading || isLoading}
              onClick={() => handleDeleteSchedule(id, user)}
              endIcon={<Icon>delete</Icon>}
              color="error"
            >
              Delete Bank Schedule
            </Button>
          </div>
          <SearchTextField
            size="small"
            value={name}
            onChange={(e) =>
              setSearchParams(
                { ...extractedSearchParams, name: e.target.value },
                { replace: true }
              )
            }
          />
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
                generatePath(RouteEnum.CRM_VENDOR_DETAILS, {
                  id: row.original.id,
                })
              ),
          })}
        />
      </Paper>
    </>
  );
}

const columns = [
  {
    Header: "Employer No",
    accessor: "employeeNumber",
  },
  {
    Header: "Full Name",
    accessor: "fullName",
  },
  {
    Header: "Grade Level",
    accessor: "gradeLevel",
  },
  {
    Header: "Step",
    accessor: "step",
  },
  {
    Header: "BVN",
    accessor: "bvn",
  },
  {
    Header: "Phone Number",
    accessor: "phoneNo",
  },
  {
    Header: "Bank Name",
    accessor: "bankName",
  },

  {
    Header: "Account No",
    accessor: "accountNumber",
  },
  // {
  //   Header: "Sort Code",
  //   accessor: "bankCode",
  // },
  {
    Header: "Gross Pay Sum",
    accessor: "grossPay",
  },
  // {
  //   Header: "Gross Deduction Sum1",
  //   accessor: "",
  // },
  {
    Header: "Netpay",
    accessor: "netPay",
  },
  {
    Header: "Sector",
    accessor: "sectorId",
  },
  {
    Header: "State",
    accessor: "stateId",
  },
  {
    Header: "Employer",
    accessor: "employerId",
  },
];
