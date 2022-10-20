import { useMemo } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Icon,
  IconButton,
  MenuItem,
} from "@mui/material";
import DynamicTable from "common/DynamicTable";
import { LoadingButton, DatePicker } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360JournalEntriesApi } from "./JournalEntriesStoreQuerySlice";
import { useSnackbar } from "notistack";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";
import useTable from "hooks/useTable";
import {
  getTextFieldFormikProps,
} from "common/Utils";
import dfnFormat from "date-fns/format";
import { DateConfig } from "common/Constants";

function JournalEntryCreate(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = !!id;

  const getOffices = nimbleX360JournalEntriesApi.useGetOfficesQuery();
  const getOfficesOptions = getOffices?.data || [];
  const getGlAccounts = nimbleX360JournalEntriesApi.useGetGlAccountsQuery();
  const accountOptions = useMemo(() => getGlAccounts?.data || [], [getGlAccounts?.data]);
  const getPaymentTypes = nimbleX360JournalEntriesApi.useGetPaymentTypesQuery();
  const paymentTypeOptions = getPaymentTypes?.data || [];
  const getCurrencies = nimbleX360JournalEntriesApi.useGetCurrenciesQuery();
  const currencyOptions = getCurrencies?.data || [];

  const [addJournalEntryMutation] =
    nimbleX360JournalEntriesApi.useAddJournalEntryMutation();

  const formik = useFormik({
    initialValues: {
      accountNumber: "",
      bankNumber: "",
      checkNumber: "",
      comments: "",
      credits: [],
      currencyCode: "",
      dateFormat: DateConfig.FORMAT_JOURNALENTRIES,
      debits: [],
      locale: DateConfig.LOCALE,
      officeId: "",
      paymentTypeId: "",
      receiptNumber: "",
      referenceNumber: "",
      routingCode: "",
      transactionDate: "",
      showPaymentDetails: false
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      // name: yup.string().trim().required(),
      // isBaseLendingRate: yup.boolean().required(),
      // isActive: yup.boolean().required(),
    }),
    onSubmit: async (values) => {
      const _values = { ...values };
      try {
        if (isShowPaymentDetails) {
          delete _values.showPaymentDetails;
        } else {
          delete _values.showPaymentDetails;
          delete _values.bankNumber;
          delete _values.receiptNumber;
          delete _values.routingCode;
          delete _values.checkNumber;
          delete _values.accountNumber;
          delete _values.paymentTypeId;
        }

        const func = isEdit
          ? ""
          : addJournalEntryMutation;
        const responseData = await func({
          id,
          ..._values,
          transactionDate: dfnFormat(_values.transactionDate, DateConfig.FORMAT_JOURNALENTRIES),
          debits: _values.debits.map((debitItem) => ({
            ...debitItem,
          })),
          credits: _values.credits.map((creditItem) => ({
            ...creditItem,
          })),
        }).unwrap();
        alert(responseData?.transactionId);
        navigate(generatePath(RouteEnum.ACCOUNTING_JOURNAL_ENTRIES_DETAILS, { id: responseData?.transactionId }));
        enqueueSnackbar(
          isEdit ? "Journal Entry Updated" : "Journal Entry Created",
          { variant: "success" }
        );
      } catch (error) {
        enqueueSnackbar(
          isEdit
            ? `Error Updating Journal Entry ${error.data?.defaultUserMessage || ""
            }`
            : `Error Creating Journal Entry ${error.data?.defaultUserMessage || ""
            }`,
          { variant: "error" }
        );
      }
    },
  });
  const isShowPaymentDetails = formik.values.showPaymentDetails;

  const dataRef = useDataRef({ formik });

  const debitColumns = useMemo(
    () => [
      {
        Header: "GL Account",
        accessor: "glAccount",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            label="GL Accounts"
            className="mt-2"
            select
            {...getTextFieldFormikProps(dataRef.current.formik, `debits[${row?.index}].glAccountId`)}
          >
            {accountOptions && accountOptions?.map((option) => (
              <MenuItem key={option?.id} value={option?.id}>
                {option?.name} {option?.glCode}
              </MenuItem>
            ))}
          </TextField>
        ),
      },
      {
        Header: "Debit Amount",
        accessor: "amount",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            className="mt-2"
            label="Debit Amount"
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `debits[${row.index}].amount`
            )}
            type="number"
          />
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              const newDebit = [
                ...dataRef.current.formik.values["debits"],
              ];
              newDebit.splice(row.index, 1);
              dataRef.current.formik.setFieldValue(
                "debits",
                newDebit
              );
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef, accountOptions]
  );

  const debitTableInstance = useTable({
    columns: debitColumns,
    data: formik.values.debits,
    hideRowCounter: true,
  });

  const creditColumns = useMemo(
    () => [
      {
        Header: "GL Account",
        accessor: "glAccount",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            label="GL Accounts"
            className="mt-2"
            select
            {...getTextFieldFormikProps(dataRef.current.formik, `credits[${row?.index}].glAccountId`)}
          >
            {accountOptions && accountOptions?.map((option) => (
              <MenuItem key={option?.id} value={option?.id}>
                {option?.name} {option?.glCode}
              </MenuItem>
            ))}
          </TextField>
        ),
      },
      {
        Header: "Credit Amount",
        accessor: "amount",
        Cell: ({ row }) => (
          <TextField
            fullWidth
            className="mt-2"
            label="Credit Amount"
            {...getTextFieldFormikProps(
              dataRef.current.formik,
              `credits[${row.index}].amount`
            )}
            type="number"
          />
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              const newDebit = [
                ...dataRef.current.formik.values["credits"],
              ];
              newDebit.splice(row.index, 1);
              dataRef.current.formik.setFieldValue(
                "credits",
                newDebit
              );
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        ),
      },
    ],
    [dataRef, accountOptions]
  );

  const creditTableInstance = useTable({
    columns: creditColumns,
    data: formik.values.credits,
    hideRowCounter: true,
  });

  return (
    <>
      <PageHeader
        title={"Add Journal Entry"}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Accounting", to: RouteEnum.ACCOUNTING },
          {
            name: "Add Journal Entry"
          },
        ]}
      />

      <LoadingContent
        loading={getCurrencies.isLoading}
        error={getCurrencies.isError}
        onReload={getCurrencies.refetch}
      >
        {() => (
          <form
            className="w-full flex justify-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="max-w-full w-full">
              <Paper className="p-4 md:p-8 mb-4">
                <Typography variant="h6" className="font-bold">
                  Add Journal Entry
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Ensure you enter correct information.
                </Typography>
                <div className="max-w-3xl grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <TextField

                    label="Office"
                    select
                    {...formik.getFieldProps("officeId")}
                    error={
                      !!formik.touched.officeId && formik.errors.officeId
                    }
                    helperText={
                      !!formik.touched.officeId && formik.errors.officeId
                    }
                  >
                    {getOfficesOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField

                    label="Currency"
                    select
                    {...formik.getFieldProps("currencyCode")}
                    error={
                      !!formik.touched.currencyCode && formik.errors.currencyCode
                    }
                    helperText={
                      !!formik.touched.currencyCode && formik.errors.currencyCode
                    }
                  >
                    {currencyOptions?.selectedCurrencyOptions?.map((option) => (
                      <MenuItem key={option?.displayLabel} value={option?.code}>
                        {option?.displayLabel}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </Paper>
              <Paper className="p-4 md:p-8 mb-4 w-full">
                <div className="flex flex-row gap-3 mb-4">
                  <Typography variant="h6" className="font-bold">
                    Affected GL Entries (Debit)
                  </Typography>
                  <Button
                    startIcon={<Icon>add</Icon>}
                    onClick={() =>
                      formik.setFieldValue("debits", [
                        ...dataRef.current.formik.values.debits,
                        { ...debitGLentry },
                      ])
                    }
                  >
                    Add
                  </Button>
                </div>
                <DynamicTable instance={debitTableInstance} />
              </Paper>
              <Paper className="p-4 md:p-8 mb-4">
                <div className="flex flex-row gap-3 mb-4">
                  <Typography variant="h6" className="font-bold">
                    Affected GL Entries (Credit)
                  </Typography>
                  <Button
                    startIcon={<Icon>add</Icon>}
                    onClick={() =>
                      formik.setFieldValue("credits", [
                        ...dataRef.current.formik.values.credits,
                        { ...creditGLentry },
                      ])
                    }
                  >
                    Add
                  </Button>
                </div>
                <DynamicTable instance={creditTableInstance} />
              </Paper>
              <Paper className="p-4 md:p-8 mb-4">
                <div className="max-w-3xl grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <TextField
                    fullWidth
                    label="Reference Number"
                    className="mt-4"
                    {...formik.getFieldProps("referenceNumber")}
                    error={
                      !!formik.touched.referenceNumber && formik.errors.referenceNumber
                    }
                    helperText={
                      !!formik.touched.referenceNumber && formik.errors.referenceNumber
                    }
                  />
                  <DatePicker
                    label="Transaction Date"
                    value={
                      dataRef.current.formik.values?.transactionDate
                    }
                    onChange={(newValue) => {
                      dataRef.current.formik.setFieldValue(
                        `transactionDate`,
                        newValue
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        margin="normal"
                        required
                        {...getTextFieldFormikProps(
                          dataRef.current.formik,
                          `transactionDate`
                        )}
                        {...params}
                      />
                    )}
                  />
                  <FormControlLabel
                    label="Show Payment Details"
                    className="col-span-3"
                    control={
                      <Checkbox
                        checked={formik.values?.showPaymentDetails}
                        onChange={(event) => {
                          formik.setFieldValue(
                            "showPaymentDetails",
                            event.target.checked
                          );
                        }}
                        value={formik.values?.showPaymentDetails}
                      />
                    }
                  />
                  <div className=" col-span-2 grid gap-4 sm:grid-cols-2 md:grid-cols-2 mb-4">
                    {isShowPaymentDetails ? <>
                      <TextField
                        fullWidth
                        label="Payment Type"
                        className="xs:col-span-2"
                        select
                        {...formik.getFieldProps("paymentTypeId")}
                        error={
                          !!formik.touched.paymentTypeId && formik.errors.paymentTypeId
                        }
                        helperText={
                          !!formik.touched.paymentTypeId && formik.errors.paymentTypeId
                        }
                      >
                        {paymentTypeOptions?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth
                        label="Account #"
                        {...formik.getFieldProps("accountNumber")}
                        error={
                          !!formik.touched.accountNumber && formik.errors.accountNumber
                        }
                        helperText={
                          !!formik.touched.accountNumber && formik.errors.accountNumber
                        }
                      />
                      <TextField
                        fullWidth
                        label="Cheque #"
                        {...formik.getFieldProps("checkNumber")}
                        error={
                          !!formik.touched.checkNumber && formik.errors.checkNumber
                        }
                        helperText={
                          !!formik.touched.checkNumber && formik.errors.checkNumber
                        }
                      />
                      <TextField
                        fullWidth
                        label="Routing Code"
                        {...formik.getFieldProps("routingCode")}
                        error={
                          !!formik.touched.routingCode && formik.errors.routingCode
                        }
                        helperText={
                          !!formik.touched.routingCode && formik.errors.routingCode
                        }
                      />
                      <TextField
                        fullWidth
                        label="Receipt #"
                        {...formik.getFieldProps("receiptNumber")}
                        error={
                          !!formik.touched.receiptNumber && formik.errors.receiptNumber
                        }
                        helperText={
                          !!formik.touched.receiptNumber && formik.errors.receiptNumber
                        }
                      />
                      <TextField
                        fullWidth
                        label="Bank"
                        {...formik.getFieldProps("bankNumber")}
                        error={
                          !!formik.touched.bankNumber && formik.errors.bankNumber
                        }
                        helperText={
                          !!formik.touched.bankNumber && formik.errors.bankNumber
                        }
                      />
                    </> : undefined}


                    <TextField
                      fullWidth
                      className="col-span-2"
                      label="Comments"
                      multiline={true}
                      rows={6}
                      {...formik.getFieldProps("comments")}
                      error={
                        !!formik.touched.comments && formik.errors.comments
                      }
                      helperText={
                        !!formik.touched.comments && formik.errors.comments
                      }
                    />
                  </div>

                </div>
              </Paper>
              <div className="flex items-center justify-end gap-4">
                <Button color="error" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  loadingPosition="end"
                  endIcon={<></>}
                >
                  {isEdit ? "Update" : "Submit"}
                </LoadingButton>
              </div>
            </div>
          </form>
        )}
      </LoadingContent>
    </>
  );
}

export default JournalEntryCreate;

const debitGLentry = {
  amount: "",
  glAccountId: "",
};

const creditGLentry = {
  amount: "",
  glAccountId: "",
};
