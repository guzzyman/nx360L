import { LoadingButton } from "@mui/lab";
import Modal from "common/Modal";

import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo } from "react";
import * as yup from "yup";
import { LoanDeciderStoreQuerySlice } from "./LoanDeciderStoreQuerySlice";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import LoanDeciderAddEditBankStatement from "./LoanDeciderAddEditBankStatement";
import {
  Checkbox,
  FormControlLabel,
  Icon,
  MenuItem,
  TextField,
} from "@mui/material";
import LoanDeciderAddEditCreditReportAnalysis from "./LoanDeciderAddEditCreditReportAnalysis";
import LoanDeciderAddEditBankScheduleAnalysis from "./LoanDeciderAddEditBankScheduleAnalysis";
import LoanDeciderAddEditRemitaReferencingAnalysis from "./LoanDeciderAddEditRemitaReferencingAnalysis";
import { useState } from "react";
import { nimbleX360CRMLoanProductApi } from "loan-product/LoanProductStoreQuerySlice";
import { getTextFieldFormikProps } from "common/Utils";

export default function LoanDeciderAddEditDialog({
  open,
  onClose,
  loanDeciderInstance,
  setLoanDeciderInstance,
}) {
  const [isView, setIsView] = useState(false);
  const isEdit = !!loanDeciderInstance?.productId;
  const { enqueueSnackbar } = useSnackbar();

  const loanProductQuery =
    nimbleX360CRMLoanProductApi.useGetLoanProductsQuery();
  const { data: loanDeciderData } =
    LoanDeciderStoreQuerySlice.useGetAdminLoanDeciderQuery(
      loanDeciderInstance.productId,
      { skip: !isEdit }
    );

  console.log("loanDeciderData", loanDeciderData);

  const [addLoanDecider, addLoanDeciderQuery] =
    LoanDeciderStoreQuerySlice.useAddAdminLoanDeciderMutation();
  const [editLoanDecider, editLoanDeciderQuery] =
    LoanDeciderStoreQuerySlice.useEditAdminLoanDeciderMutation();
  console.log(
    "loanDeciderData?.data?.hasOwnProperty",
    loanDeciderData?.data?.hasOwnProperty("showBankScheduleAnalysis")
  );
  const formik = useFormik({
    initialValues: {
      productId: loanDeciderData?.data?.bankStatement?.productId || "",
      productName: loanDeciderData?.data?.productName || "",
      showBankStatement: loanDeciderInstance.bankStatement || true,
      bankStatement: {
        averageInflowMin:
          loanDeciderData?.data?.bankStatement?.averageInflowMin || "",
        averageInflowMax:
          loanDeciderData?.data?.bankStatement?.averageInflowMax || "",
        accountSweep:
          loanDeciderData?.data?.bankStatement?.accountSweep || "false",
        minGamblingRate:
          loanDeciderData?.data?.bankStatement?.minGamblingRate || "",
        lastIntervalOfCredit:
          loanDeciderData?.data?.bankStatement?.lastIntervalOfCredit || "",
        miniNoOfSalaryPayment:
          loanDeciderData?.data?.bankStatement?.miniNoOfSalaryPayment || "",
        salaryEarnerDSR:
          loanDeciderData?.data?.bankStatement?.salaryEarnerDSR || "",
        nonSalaryEarnerDSR:
          loanDeciderData?.data?.bankStatement?.nonSalaryEarnerDSR || "",
        allowNull: loanDeciderData?.data?.bankStatement?.allowNull || "",
      },

      showCreditReport: loanDeciderInstance.creditReport || false,
      creditReport: {
        maximumDaysInArrears:
          loanDeciderData?.data?.creditReport?.maximumDaysInArrears || "",
        maximumAccountsInArrears:
          loanDeciderData?.data?.creditReport?.maximumAccountsInArrears || "",
        allowNull: loanDeciderData?.data?.creditReport?.allowNull || "",
      },

      showBankScheduleAnalysis: loanDeciderInstance.bankSchedule || false,
      bankScheduleAnalysis: {
        monthInView:
          loanDeciderData?.data?.bankScheduleAnalysis?.monthInView || "",
        minNoOSalary:
          loanDeciderData?.data?.bankScheduleAnalysis?.minNoOSalary || "",
        minNetPay: loanDeciderData?.data?.bankScheduleAnalysis?.minNetPay || "",
        minGrossPay:
          loanDeciderData?.data?.bankScheduleAnalysis?.minGrossPay || "",
        dsr: loanDeciderData?.data?.bankScheduleAnalysis?.dsr || "",
        preferredPaymentMode:
          loanDeciderData?.data?.bankScheduleAnalysis?.preferredPaymentMode ||
          "",
        allowNull: loanDeciderData?.data?.bankScheduleAnalysis?.allowNull || "",
      },

      showRemitaReferencingAnalysis: loanDeciderInstance.remit || false,
      remitaReferencingAnalysis: {
        monthInView:
          loanDeciderData?.data?.remitaReferencingAnalysis?.monthInView || "",
        minimumNoOfSalaryPayment:
          loanDeciderData?.data?.remitaReferencingAnalysis
            ?.minimumNoOfSalaryPayment || "",
        minimumNetPay:
          loanDeciderData?.data?.remitaReferencingAnalysis?.minimumNetPay || "",
        minimumGrossPay:
          loanDeciderData?.data?.remitaReferencingAnalysis?.minimumGrossPay ||
          "",
        preferredPaymentMode:
          loanDeciderData?.data?.remitaReferencingAnalysis
            ?.preferredPaymentMode || "",
        allowNull:
          loanDeciderData?.data?.remitaReferencingAnalysis?.allowNull || "",
        dsr: loanDeciderData?.data?.remitaReferencingAnalysis?.dsr || "",
      },
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      productId: yup.string().when("showBankStatement", {
        is: true,
        then: yup.string().required(),
      }),
      productName: yup.string().required(),
      bankStatement: yup.object({
        averageInflowMin: yup
          .string()
          .label("Average Inflow Min.")
          .when("showBankStatement", {
            is: true,
            then: yup.string().when("showBankStatement", {
              is: true,
              then: yup.string().required(),
            }),
          }),
        averageInflowMax: yup
          .string()
          .label("Average Inflow Max.")
          .when("showBankStatement", {
            is: true,
            then: yup.string().required(),
          }),
        accountSweep: yup
          .string()
          .label("Account Sweep")
          .when("showBankStatement", {
            is: true,
            then: yup.string().required(),
          }),
        minGamblingRate: yup
          .string()
          .label("Min Gambling Rate")
          .when("showBankStatement", {
            is: true,
            then: yup.string().required(),
          }),
        lastIntervalOfCredit: yup
          .string()
          .label("Last Interval Of Credit")
          .when("showBankStatement", {
            is: true,
            then: yup.string().required(),
          }),
        miniNoOfSalaryPayment: yup
          .string()
          .label("Min No Of Salary Payment")
          .when("showBankStatement", {
            is: true,
            then: yup.string().required(),
          }),
        salaryEarnerDSR: yup
          .string()
          .label("Salary Earner DSR")
          .when("showBankStatement", {
            is: true,
            then: yup.string().required(),
          }),
        nonSalaryEarnerDSR: yup
          .string()
          .label("Non Salary Earner DSR")
          .when("showBankStatement", {
            is: true,
            then: yup.string().required(),
          }),
        allowNull: yup.string().label("Allow Null").when("showBankStatement", {
          is: true,
          then: yup.string().required(),
        }),
      }),
      creditReport: yup.object({
        maximumDaysInArrears: yup
          .string()
          .label("Maximum Days In Arrears")
          .when("showCreditReport", {
            is: true,
            then: yup.string().when("showCreditReport", {
              is: true,
              then: yup.string().required(),
            }),
          }),
        maximumAccountsInArrears: yup
          .string()
          .label("Maximum Account In Arrears")
          .when("showCreditReport", {
            is: true,
            then: yup.string().required(),
          }),
        allowNull: yup.string().label("Allow Null").when("showCreditReport", {
          is: true,
          then: yup.string().required(),
        }),
      }),
      bankScheduleAnalysis: yup.object({
        monthInView: yup
          .string()
          .label("Month In View")
          .when("showBankScheduleAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
        minNoOSalary: yup
          .string()
          .label("Minimum Number Of salary")
          .when("showBankScheduleAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
        minGrossPay: yup
          .string()
          .label("Minimum Gross Pay")
          .when("showBankScheduleAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
        minNetPay: yup
          .string()
          .label("Minimum Net Pay")
          .when("showRemitaReferencingAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
        preferredPaymentMode: yup
          .string()
          .label("Preferred Payment Mode")
          .when("showBankScheduleAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
        allowNull: yup
          .string()
          .label("Allow Null")
          .when("showBankScheduleAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
      }),
      remitaReferencingAnalysis: yup.object({
        monthInView: yup
          .string()
          .label("Month In View")
          .when("showRemitaReferencingAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
        minimumNoOfSalaryPayment: yup
          .string()
          .label("Minimum Number Of salary Payment")
          .when("showRemitaReferencingAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
        minimumNetPay: yup
          .string()
          .label("Minimum Net Pay")
          .when("showRemitaReferencingAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
        minimumGrossPay: yup
          .string()
          .label("Minimum Gross Pay")
          .when("showRemitaReferencingAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
        preferredPaymentMode: yup
          .string()
          .label("Preferred Payment Mode")
          .when("showRemitaReferencingAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
        // dsr: yup.string().label("DSR").when("showRemitaReferencingAnalysis", {
        //   is: true,
        //   then: yup.string().required(),
        // }),
        allowNull: yup
          .string()
          .label("Allow Null")
          .when("showRemitaReferencingAnalysis", {
            is: true,
            then: yup.string().required(),
          }),
      }),
    }),

    onSubmit: async (values) => {
      try {
        const newValues = {
          productId: values?.productId || "",
          productName: values?.productName || "",
          ...(values.showBankStatement
            ? {
                bankStatement: {
                  averageInflowMin:
                    values?.bankStatement?.averageInflowMin || "",
                  averageInflowMax:
                    values?.bankStatement?.averageInflowMax || "",
                  accountSweep: values?.bankStatement?.accountSweep || "",
                  minGamblingRate: values?.bankStatement?.minGamblingRate || "",
                  lastIntervalOfCredit:
                    values?.bankStatement?.lastIntervalOfCredit || "",
                  miniNoOfSalaryPayment:
                    values?.bankStatement?.miniNoOfSalaryPayment || "",
                  salaryEarnerDSR: values?.bankStatement?.salaryEarnerDSR || "",
                  nonSalaryEarnerDSR:
                    values?.bankStatement?.nonSalaryEarnerDSR || "",
                  allowNull: values?.bankStatement?.allowNull || "",
                },
              }
            : {}),
          ...(values.showCreditReport
            ? {
                creditReport: {
                  maximumDaysInArrears:
                    values?.creditReport?.maximumDaysInArrears || "",
                  maximumAccountsInArrears:
                    values?.creditReport?.maximumAccountsInArrears || "",
                  allowNull: values?.creditReport?.allowNull || "",
                },
              }
            : {}),
          ...(values.showBankScheduleAnalysis
            ? {
                bankScheduleAnalysis: {
                  monthInView: values?.bankScheduleAnalysis?.monthInView || "",
                  minNoOSalary:
                    values?.bankScheduleAnalysis?.minNoOSalary || "",
                  minNetPay: values?.bankScheduleAnalysis?.minNetPay || "",
                  minGrossPay: values?.bankScheduleAnalysis?.minGrossPay || "",
                  dsr: values?.bankScheduleAnalysis?.dsr || "",
                  preferredPaymentMode:
                    values?.bankScheduleAnalysis?.preferredPaymentMode || "",
                  allowNull: values?.bankScheduleAnalysis?.allowNull || "",
                },
              }
            : {}),
          ...(values.showRemitaReferencingAnalysis
            ? {
                remitaReferencingAnalysis: {
                  monthInView:
                    values?.remitaReferencingAnalysis?.monthInView || "",
                  minimumNoOfSalaryPayment:
                    values?.remitaReferencingAnalysis
                      ?.minimumNoOfSalaryPayment || "",
                  minimumNetPay:
                    values?.remitaReferencingAnalysis?.minimumNetPay || "",
                  minimumGrossPay:
                    values?.remitaReferencingAnalysis?.minimumGrossPay || "",
                  preferredPaymentMode:
                    values?.remitaReferencingAnalysis?.preferredPaymentMode ||
                    "",
                  allowNull: values?.remitaReferencingAnalysis?.allowNull || "",
                  dsr: values?.remitaReferencingAnalysis?.dsr || "",
                },
              }
            : {}),
        };
        let resp;
        if (isEdit) {
          resp = await editLoanDecider({
            id: loanDeciderInstance?.productId,
            ...newValues,
          }).unwrap();
        } else {
          resp = await addLoanDecider(newValues).unwrap();
        }
        onClose();

        enqueueSnackbar(resp?.message || "Loan Decider uploaded Successfully", {
          variant: "success",
        });
      } catch (error) {
        console.log("error", error);
        enqueueSnackbar(
          error?.data?.message ||
            `Failed to ${isEdit ? "Edit" : "Add"} Loan Decider`,
          {
            variant: "error",
          }
        );
      }
    },
  });

  useEffect(() => {
    // if isEdit is true onmount of application set as view only
    if (isEdit) {
      setIsView(true);
    }
    return () => {
      setLoanDeciderInstance({});
      setIsView(false);
    };
  }, []);

  const checkboxContents = useMemo(
    () => [
      {
        title: "Bank Statement analysis",
        name: "showBankStatement",
      },
      {
        title: "Credit Report analysis",
        name: "showCreditReport",
      },
      {
        title: "Bank Schedule analysis",
        name: "showBankScheduleAnalysis",
      },
      {
        title: "Remita Referencing analysis",
        name: "showRemitaReferencingAnalysis",
      },
    ],
    []
  );

  const contents = useMemo(
    () => [
      ...(formik.values.showBankStatement
        ? [
            {
              title: "Bank Statement analysis",
              content: (
                <LoanDeciderAddEditBankStatement
                  formik={formik}
                  isView={isView}
                />
              ),
            },
          ]
        : []),
      ...(formik.values.showCreditReport
        ? [
            {
              title: "Credit Report analysis",
              content: (
                <LoanDeciderAddEditCreditReportAnalysis
                  formik={formik}
                  isView={isView}
                />
              ),
            },
          ]
        : []),
      ...(formik.values.showBankScheduleAnalysis
        ? [
            {
              title: "Bank Schedule analysis",
              content: (
                <LoanDeciderAddEditBankScheduleAnalysis
                  formik={formik}
                  isView={isView}
                />
              ),
            },
          ]
        : []),
      ...(formik.values.showRemitaReferencingAnalysis
        ? [
            {
              title: "Remita Referencing analysis",
              content: (
                <LoanDeciderAddEditRemitaReferencingAnalysis
                  formik={formik}
                  isView={isView}
                />
              ),
            },
          ]
        : []),
    ],
    [formik, isView]
  );

  const handleChangeDeciderChecks = (event) => {
    formik.setFieldValue(
      `${event.target.name}`,
      !formik.values[`${event.target.name}`]
    );
  };
  console.log("formik", formik);

  return (
    <Modal
      title={`${
        isEdit && !isView ? "Update" : isView ? "View" : "Add"
      } Loan Decider`}
      size="md"
      open={open}
      onClose={onClose}
      cancel
    >
      {!isView && (
        <div className="mb-8 grid md:grid-cols-2 grid-cols-1 justify-center">
          {checkboxContents.map((check, i) => (
            <FormControlLabel
              control={
                <Checkbox
                  disabled={check.disabled}
                  checked={formik.values[check.name]}
                  onChange={handleChangeDeciderChecks}
                  name={check.name}
                />
              }
              label={check.title}
            />
          ))}
        </div>
      )}
      <div>
        <TextField
          fullWidth
          disabled={isView}
          label="Product Name"
          className="mb-5"
          select
          {...getTextFieldFormikProps(formik, "productId")}
        >
          {loanProductQuery?.data &&
            loanProductQuery?.data?.map((option) => (
              <MenuItem
                key={option.id}
                onClick={() => formik.setFieldValue("productName", option.name)}
                value={option.id}
              >
                {option.name}
              </MenuItem>
            ))}
        </TextField>

        {contents.map((content, i) => (
          <Accordion
            key={i}
            className="mb-5"
            elevation={0}
            sx={{ border: "1px solid #dddd", borderRadius: "10px" }}
          >
            <AccordionSummary
              expandIcon={<Icon>expand_more</Icon>}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontWeight={700}>{content.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>{content.content}</AccordionDetails>
          </Accordion>
        ))}
      </div>

      <LoadingButton
        loading={
          addLoanDeciderQuery.isLoading || editLoanDeciderQuery.isLoading
        }
        fullWidth
        className="mt-4"
        onClick={() => {
          if (isView) {
            setIsView(false);
          } else {
            formik.handleSubmit();
          }
        }}
      >
        {isView ? "Edit" : isEdit && !isView ? "Update" : "Add"} Loan Decider
      </LoadingButton>
    </Modal>
  );
}
