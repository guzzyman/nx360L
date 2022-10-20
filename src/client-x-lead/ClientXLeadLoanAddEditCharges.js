import { Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import { Icon } from "@mui/material";
import { FormikProvider } from "formik";
import DynamicTable from "common/DynamicTable";
import useTable from "hooks/useTable";
import Modal from "common/Modal";
import { useMemo, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import IconButton from "@mui/material/IconButton";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { format } from "date-fns/esm";
import CurrencyField from "common/CurrencyField";
import { useSnackbar } from "notistack";
import { isValid } from "date-fns";

function ClientXLeadLoanAddEditCharges({ formik, data }) {
  const [openCollateralModal, setOpenCollateralModal] = useState(false);
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
            // value={formik.values?.approvedOnDate || new Date()}
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

  const overdueChargesColumns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Type",
        accessor: (row) => row?.chargeCalculationType?.value,
      },
      {
        Header: "Collected On",
        accessor: (row) => row?.chargeTimeType?.value,
      },
    ],
    // eslint-disable-next-line
    [formik]
  );

  const collateralColumns = useMemo(
    () => [
      {
        Header: "type",
        accessor: (row) =>
          data?.loanCollateralOptions?.find((el) => el.id === row?.type)?.name,
      },
      {
        Header: "Value",
        accessor: (row) => row?.value,
      },
      {
        Header: "Description",
        accessor: (row) => row?.description,
      },
      {
        Header: "Actions",
        accessor: (row, i) => (
          <IconButton
            onClick={() => {
              let collateralList = formik?.values?.collateral;
              delete collateralList[i];
              formik.setFieldValue(
                `collateral`,
                collateralList.filter((el) => el !== undefined)
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

  const collateralTableInstance = useTable({
    columns: collateralColumns,
    data: formik?.values?.collateral,
    manualPagination: false,
    hideRowCounter: true,
  });

  const chargesTableInstance = useTable({
    columns: chargesColumns,
    data: formik?.values?.charges,
    manualPagination: false,
    hideRowCounter: true,
  });

  const overdueChargesTableInstance = useTable({
    columns: overdueChargesColumns,
    data: data?.overdueCharges,
    manualPagination: false,
    hideRowCounter: true,
  });

  return (
    <FormikProvider value={formik}>
      {openCollateralModal && (
        <ClientXLeadLoanAddEditChargesCollateralModal
          open={openCollateralModal}
          data={data}
          formik={formik}
          onClose={() => setOpenCollateralModal(false)}
        />
      )}

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
            <div className="flex gap-2 max-w-md mb-10">
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
                        ...formik.values.charges,
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

              <div className="mt-5">
                <Typography variant="h6" className="font-bold mb-2">
                  Overdue Charges
                </Typography>
                <DynamicTable
                  renderPagination={() => null}
                  instance={overdueChargesTableInstance}
                />
              </div>
            </div>
          </div>
        </Paper>

        <Paper className="p-4 md:p-8">
          <Typography variant="h6" className="font-bold mb-4">
            Collateral Data{" "}
            <Button
              startIcon={<Icon>add</Icon>}
              onClick={() => setOpenCollateralModal(true)}
              size="large"
            >
              Add
            </Button>
          </Typography>

          {formik?.values?.collateral?.length >= 1 && (
            <DynamicTable
              renderPagination={() => null}
              instance={collateralTableInstance}
            />
          )}
        </Paper>
      </div>
    </FormikProvider>
  );
}

function ClientXLeadLoanAddEditChargesCollateralModal({
  formik,
  data,
  open,
  onClose,
}) {
  const localFormik = useFormik({
    initialValues: {
      type: "",
      value: "",
      description: "",
    },
    validateOnChange: false, // this one
    validateOnBlur: false,
    validationSchema: Yup.object({
      type: Yup.string().required(),
      value: Yup.string().required(),
      description: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      try {
        formik.setFieldValue(`collateral`, [
          ...formik.values.collateral,
          {
            type: values?.type,
            value: values?.value,
            description: values?.description,
          },
        ]);
        onClose();
      } catch (error) {}
    },
  });

  const newLocal = (
    <Button onClick={onClose} size="large" variant="outlined" fullWidth>
      Cancel
    </Button>
  );
  return (
    <Modal open={open} onClose={onClose} title="Add Collateral">
      <div>
        <TextField
          select
          {...getTextFieldFormikProps(localFormik, "type")}
          fullWidth
          required
          label="Type"
          className="mb-3"
        >
          {data?.loanCollateralOptions &&
            data?.loanCollateralOptions?.map((option, i) => (
              <MenuItem key={i} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
        </TextField>

        <CurrencyField
          fullWidth
          required
          {...getTextFieldFormikProps(localFormik, "value")}
          label="Value"
          className="mb-3"
        />

        <TextField
          fullWidth
          required
          {...getTextFieldFormikProps(localFormik, "description")}
          label="Description"
          multiline
          rows={3}
          className="mb-3"
        />
      </div>

      <div className="flex gap-2">
        {newLocal}

        <Button fullWidth size="large" onClick={localFormik.handleSubmit}>
          Done
        </Button>
      </div>
    </Modal>
  );
}

export default ClientXLeadLoanAddEditCharges;
