import { Icon, IconButton, Paper } from "@mui/material";
import { useMemo, useState } from "react";
import DynamicTable from "common/DynamicTable";
import useTable from "hooks/useTable";

import Modal from "common/Modal";

function CRMClientFixedDepositInterestRateChart({ queryResult }) {
  const [open, setOpen] = useState(false);
  const { data } = queryResult;
  const [incentives, setIncentives] = useState({});
  const interestRateColumns = useMemo(
    () => [
      {
        Header: "periodType",
        accessor: (row) => row?.periodType?.value,
      },
      {
        Header: "period From/To",
        accessor: (row) => `${row?.fromPeriod || ""}-${row?.toPeriod || ""}`,
      },
      {
        Header: "Amount Range",
        accessor: (row) =>
          `${row?.periodType?.amountRangeFrom || "__"} - ${
            row?.periodType?.amountRangeTo || "__"
          }`,
      },
      {
        Header: "Interest",
        accessor: "annualInterestRate",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Actions",
        accessor: (row, i) => (
          <IconButton
            disableRipple
            color="primary"
            onClick={() => {
              setOpen(true);
              setIncentives(row?.incentives);
            }}
          >
            <Icon color="red">preview</Icon> view Incentives
          </IconButton>
        ),
      },
    ],
    // eslint-disable-next-line
    [data]
  );

  const interestRateColumnsTableInstance = useTable({
    columns: interestRateColumns,
    data: data?.accountChart?.chartSlabs,
    manualPagination: false,
    hideRowCounter: true,
  });

  return (
    <div className="grid gap-4">
      <Paper className="p-4 md:p-8">
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

export default CRMClientFixedDepositInterestRateChart;

function ClientXLeadFixedDepositAddEditInterestRateChartIncentive({
  open,
  onClose,
  data,
}) {
  const interestRateIncentivesColumns = useMemo(
    () => [
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
