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
import { Checkbox, FormControlLabel, Icon } from "@mui/material";
import LoanDeciderAddEditCreditReportAnalysis from "./LoanDeciderAddEditCreditReportAnalysis";
import LoanDeciderAddEditBankScheduleAnalysis from "./LoanDeciderAddEditBankScheduleAnalysis";
import LoanDeciderAddEditRemitaReferencingAnalysis from "./LoanDeciderAddEditRemitaReferencingAnalysis";
import { useState } from "react";

export default function LoanDeciderAddEditDialog({
  open,
  onClose,
  loanDeciderInstance,
  setLoanDeciderInstance,
}) {
  const [isView, setIsView] = useState(false);
  const isEdit = !!loanDeciderInstance?.productId;
  const { enqueueSnackbar } = useSnackbar();

  const { data: loanDeciderData } =
    LoanDeciderStoreQuerySlice.useGetAdminLoanDeciderQuery(
      loanDeciderInstance.productId,
      { skip: !isEdit }
    );

  console.log("loanDeciderData", loanDeciderData);
  const [deciderChecks, setDeciderChecks] = useState({
    bankStatementAnalysis: true,
    creditReportAnalysis: false,
    bankScheduleAnalysis: false,
    remitaReferencingAnalysis: false,
  });

  const [addLoanDecider, addLoanDeciderQuery] =
    LoanDeciderStoreQuerySlice.useAddAdminLoanDeciderMutation();
  const [editLoanDecider, editLoanDeciderQuery] =
    LoanDeciderStoreQuerySlice.useEditAdminLoanDeciderMutation();

  const formik = useFormik({
    initialValues: {
      productId: loanDeciderData?.data?.productId || "",
      // productName: loanDeciderData?.data?.productName || "",
      bankStatement: {
        averageInflowMin:
          loanDeciderData?.data?.bankStatement?.averageInflowMin || "",
        averageInflowMax:
          loanDeciderData?.data?.bankStatement?.averageInflowMax || "",
        accountSweep: loanDeciderData?.data?.bankStatement?.accountSweep || "",
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
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      productId: yup.string().required(),
      bankStatement: yup.object({
        averageInflowMin: yup.string().label("Average Inflow Min.").required(),
        averageInflowMax: yup.string().label("Average Inflow Max.").required(),
        accountSweep: yup.string().label("Account Sweep").required(),
        minGamblingRate: yup.string().label("Min Gambling Rate").required(),
        lastIntervalOfCredit: yup
          .string()
          .label("Last Interval Of Credit")
          .required(),
        miniNoOfSalaryPayment: yup
          .string()
          .label("Min No Of Salary Payment")
          .required(),
        salaryEarnerDSR: yup.string().label("Salary Earner DSR").required(),
        nonSalaryEarnerDSR: yup
          .string()
          .label("Non Salary Earner DSR")
          .required(),
        allowNull: yup.string().label("Allow Null").required(),
      }),
    }),

    onSubmit: async (values) => {
      try {
        let resp;
        if (isEdit) {
          resp = await editLoanDecider({
            id: loanDeciderInstance?.productId,
            ...values,
          }).unwrap();
        } else {
          resp = await addLoanDecider(values).unwrap();
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
        name: "bankStatementAnalysis",
      },
      {
        title: "Credit Report analysis",
        disabled: true,
        name: "creditReportAnalysis",
      },
      {
        title: "Bank Schedule analysis",
        disabled: true,
        name: "bankScheduleAnalysis",
      },
      {
        title: "Remita Referencing analysis",
        disabled: true,
        name: "remitaReferencingAnalysis",
      },
    ],
    []
  );

  const contents = useMemo(
    () => [
      ...(deciderChecks.bankStatementAnalysis
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
      ...(deciderChecks.creditReportAnalysis
        ? [
            {
              title: "Credit Report analysis",
              content: (
                <LoanDeciderAddEditCreditReportAnalysis formik={formik} />
              ),
            },
          ]
        : []),
      ...(deciderChecks.bankScheduleAnalysis
        ? [
            {
              title: "Bank Schedule analysis",
              content: (
                <LoanDeciderAddEditBankScheduleAnalysis formik={formik} />
              ),
            },
          ]
        : []),
      ...(deciderChecks.remitaReferencingAnalysis
        ? [
            {
              title: "Remita Referencing analysis",
              content: (
                <LoanDeciderAddEditRemitaReferencingAnalysis formik={formik} />
              ),
            },
          ]
        : []),
    ],
    [formik, deciderChecks, isView]
  );

  const handleChangeDeciderChecks = (event) => {
    setDeciderChecks({
      ...deciderChecks,
      [event.target.name]: event.target.checked,
    });
  };
  console.log("isView", isView);

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
                  checked={deciderChecks[check.name]}
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
