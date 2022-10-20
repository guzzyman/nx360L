import { Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { Icon } from "@mui/material";
import { FormikProvider } from "formik";
import DynamicTable from "common/DynamicTable";
import useTable from "hooks/useTable";
import { useMemo, useState } from "react";
import IconButton from "@mui/material/IconButton";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { format } from "date-fns/esm";
import CurrencyField from "common/CurrencyField";
import { useSnackbar } from "notistack";
import { isValid } from "date-fns";

function ClientXLeadFixedDepositAddEditCharges({ formik, data }) {
  const [chargeId, setChargeId] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleChangeChargeId = (e) => {
    setChargeId(e.target.value);
  };
  const chargesColumns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: (row) =>
          data?.chargeOptions?.find((el) => el.id === row?.chargeId)?.name,
      },
      {
        Header: "Type",
        accessor: (row) =>
          data?.chargeOptions?.find((el) => el.id === row?.chargeId)
            ?.chargeCalculationType?.value,
      },
      {
        Header: "Amount(N)",
        accessor: (row, i) => (
          <CurrencyField
            {...formik.getFieldProps(`charges.[${i}].amount`)}
            value={
              formik.values?.charges?.[i]?.amount ||
              data?.chargeOptions?.find((el) => el.id === row?.chargeId)
                ?.amount ||
              ""
            }
            error={
              !!formik.touched?.charges?.[i]?.amount &&
              !!formik.errors?.charges?.[i]?.amount
            }
            helperText={
              !!formik.touched?.charges?.[i]?.amount &&
              formik.errors?.charges?.[i]?.amount
            }
          />
        ),
      },
      {
        Header: "Collected On",
        accessor: (row) =>
          data?.chargeOptions?.find((el) => el.id === row?.chargeId)
            ?.chargeTimeType?.value,
      },
      {
        Header: "Date",
        accessor: (row, i) => (
          <DesktopDatePicker
            label="Due Date*"
            inputFormat="dd/MM/yyyy"
            error={
              !!formik.touched?.charges?.[i]?.dueDate &&
              !!formik.errors?.charges?.[i]?.dueDate
            }
            helperText={
              !!formik.touched?.charges?.[i]?.dueDate &&
              formik.errors?.charges?.[i]?.dueDate
            }
            onChange={(newValue) => {
              if (isValid(new Date(newValue))) {
                formik.setFieldValue(
                  `charges.[${i}].dueDate`,
                  format(new Date(newValue), "dd MMMM yyyy")
                );
              }
            }}
            InputProps={{ readOnly: true }}
            value={formik.values?.charges?.[i]?.dueDate || new Date()}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        ),
      },
      {
        Header: "Actions",
        accessor: (row, i) => (
          <IconButton
            onClick={() => {
              let chargesList = formik?.values?.charges;
              delete chargesList[i];
              formik.setFieldValue(
                `charges`,
                chargesList.filter((el) => el !== undefined)
              );
            }}
          >
            <Icon color="red">cancel</Icon>
          </IconButton>
        ),
      },
    ],
    // eslint-disable-next-line
    [formik]
  );

  const chargesTableInstance = useTable({
    columns: chargesColumns,
    data: formik?.values?.charges,
    manualPagination: false,
    hideRowCounter: true,
  });

  return (
    <FormikProvider value={formik}>
      <div className="grid gap-4">
        <Paper className="p-4 md:p-8">
          <Typography variant="h6" className="font-bold">
            Details
          </Typography>
          <Typography variant="body2" className="mb-4" color="textSecondary">
            Kindly fill in all required information in the loan application
            form.
          </Typography>

          <div className="w-full">
            <div className="flex items-center gap-2 max-w-md mb-10">
              <TextField
                select
                fullWidth
                required
                label="Charge"
                value={chargeId}
                onChange={handleChangeChargeId}
              >
                {data?.chargeOptions &&
                  data?.chargeOptions?.map((option, i) => (
                    <MenuItem key={i} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
              </TextField>
              <div>
                <Button
                  startIcon={<Icon>add</Icon>}
                  disabled={
                    chargeId ||
                    formik.values?.charges?.find(
                      (el) => el.chargeId === chargeId
                    )?.chargeId === chargeId
                      ? false
                      : true
                  }
                  onClick={() => {
                    if (
                      formik.values?.charges?.find(
                        (el) => el.chargeId === chargeId
                      )
                    ) {
                      enqueueSnackbar("Charges already exist!", {
                        variant: "error",
                      });
                    } else {
                      formik.setFieldValue(`charges`, [
                        ...formik?.values?.charges,
                        {
                          chargeId: chargeId,
                          amount: data?.chargeOptions?.find(
                            (el) => el.id === chargeId
                          )?.amount,
                          dueDate: "",
                        },
                      ]);
                    }

                    setChargeId("");
                  }}
                  size="large"
                >
                  Add
                </Button>
              </div>
            </div>

            <div>
              {formik?.values?.charges?.length >= 1 && (
                <>
                  <div>
                    <Typography variant="h6" className="font-bold mb-2">
                      Charges
                    </Typography>
                    <DynamicTable
                      renderPagination={() => null}
                      instance={chargesTableInstance}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </Paper>
      </div>
    </FormikProvider>
  );
}

export default ClientXLeadFixedDepositAddEditCharges;
