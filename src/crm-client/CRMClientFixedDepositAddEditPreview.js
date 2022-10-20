import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactComponent as EditSvg } from "assets/svgs/edit-icon.svg";
import DynamicTable from "common/DynamicTable";
import FormatToCurrency from "common/FormatToCurrency";
import { parseDateToString } from "common/Utils";
import { useTable } from "react-table";

function CRMClientFixedDepositAddEditPreview({ formik, data, setStep }) {
  const formikValue = formik?.values;
  const previewConfig = [
    {
      title: "Details",
      step: 0,
      data: [
        {
          title: "Product Name",
          value:
            data?.productOptions?.find((e) => e.id === formikValue?.productId)
              ?.name || "",
        },
        {
          title: "Submitted On",
          value: formikValue?.submittedOnDate || "",
        },
        {
          title: "Field Officer",
          value:
            data?.fieldOfficerOptions?.find(
              (e) => e.id === formikValue?.fieldOfficerId
            )?.displayName || "",
        },
        {
          title: "External ID",
          value: formikValue?.externalId || "",
        },
      ],
    },

    {
      title: "Terms",
      step: 2,
      data: [
        {
          title: "Deposit Amount",
          value: formikValue?.depositAmount || "",
        },
        {
          title: "Deposit Period Frequency",
          value: formikValue?.depositPeriod || "",
        },
        {
          title: "Deposit Period Type",
          value:
            data?.periodFrequencyTypeOptions?.find(
              (e) => e.id === formikValue?.depositPeriodFrequencyId
            )?.value || "",
        },
        {
          title: "Interest Compounding Period",
          value:
            data?.interestCompoundingPeriodTypeOptions?.find(
              (e) => e.id === formikValue?.interestCompoundingPeriodType
            )?.value || "",
        },
        {
          title: "Interest Posting Period",
          value:
            data?.interestPostingPeriodTypeOptions?.find(
              (e) => e.id === formikValue?.interestPostingPeriodType
            )?.value || "",
        },
        {
          title: "Interest Calculated using",
          value:
            data?.interestCalculationTypeOptions?.find(
              (e) => e.id === formikValue?.interestCalculationType
            )?.value || "",
        },
        {
          title: "Days in Year",
          value:
            data?.interestCalculationDaysInYearTypeOptions?.find(
              (e) => e.id === formikValue?.interestCalculationDaysInYearType
            )?.value || "",
        },
      ],
    },

    {
      title: "Settings",
      step: 3,
      data: [
        {
          title: "Lock-in Period",
          value: `${formikValue?.lockinPeriodFrequency || ""}  ${
            data?.lockinPeriodFrequencyTypeOptions?.find(
              (e) => e.id === formikValue?.lockinPeriodFrequencyType
            )?.value || ""
          }`,
        },
        {
          title: "Minimum Deposit Term",
          value: `${formikValue?.minDepositTerm || ""}  ${
            data?.periodFrequencyTypeOptions?.find(
              (e) => e.id === formikValue?.minDepositTermTypeId
            )?.value || ""
          }`,
        },
        {
          title: "And thereafter, in Multiples of",
          value: `${formikValue?.inMultiplesOfDepositTerm || ""}  ${
            data?.periodFrequencyTypeOptions?.find(
              (e) => e.id === formikValue?.inMultiplesOfDepositTermTypeId
            )?.value || ""
          }`,
        },
        {
          title: "Maximum Deposit Term",
          value: `${formikValue?.maxDepositTerm || ""}  ${
            data?.periodFrequencyTypeOptions?.find(
              (e) => e.id === formikValue?.maxDepositTermTypeId
            )?.value || ""
          }`,
        },
        {
          title: "Link Savings",
          value:
            data?.savingsAccounts?.find(
              (e) => e.id === formikValue?.linkAccountId
            )?.accountNo ||
            "" ||
            "",
        },
        {
          title: "For Pre-mature closure",
          value: `${formikValue?.preClosurePenalInterest || ""}%  ${
            data?.preClosurePenalInterestOnTypeOptions?.find(
              (e) => e.id === formikValue?.preClosurePenalInterestOnTypeId
            )?.value || ""
          }`,
        },
      ],
    },

    {
      title: "Interest Rate Chart",
      step: 4,
      data: [
        {
          title: "Name",
          value: data?.accountChart?.name || "",
        },
        {
          title: "Valid From Date",
          value: parseDateToString(data?.accountChart?.fromDate) || "",
        },
        {
          title: "End Date",
          value: parseDateToString(data?.accountChart?.endDate) || "",
        },
        {
          title: "Description",
          value: data?.accountChart?.description || "",
        },
        {
          title: "Primary Grouping by Amount",
          value: data?.accountChart?.isPrimaryGroupingByAmount
            ? "Yes"
            : "No" || "",
        },
      ],
    },

    // {
    //   title: "Charges",
    //   step: 5,
    //   table: true,
    //   data: formikValue?.charges,
    //   dataColumns: [
    //     {
    //       Header: "Name",
    //       accessor: (row) =>
    //         data?.chargeOptions?.find((el) => el.id === row?.chargeId)?.name,
    //     },
    //     {
    //       Header: "Type",
    //       accessor: (row) =>
    //         data?.chargeOptions?.find((el) => el.id === row?.chargeId)
    //           ?.chargeCalculationType?.value,
    //     },
    //     {
    //       Header: "Amount(N)",
    //       accessor: (row) => FormatToCurrency(row?.amount),
    //     },
    //     {
    //       Header: "Collected On",
    //       accessor: (row) =>
    //         data?.chargeOptions?.find((el) => el.id === row?.chargeId)
    //           ?.chargeTimeType?.value,
    //     },
    //     {
    //       Header: "Date",
    //       accessor: (row, i) => row?.dueDate,
    //     },
    //   ],
    // },
  ];

  return (
    <div className="pb-10">
      {previewConfig.map((preview, i) => (
        <Paper key={i} className="my-10 py-10 px-5 rounded-md">
          <div>
            <div className="flex justify-between">
              <Typography variant="h5" mr={5}>
                <b>{preview?.title}</b>
              </Typography>
              <Button
                onClick={() => setStep(parseInt(`${preview?.step}`))}
                variant="text"
                endIcon={<EditSvg />}
              />
            </div>
          </div>

          {preview?.table && (
            <div>
              <CRMClientFixedDepositAddEditPreviewTable
                columns={preview?.dataColumns}
                data={preview?.data}
              />
            </div>
          )}

          <Box>
            <Grid container>
              {!preview?.table &&
                preview?.data.map((data, i) => (
                  <Grid item xs={6} md={3} mt={3}>
                    <Box>
                      <Typography variant="caption">{data?.title}</Typography>
                      <Typography variant="body1">{data?.value}</Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Paper>
      ))}
    </div>
  );
}

function CRMClientFixedDepositAddEditPreviewTable({ columns, data }) {
  const tableInstance = useTable({
    columns,
    data,
    manualPagination: false,
    hideRowCounter: true,
  });

  return (
    <DynamicTable instance={tableInstance} renderPagination={() => null} />
  );
}

export default CRMClientFixedDepositAddEditPreview;
