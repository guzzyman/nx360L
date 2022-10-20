import { Icon, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import DynamicTable from "common/DynamicTable";
import useTable from "hooks/useTable";
import { parseDateToString } from "common/Utils";
import Modal from "common/Modal";

function ClientXLeadFixedDepositAddEditInterestRateChart({
  formik,
  data,
  isEdit,
}) {
  const [open, setOpen] = useState(false);
  const [incentives, setIncentives] = useState({});

  const interestRateColumns = useMemo(
    () => [
      {
        Header: "period",
        accessor: (row) => row?.periodType?.value,
      },
      // {
      //   Header: "Amount Range",
      //   accessor: (row) =>
      //     `${row?.periodType?.amountRangeFrom || "__"} - ${
      //       row?.periodType?.amountRangeTo || "__"
      //     }`,
      // },
      // {
      //   Header: "Interest",
      //   // accessor: "annualInterestRate",
      //   accessor: (row, i) => (
      //     <TextField
      //       onChange={(e) => {
      //         const { value } = e.target;
      //         formik.setFieldValue("nominalAnnualInterestRate", value);
      //         formik.setFieldValue(
      //           `charts.chartSlabs.[${i}].annualInterestRate`,
      //           value
      //         );
      //       }}
      //       value={formik.values?.nominalAnnualInterestRate}
      //       error={
      //         !!formik.touched?.nominalAnnualInterestRate &&
      //         !!formik.errors?.nominalAnnualInterestRate
      //       }
      //       helperText={
      //         !!formik.touched?.nominalAnnualInterestRate &&
      //         formik.errors?.nominalAnnualInterestRate
      //       }
      //     />
      //   ),
      // },
      {
        Header: "Default Interest Rate",
        accessor: (row, i) => row?.annualInterestRate,
      },
      {
        Header: "Description",
        accessor: "description",
      },
      // {
      //   Header: "Actions",
      //   accessor: (row, i) => (
      //     <IconButton
      //       disableRipple
      //       color="primary"
      //       onClick={() => {
      //         setOpen(true);
      //         setIncentives(row?.incentives);
      //       }}
      //     >
      //       <Icon color="red">preview</Icon> view Incentives
      //     </IconButton>
      //   ),
      // },
    ],
    // eslint-disable-next-line
    [formik]
  );

  const interestRateColumnsTableInstance = useTable({
    columns: interestRateColumns,
    data: formik?.values?.charts?.chartSlabs,
    manualPagination: false,
    hideRowCounter: true,
  });

  return (
    <div className="grid gap-4">
      <Paper className="p-4 md:p-8">
        <Typography variant="h6" className="font-bold">
          Interest Rate chart
        </Typography>
        <Typography variant="body2" className="mb-4" color="textSecondary">
          Kindly fill in all required information in the Fixed Deposit
          application form.
        </Typography>

        <div className="grid gap-4 mt-3 md:grid-cols-2 lg:grid-cols-2 max-w-3xl">
          {[
            {
              name: "Name",
              value: data?.accountChart?.name || "",
            },
            {
              name: "Valid From Date",
              value: parseDateToString(data?.accountChart?.fromDate) || "",
            },
            {
              name: "End Date",
              value: parseDateToString(data?.accountChart?.endDate) || "",
            },
            {
              name: "Description",
              value: data?.accountChart?.description || "",
            },
            {
              name: "Primary Grouping by Amount",
              value: data?.accountChart?.isPrimaryGroupingByAmount
                ? "Yes"
                : "No" || "",
            },
          ].map((data, i) => (
            <div key={i}>
              {data?.name}: <b>{data?.value}</b>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <TextField
            onChange={(e) => {
              const { value } = e.target;
              formik.setFieldValue("nominalAnnualInterestRate", value);
            }}
            label="Nominal Annual Interest Rate"
            value={formik.values?.nominalAnnualInterestRate}
            error={
              !!formik.touched?.nominalAnnualInterestRate &&
              !!formik.errors?.nominalAnnualInterestRate
            }
            helperText={
              !!formik.touched?.nominalAnnualInterestRate &&
              formik.errors?.nominalAnnualInterestRate
            }
          />
        </div>

        <div className="mt-5">
          <DynamicTable
            renderPagination={() => null}
            instance={interestRateColumnsTableInstance}
          />
        </div>
      </Paper>

      {open && (
        <ClientXLeadFixedDepositAddEditInterestRateChartIncentive
          open={open}
          data={incentives}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function ClientXLeadFixedDepositAddEditInterestRateChartIncentive({
  open,
  onClose,
  data,
}) {
  const interestRateIncentivesColumns = useMemo(
    () => [
      {
        Header: "Entity Type",
        accessor: (row) => row?.incentives?.value,
      },
      {
        Header: "Attribute Name",
        accessor: (row) => row?.attributeName?.value,
      },
      {
        Header: "Condition Type",
        accessor: (row) => row?.conditionType?.value,
      },
      {
        Header: "Attribute Value",
        accessor: "attributeValue",
      },

      {
        Header: "Incentives Type",
        accessor: (row) => row?.incentiveType?.value,
      },

      {
        Header: "Interest",
        accessor: "annualInterestRate",
      },
    ],
    // eslint-disable-next-line
    []
  );

  const interestRateIncentivesColumnsTableInstance = useTable({
    columns: interestRateIncentivesColumns,
    data: data,
    manualPagination: false,
    hideRowCounter: true,
  });

  return (
    <Modal open={open} onClose={onClose} title="Incentives" size="md">
      <div className="mt-5 w-full">
        <DynamicTable
          renderPagination={() => null}
          instance={interestRateIncentivesColumnsTableInstance}
        />
      </div>
    </Modal>
  );
}

export default ClientXLeadFixedDepositAddEditInterestRateChart;
