import {
  Paper,
  TextField,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Icon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  getCheckFieldFormikProps,
  getTextFieldFormikProps,
} from "common/Utils";
import { DatePicker } from "@mui/lab";
import { useState } from "react";
import CurrencyTextField from "common/CurrencyTextField";

function FixedDepositProductCreateEditInterestRate({
  formik,
  recurringDepositProductTemplate,
}) {
  const [activeIncentiveModalIndex, setActiveIncentiveModalIndex] =
    useState(-1);

  return (
    <>
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Interest Rate
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className="max-w-lg mb-4"
        >
          Ensure you enter correct information. The interest rate chart provides
          the information required to calculate the interest payable on a fixed
          deposit account based on the fixed deposit product.
        </Typography>
        {formik.values.charts?.map((chart, chartIndex) => {
          const chartKey = `charts[${chartIndex}]`;
          return (
            <>
              <div
                className="grid sm:grid-cols-3 gap-4 mb-4"
                style={{ maxWidth: 750 }}
              >
                <DatePicker
                  disablePast
                  label="Valid From Date"
                  value={chart?.fromDate}
                  onChange={(newValue) => {
                    formik.setFieldValue(chartKey + ".fromDate", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      required
                      {...getTextFieldFormikProps(
                        formik,
                        chartKey + ".fromDate"
                      )}
                      {...params}
                    />
                  )}
                />
                <DatePicker
                  disablePast
                  minDate={formik.values.startDate}
                  label="End Date"
                  value={chart?.endDate}
                  onChange={(newValue) => {
                    formik.setFieldValue(chartKey + ".endDate", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      required
                      {...getTextFieldFormikProps(
                        formik,
                        chartKey + ".endDate"
                      )}
                      {...params}
                    />
                  )}
                />
                {/* <FormControlLabel
                  label="Is primary grouping by Amount"
                  control={
                    <Checkbox
                      {...getCheckFieldFormikProps(
                        formik,
                        chartKey + ".isPrimaryGroupingByAmount"
                      )}
                    />
                  }
                /> */}
              </div>
              {chart?.chartSlabs?.map((chartSlab, chartSlabIndex) => {
                const chartSlabKey = `${chartKey}.chartSlabs[${chartSlabIndex}]`;

                return (
                  <div className="relative bg-gray-100 p-4 rounded-md mb-4">
                    <div className="absolute -right-4 -top-4">
                      <IconButton
                        onClick={() => {
                          const newChartSlabs = [...chart?.chartSlabs];
                          newChartSlabs.splice(chartSlabIndex, 1);
                          formik.setFieldValue(
                            chartKey + ".chartSlabs",
                            newChartSlabs
                          );
                        }}
                      >
                        <Icon>cancel</Icon>
                      </IconButton>
                    </div>
                    {!!chart?.isPrimaryGroupingByAmount && (
                      <>
                        <Typography className="font-bold" gutterBottom>
                          Amount Range
                        </Typography>
                        <div
                          className="grid sm:grid-cols-2 gap-4 mb-4"
                          style={{ maxWidth: 500 }}
                        >
                          <CurrencyTextField
                            code={formik.values?.currencyCode}
                            fullWidth
                            required
                            label="From"
                            {...getTextFieldFormikProps(
                              formik,
                              chartSlabKey + "amountRangeFrom"
                            )}
                          />
                          <CurrencyTextField
                            code={formik.values?.currencyCode}
                            fullWidth
                            required
                            label="To"
                            {...getTextFieldFormikProps(
                              formik,
                              chartSlabKey + "amountRangeTo"
                            )}
                          />
                        </div>
                      </>
                    )}
                    <>
                      <Typography className="font-bold" gutterBottom>
                        Period
                      </Typography>
                      <div
                        className="grid sm:grid-cols-3 gap-4 mb-4"
                        style={{ maxWidth: 750 }}
                      >
                        <TextField
                          fullWidth
                          select
                          label="Type"
                          displayEmpty
                          {...getTextFieldFormikProps(
                            formik,
                            chartSlabKey + ".periodType"
                          )}
                        >
                          {recurringDepositProductTemplate?.chartTemplate?.periodTypes?.map(
                            (option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.value}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                        {/* <TextField
                          fullWidth
                          required
                          label="From"
                          {...getTextFieldFormikProps(
                            formik,
                            chartSlabKey + ".fromPeriod"
                          )}
                        />
                        <TextField
                          fullWidth
                          required
                          label="To"
                          {...getTextFieldFormikProps(
                            formik,
                            chartSlabKey + ".toPeriod"
                          )}
                        /> */}
                      </div>
                    </>
                    <div
                      className="grid sm:grid-cols-2 gap-4 mb-4"
                      style={{ maxWidth: 500 }}
                    >
                      <TextField
                        fullWidth
                        required
                        label="Interest"
                        {...getTextFieldFormikProps(
                          formik,
                          chartSlabKey + ".annualInterestRate"
                        )}
                      />
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Description"
                        className="sm:col-span-2"
                        {...getTextFieldFormikProps(
                          formik,
                          chartSlabKey + ".description"
                        )}
                      />
                    </div>
                    {/* <div className="flex items-center justify-center">
                      <Button
                        startIcon={<Icon>add</Icon>}
                        onClick={() => {
                          setActiveIncentiveModalIndex(chartSlabIndex);
                        }}
                      >
                        Add Incentives
                      </Button>
                    </div> */}
                    <Dialog
                      open={chartSlabIndex === activeIncentiveModalIndex}
                      fullWidth
                      maxWidth="xl"
                    >
                      <DialogTitle>Incentives</DialogTitle>
                      <DialogContent className="pt-2">
                        {chartSlab?.incentives?.map(
                          (incentive, incentiveIndex) => {
                            const incentiveKey = `${chartSlabKey}.incentives[${incentiveIndex}]`;
                            return (
                              <div className="relative bg-gray-100 p-4 rounded-md grid sm:grid-cols-2 lg:grid-cols-3 lg: xl:grid-cols-5 gap-4 mb-4">
                                <div className="absolute -right-4 -top-4">
                                  <IconButton
                                    onClick={() => {
                                      const newIncentives = [
                                        ...chartSlab?.incentives,
                                      ];
                                      newIncentives.splice(incentiveIndex, 1);
                                      formik.setFieldValue(
                                        chartSlabKey + ".incentives",
                                        newIncentives
                                      );
                                    }}
                                  >
                                    <Icon>cancel</Icon>
                                  </IconButton>
                                </div>
                                <TextField
                                  fullWidth
                                  select
                                  label="Attribute"
                                  displayEmpty
                                  {...getTextFieldFormikProps(
                                    formik,
                                    incentiveKey + ".attributeName"
                                  )}
                                >
                                  {recurringDepositProductTemplate?.chartTemplate?.attributeNameOptions?.map(
                                    (option) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {option.value}
                                      </MenuItem>
                                    )
                                  )}
                                </TextField>
                                <TextField
                                  fullWidth
                                  select
                                  label="Condition"
                                  displayEmpty
                                  {...getTextFieldFormikProps(
                                    formik,
                                    incentiveKey + ".conditionType"
                                  )}
                                >
                                  {recurringDepositProductTemplate?.chartTemplate?.conditionTypeOptions?.map(
                                    (option) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {option.value}
                                      </MenuItem>
                                    )
                                  )}
                                </TextField>
                                <TextField
                                  fullWidth
                                  required
                                  label="Value"
                                  {...getTextFieldFormikProps(
                                    formik,
                                    incentiveKey + ".attributeValue"
                                  )}
                                />
                                <TextField
                                  fullWidth
                                  select
                                  label="Type"
                                  displayEmpty
                                  {...getTextFieldFormikProps(
                                    formik,
                                    incentiveKey + ".incentiveType"
                                  )}
                                >
                                  {recurringDepositProductTemplate?.chartTemplate?.incentiveTypeOptions?.map(
                                    (option) => (
                                      <MenuItem
                                        key={option.id}
                                        value={option.id}
                                      >
                                        {option.value}
                                      </MenuItem>
                                    )
                                  )}
                                </TextField>
                                <TextField
                                  fullWidth
                                  required
                                  label="Interest"
                                  {...getTextFieldFormikProps(
                                    formik,
                                    incentiveKey + ".amount"
                                  )}
                                />
                              </div>
                            );
                          }
                        )}
                        <div className="flex items-center justify-center gap-4  ">
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Icon>clear</Icon>}
                            onClick={() => {
                              setActiveIncentiveModalIndex(-1);
                            }}
                          >
                            Close
                          </Button>
                          <Button
                            startIcon={<Icon>add</Icon>}
                            onClick={() => {
                              formik.setFieldValue(
                                chartSlabKey + ".incentives",
                                [
                                  ...chartSlab?.incentives,
                                  {
                                    entityType: 2,
                                    attributeName: "",
                                    conditionType: "",
                                    attributeValue: "",
                                    incentiveType: "",
                                    amount: "",
                                  },
                                ]
                              );
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                );
              })}
            </>
          );
        })}
        {/* <div className="flex items-center justify-center">
          <Button
            startIcon={<Icon>add</Icon>}
            onClick={() => {
              formik.setFieldValue(`charts[${0}].chartSlabs`, [
                ...(formik.values.charts?.[0]?.chartSlabs || []),
                {
                  periodType: "",
                  fromPeriod: "",
                  toPeriod: "",
                  amountRangeFrom: "",
                  amountRangeTo: "",
                  annualInterestRate: "",
                  description: "",
                  incentives: [],
                  // dateFormat: DateConfig.FORMAT,
                  // locale: DateConfig.LOCALE,
                },
              ]);
            }}
          >
            Add Chart Slab
          </Button>
        </div> */}
      </Paper>
    </>
  );
}

export default FixedDepositProductCreateEditInterestRate;
