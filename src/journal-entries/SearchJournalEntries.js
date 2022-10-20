import { useMemo } from "react";
import {
    TextField,
    Button,
    Paper,
    MenuItem,
    Typography,
    ButtonBase,
} from "@mui/material";
import { DatePicker } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360JournalEntriesApi } from "./JournalEntriesStoreQuerySlice";
import { generatePath, useNavigate } from "react-router-dom";
import { DateConfig, RouteEnum } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";
import { getTextFieldFormikProps } from "common/Utils";
import dfnFormat from "date-fns/format";
import usePaginationSearchParamsTable from "hooks/usePaginationSearchParamsTable";
import DynamicTable from "common/DynamicTable";
import { parseDateToString } from "common/Utils";

function SearchJournalEntries(props) {
    const navigate = useNavigate();
    const getOffices = nimbleX360JournalEntriesApi.useGetOfficesQuery();
    const getOfficesOptions = getOffices?.data || [];
    const getGlAccounts = nimbleX360JournalEntriesApi.useGetGlAccountsQuery();
    const getGlAccountOptions = getGlAccounts?.data || [];

    const [searchJournalEntriesQuery, searchJournalEntriesQueryResult] =
        nimbleX360JournalEntriesApi.useLazySearchJournalEntriesQuery();   

    const formik = useFormik({
        initialValues: {
            transactionId:"",
            dateFormat: DateConfig.FORMAT_JOURNALENTRIES,
            fromDate: null,
            glAccountId: "",
            limit: 14,
            locale: "en",
            manualEntriesOnly: "",
            officeId: "",
            offset: 0,
            toDate: null,
        },
        validateOnChange: false,
        validateOnBlur: false,
        validationSchema: yup.object({}),
        onSubmit: async (values) => {
            const _values = values;
            _values.manualEntriesOnly = _values.manualEntriesOnly = "1" ? "" : _values.manualEntriesOnly
            try {
                await searchJournalEntriesQuery({
                    ...Object.keys(_values).reduce((acc, key) => {
                        if (_values[key] !== undefined && _values[key] !== null && _values[key] !== "" ) {
                            acc[key] = _values[key] instanceof Date ? dfnFormat(_values[key], DateConfig.FORMAT_JOURNALENTRIES) : _values[key];
                        }
                        return acc;
                    }, {}),
                }).unwrap();
            } catch (error) { }
        },
    });

    const dataRef = useDataRef({ formik });
    const columns = useMemo(
        () => [
            { Header: "Entry ID", accessor: "id", width: 100 },
            {
                Header: "Office",
                accessor: "officeName",
            },
            {
                Header: "Transaction Date",
                accessor: (row) => parseDateToString(row?.transactionDate),
            },
            {
                Header: "Transaction ID",
                accessor: "transactionId",
            },
            {
                Header: "Transaction Type",
                accessor: (row) => row?.glAccountType.value,
            },
            {
                Header: "Created By",
                accessor: "createdByUserName",
            },
            {
                Header: "Account",
                accessor: "glAccountName",
            },
            {
                Header: "Debit",
                accessor: (row) =>
                    row?.entryType?.value === "DEBIT" ? row?.amount : "--",
            },
            {
                Header: "Credit",
                accessor: (row) =>
                    row?.entryType?.value === "CREDIT" ? row?.amount : "--",
            },
        ],
        []
    );

    const searchJournalResult = useMemo(
        () => searchJournalEntriesQueryResult?.data?.pageItems || [],
        [searchJournalEntriesQueryResult?.data?.pageItems]
    );

    const tableInstance = usePaginationSearchParamsTable({
        columns,
        data: searchJournalResult,
        manualPagination: true,
        dataCount: searchJournalResult?.totalFilteredRecords,
        hideRowCounter: true,
    });

    return (
        <>
            <PageHeader
                title="Search Journal Entries"
                breadcrumbs={[
                    { name: "Home", to: RouteEnum.DASHBOARD },
                    { name: "Accounting", to: RouteEnum.ACCOUNTING },
                    {
                        name: "Search Journal Entries",
                    },
                ]}
            ></PageHeader>

            <LoadingContent
                loading={getOffices.isLoading}
                error={getOffices.isError}
                onReload={getOffices.refetch}
            >
                {() => (
                    <form
                        className="w-full flex justify-center"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="max-w-full w-full">
                            <Paper className="p-4 md:p-4 mb-4">
                                <Typography variant="h6" className="font-bold">
                                    Journal Parameters
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    className="max-w-sm mb-4"
                                >
                                    Ensure you enter correct information.
                                </Typography>
                                <div className="max-w-3xl grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                                    <div className="col-span-3 grid gap-4 sm:grid-cols-3">
                                        <TextField
                                            fullWidth
                                            label="Branch/Offices"
                                            select
                                            {...formik.getFieldProps("officeId")}
                                        >
                                            {getOfficesOptions?.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            fullWidth
                                            label="GL Accounts"
                                            select
                                            {...formik.getFieldProps("glAccountId")}
                                        >
                                            {getGlAccountOptions?.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name} {option.glCode}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            fullWidth
                                            label="Search Filter"
                                            select
                                            {...formik.getFieldProps("manualEntriesOnly")}
                                        >
                                            {journalParameters?.map((option) => (
                                                <MenuItem
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.value}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <DatePicker
                                            label="From Date"
                                            value={dataRef.current.formik.values?.fromDate}
                                            onChange={(newValue) => {
                                                dataRef.current.formik.setFieldValue(
                                                    `fromDate`,
                                                    newValue
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    {...getTextFieldFormikProps(
                                                        dataRef.current.formik,
                                                        `fromDate`
                                                    )}
                                                    {...params}
                                                />
                                            )}
                                        />
                                        <DatePicker
                                            label="To Date"
                                            value={dataRef.current.formik.values?.toDate}
                                            onChange={(newValue) => {
                                                dataRef.current.formik.setFieldValue(
                                                    `toDate`,
                                                    newValue
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    {...getTextFieldFormikProps(
                                                        dataRef.current.formik,
                                                        `toDate`
                                                    )}
                                                    {...params}
                                                />
                                            )}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Transaction Id"
                                            {...formik.getFieldProps("transactionId")}
                                        />
                                        <div className="flex justify-end items-right col-span-3">
                                            <Button onClick={formik.handleSubmit}>Run Report</Button>
                                        </div>
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    </form>
                )}
            </LoadingContent>
            {searchJournalResult?.length >= 1 ? (
                <Paper className="p-4">
                    <DynamicTable
                        instance={tableInstance}
                        loading={getOffices.isLoading}
                        error={getOffices.isError}
                        onReload={getOffices.refetch}
                        RowComponent={ButtonBase}
                        rowProps={(row) => ({
                            onClick: () =>
                                navigate(
                                    generatePath(RouteEnum.ACCOUNTING_JOURNAL_ENTRIES_DETAILS, {
                                        id: row.original.transactionId,
                                    })
                                ),
                        })}
                    />
                </Paper>
            ) : null}
        </>
    );
}

export default SearchJournalEntries;

const journalParameters = [
    {
        id: "3",
        value: "All",
    },
    {
        id: true,
        value: "Manual Entries",
    },
    {
        id: false,
        value: "System Entries",
    },
];
