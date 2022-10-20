import {
  Button,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import {
  dateLocaleFormat,
  MediaQueryBreakpointEnum,
  RouteEnum,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import useStep from "hooks/useStep";
import ClientXLeadLoanAddEditDetails from "./ClientXLeadLoanAddEditDetails";
import ClientXLeadLoanAddEditTerms from "./ClientXLeadLoanAddEditTerms";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import BackButton from "common/BackButton";
import { useParams } from "react-router";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import {
  formatNumberToCurrency,
  getTruthyValue,
  getUserErrorMessage,
  parseDateToString,
  removeEmptyProperties,
} from "common/Utils";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { useNavigate } from "react-router";
import ClientXLeadLoanAddEditDocuments from "./ClientXLeadLoanAddEditDocuments";
import { format } from "date-fns";
import ClientXLeadLoanAddEditPreview from "./ClientXLeadLoanAddEditPreview";
import { lastDayOfMonth } from "date-fns/esm";
import Modal from "common/Modal";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import useAuthUser from "hooks/useAuthUser";

function ClientXLeadLoanAddEdit(props) {
  let { id, loanId: loanIdPrams } = useParams();
  const edit = !!loanIdPrams;

  let navigate = useNavigate();
  const user = useAuthUser();

  const clientLoanQueryResult =
    nimbleX360CRMClientApi.useGetClientLoadDetailsQuery(
      {
        loanId: loanIdPrams,
        associations: "all",
        exclude: "guarantors,futureSchedule",
      },
      { skip: !edit }
    );

  const [productId, setProductId] = useState(null);
  const [loanId, setLoanId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [openSuggestedPrincipal, setOpenSuggestedPrincipal] = useState(false);
  const [suggestedPrincipal, setSuggestedPrincipal] = useState("");
  const [suggestedPrincipalError, setSuggestedPrincipalError] = useState("");

  const { isCopied, handleCopyClick } = useCopyToClipboard();

  const [addMutation, addMutationResult] =
    nimbleX360CRMClientApi.useAddCRMClientLoanMutation();
  const [addRepaymentInfoMutation, addRepaymentInfoMutationResult] =
    nimbleX360CRMClientApi.useAddClientLoanMutation();
  const [editMutation, editMutationResult] =
    nimbleX360CRMClientApi.usePutCRMClientLoanMutation();
  const [addMutationDSR, addMutationResultDRS] =
    nimbleX360CRMClientApi.useAddCRMClientLoanDSRMutation();

  const [addLoanDocumentMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAddCRMClientLoanDocumentInitialMutation();
  const { data: clientData, isLoading: clientDataIsloading } =
    nimbleX360CRMClientApi.useGetCRMCDLClientQuery(id);

  const { data: templateOptionData, isLoading: templateOptionDataIsLoading } =
    nimbleX360CRMClientApi.useGetCRMClientsLoanTemplateQuery(
      useMemo(
        () => ({
          clientId: id,
          activeOnly: true,
          staffInSelectedOfficeOnly: true,
          templateType: "individual",
          ...(clientData?.clientEmployers?.[0]?.employer?.parent?.id
            ? {
                employerId:
                  clientData?.clientEmployers?.[0]?.employer?.parent?.id,
              }
            : {}),
          ...(productId !== undefined ||
          clientLoanQueryResult?.data?.loanProductId
            ? {
                productId:
                  productId || clientLoanQueryResult?.data?.loanProductId,
              }
            : {}),
        }),
        [
          productId,
          clientData?.clientEmployers,
          id,
          clientLoanQueryResult?.data?.loanProductId,
        ]
      ),
      { skip: !clientData?.clientEmployers?.[0]?.employer?.parent?.id }
    );

  const { enqueueSnackbar } = useSnackbar();

  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);

  const { step, nextStep, prevStep, setStep } = useStep(0);

  const loanDetailsSchema = {
    clients: Yup.string(),
    productId: Yup.string().required(),
    loanOfficerId: Yup.string().label("Loan Officer").required(),
    loanPurposeId: Yup.string(),
    fundId: Yup.string(),
    submittedOnDate: Yup.string(),
    expectedDisbursementDate: Yup.string(),
    linkAccountId: Yup.string(),
    createStandingInstructionAtDisbursement: Yup.boolean(),
  };

  const loanTermsSchema = {
    principal: Yup.string(),
    loanTermFrequency: Yup.string(),
    loanTermFrequencyType: Yup.string(),
    // numberOfRepayments: Yup.string(),
    repaymentsStartingFromDate: Yup.string(),
    repaymentEvery: Yup.string(),
    repaymentFrequencyType: Yup.string(),
    interestRatePerPeriod: Yup.string(),
    interestType: Yup.string(),
    isEqualAmortization: Yup.string(),
    amortizationType: Yup.string(),
    interestCalculationPeriodType: Yup.string(),
    allowPartialPeriodInterestCalcualtion: Yup.boolean(),
    inArrearsTolerance: Yup.string(),
    graceOnInterestCharged: Yup.string(),
    transactionProcessingStrategyId: Yup.string(),
    graceOnPrincipalPayment: Yup.string(),
    graceOnInterestPayment: Yup.string(),
    graceOnArrearsAgeing: Yup.string(),
  };

  const loanChargesSchema = {
    charges: Yup.array().of(
      Yup.object().shape({
        chargeId: Yup.string(),
        amount: Yup.string(),
        dueDate: Yup.string(),
      })
    ),
    collateral: Yup.array().of(
      Yup.object().shape({
        type: Yup.string(),
        value: Yup.string(),
        description: Yup.string(),
      })
    ),
  };

  const charges = useMemo(
    () =>
      templateOptionData?.charges?.length
        ? templateOptionData?.charges?.reduce((acc, value) => {
            return acc.concat({
              chargeId: value.chargeId,
              amount: value.amount,
            });
          }, [])
        : "",
    [templateOptionData]
  );

  const querycharges = useMemo(
    () =>
      clientLoanQueryResult?.data?.charges?.length
        ? clientLoanQueryResult?.data?.charges?.reduce((acc, value) => {
            return acc.concat({
              chargeId: value.chargeId,
              amount: value.amount,
            });
          }, [])
        : "",
    [clientLoanQueryResult]
  );

  const walletId = templateOptionData?.accountLinkingOptions?.filter(
    (e) => e?.productName?.toLowerCase() === "wallets"
  );

  const formik = useFormik({
    initialValues: {
      productId: clientLoanQueryResult?.data?.loanProductId || productId,
      loanIdToClose: clientLoanQueryResult?.data?.closureLoanId || "",
      isTopup: clientLoanQueryResult?.data?.isTopup || "",
      loanOfficerId: user.staffId
        ? user.staffId
        : clientLoanQueryResult?.data?.loanOfficerId || "",
      clientId: id,
      fundId:
        clientLoanQueryResult?.data?.fundId || templateOptionData?.fundId || "",
      dateFormat: dateLocaleFormat.DATE_FORMAT,
      locale: dateLocaleFormat.LOCALE,
      submittedOnDate:
        parseDateToString(
          clientLoanQueryResult?.data?.timeline?.submittedOnDate
        ) || format(new Date(), "dd MMMM yyyy"),
      repaymentsStartingFromDate:
        parseDateToString(
          clientLoanQueryResult?.data?.repaymentsStartingFromDate
        ) || templateOptionData?.employerData?.sector?.id === 18
          ? format(
              lastDayOfMonth(
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
              ),
              "dd MMMM yyyy"
            )
          : format(new Date(), "dd MMMM yyyy"),
      activationChannelId: 78,
      charges: querycharges || charges || [],
      linkAccountId: walletId?.[0]?.id || "",
      createStandingInstructionAtDisbursement: true,
      collateral: templateOptionData?.collateral || [],
      disbursementData: templateOptionData?.disbursementData || [],
      maxOutstandingLoanBalance:
        templateOptionData?.maxOutstandingLoanBalance || "",
      principal:
        templateOptionData?.employerLoanProductDataOptions?.[0]?.principal ||
        clientLoanQueryResult?.data?.principal ||
        templateOptionData?.principal ||
        "",
      loanType: "individual",
      loanPurposeId: clientLoanQueryResult?.data?.loanPurposeId || "",
      expectedDisbursementDate:
        parseDateToString(
          templateOptionData?.timeline?.expectedDisbursementDate
        ) || format(new Date(), "dd MMMM yyyy"),
      // numberOfRepayments: templateOptionData?.numberOfRepayments || "",
      loanTermFrequency:
        templateOptionData?.employerLoanProductDataOptions?.[0]
          ?.termFrequency ||
        clientLoanQueryResult?.data?.loanTermFrequency ||
        templateOptionData?.termFrequency ||
        "",
      loanTermFrequencyType:
        getTruthyValue([clientLoanQueryResult?.data?.loanTermFrequencyType], {
          truthyValues: [0, ""],
        }) ||
        getTruthyValue([templateOptionData?.termPeriodFrequencyType?.id], {
          truthyValues: [0, ""],
        }),
      repaymentEvery: templateOptionData?.repaymentEvery || "",
      repaymentFrequencyType: getTruthyValue(
        [templateOptionData?.repaymentFrequencyType?.id],
        { truthyValues: [0, ""] }
      ),
      interestRatePerPeriod:
        templateOptionData?.employerLoanProductDataOptions?.[0]?.interestRate ||
        templateOptionData?.interestRatePerPeriod ||
        "",
      netpay: clientLoanQueryResult?.data?.netPay || "",
      amortizationType: getTruthyValue(
        [templateOptionData?.amortizationType?.id],
        {
          truthyValues: [0, ""],
        }
      ),
      isEqualAmortization: templateOptionData?.isEqualAmortization || "",
      interestType: getTruthyValue([templateOptionData?.interestType?.id], {
        truthyValues: [0, ""],
      }),
      interestCalculationPeriodType: getTruthyValue(
        [templateOptionData?.interestCalculationPeriodType?.id],
        { truthyValues: [0, ""] }
      ),
      allowPartialPeriodInterestCalcualtion:
        templateOptionData?.allowPartialPeriodInterestCalcualtion || "",
      inArrearsTolerance: templateOptionData?.inArrearsTolerance || "",
      graceOnInterestCharged: templateOptionData?.inArrearsTolerance || "",
      transactionProcessingStrategyId:
        templateOptionData?.transactionProcessingStrategyId || "",
      commitment: clientLoanQueryResult?.data?.commitment || 0,
    },
    enableReinitialize: true,
    validationSchema: Yup.lazy(() => {
      switch (step) {
        case 0:
          return Yup.object().shape({
            ...loanDetailsSchema,
            ...loanTermsSchema,
          });
        case 1:
          return Yup.object().shape({
            ...loanDetailsSchema,
            ...loanTermsSchema,
          });
        case 2:
          return Yup.object().shape({
            ...loanDetailsSchema,
            ...loanTermsSchema,
            ...loanChargesSchema,
          });
        default:
          break;
      }
    }),

    onSubmit: async (values) => {
      try {
        if (step === 1) {
          const dsrValue = {
            commitment: values?.commitment || 0,
            netpay: values?.netpay,
            clientId: values?.clientId,
            productId: values?.productId,
            disbursementData: values?.disbursementData || "",
            fundId: values?.fundId,
            principal: values?.principal,
            loanTermFrequency: values?.loanTermFrequency,
            loanTermFrequencyType: values?.loanTermFrequencyType,
            numberOfRepayments: values?.loanTermFrequency,
            repaymentEvery: values?.repaymentEvery,
            repaymentFrequencyType: values?.repaymentFrequencyType,
            interestRatePerPeriod: values?.interestRatePerPeriod,
            amortizationType: values?.amortizationType,
            isEqualAmortization: values?.isEqualAmortization,
            interestType: values?.interestType,
            interestCalculationPeriodType:
              values?.interestCalculationPeriodType,
            allowPartialPeriodInterestCalcualtion:
              values?.allowPartialPeriodInterestCalcualtion,
            inArrearsTolerance: values?.inArrearsTolerance,
            graceOnPrincipalPayment: values?.graceOnPrincipalPayment,
            graceOnInterestPayment: values?.graceOnInterestPayment,
            graceOnArrearsAgeing: values?.graceOnArrearsAgeing,
            transactionProcessingStrategyId:
              values?.transactionProcessingStrategyId,
            graceOnInterestCharged: values?.graceOnInterestCharged,
            rates: values?.rates || [],
            charges: values?.charges,
            dateFormat: dateLocaleFormat.DATE_FORMAT,
            locale: dateLocaleFormat.LOCALE,
            loanType: values?.loanType,
            expectedDisbursementDate: values?.expectedDisbursementDate,
            submittedOnDate: values?.submittedOnDate,
          };
          const response = await addMutationDSR(
            removeEmptyProperties(dsrValue)
          ).unwrap();

          if (response?.pass) {
            enqueueSnackbar(response?.decision, { variant: "success" });
            nextStep(step);
          } else {
            enqueueSnackbar(response?.decision, { variant: "warning" });
            setSuggestedPrincipalError(response?.decision);
            // enqueueSnackbar(
            //   `Suggested Principal: ${response?.suggestedAmount}`,
            //   { variant: "info" }
            // );
            setSuggestedPrincipal(response?.suggestedAmount);
            setOpenSuggestedPrincipal(true);
          }
        } else {
          const newValues = {
            numberOfRepayments: values?.loanTermFrequency,
            ...(templateOptionData?.interestCalculationPeriodType?.id === 0
              ? { interestChargedFromDate: format(new Date(), "dd MMMM yyyy") }
              : {
                  interestChargedFromDate: values?.repaymentsStartingFromDate,
                }),
            ...values,
          };
          let response;
          if (edit) {
            response = await editMutation({
              loanId: loanIdPrams,
              ...removeEmptyProperties(newValues),
            }).unwrap();
          } else {
            response = await addMutation(
              removeEmptyProperties(newValues)
            ).unwrap();
          }

          enqueueSnackbar(`Loan ${edit ? "Edit" : "creation"} Successfull`, {
            variant: "success",
          });

          setClientId(response?.clientId);
          setLoanId(response?.loanId);
          if (!edit && step === 2) {
            nextStep(step);
          }

          if (edit && step === 2) {
            // navigate(
            //   `/crm/clients/${response?.clientId}/loan/${response?.loanId}`
            // );
            navigate(RouteEnum.CRM);
          }
        }
      } catch (error) {
        // enqueueSnackbar(`Loan ${edit ? "Edit" : "creation"} Failed`, {
        //   variant: "warning",
        // });
        console.log("error", error);

        enqueueSnackbar(
          getUserErrorMessage(error.data.errors) || "Form error",
          {
            variant: "warning",
          }
        );
      }
    },
  });

  const showRepaymentInfo = () => {
    const values = formik?.values;
    const repaymentValue = {
      commitment: values?.commitment || 0,
      netpay: values?.netpay,
      clientId: values?.clientId,
      productId: values?.productId,
      disbursementData: values?.disbursementData || "",
      fundId: values?.fundId,
      principal: values?.principal,
      loanTermFrequency: values?.loanTermFrequency,
      loanTermFrequencyType: values?.loanTermFrequencyType,
      numberOfRepayments: values?.loanTermFrequency,
      repaymentEvery: values?.repaymentEvery,
      repaymentFrequencyType: values?.repaymentFrequencyType,
      interestRatePerPeriod: values?.interestRatePerPeriod,
      amortizationType: values?.amortizationType,
      isEqualAmortization: values?.isEqualAmortization,
      interestType: values?.interestType,
      interestCalculationPeriodType: values?.interestCalculationPeriodType,
      allowPartialPeriodInterestCalcualtion:
        values?.allowPartialPeriodInterestCalcualtion,
      inArrearsTolerance: values?.inArrearsTolerance,
      graceOnPrincipalPayment: values?.graceOnPrincipalPayment,
      graceOnInterestPayment: values?.graceOnInterestPayment,
      graceOnArrearsAgeing: values?.graceOnArrearsAgeing,
      transactionProcessingStrategyId: values?.transactionProcessingStrategyId,
      graceOnInterestCharged: values?.graceOnInterestCharged,
      rates: values?.rates || [],
      charges: values?.charges,
      dateFormat: dateLocaleFormat.DATE_FORMAT,
      locale: dateLocaleFormat.LOCALE,
      loanType: values?.loanType,
      expectedDisbursementDate: values?.expectedDisbursementDate,
      submittedOnDate: values?.submittedOnDate,
    };
    addRepaymentInfoMutation(
      removeEmptyProperties({
        params: { command: "calculateLoanSchedule" },
        ...repaymentValue,
      })
    ).unwrap();
  };

  useEffect(() => {
    if (
      formik.values?.productId &&
      formik.values?.principal &&
      formik.values?.loanTermFrequency &&
      formik.values?.loanTermFrequencyType
    ) {
      showRepaymentInfo();
    }
  }, [
    formik.values?.principal,
    formik.values?.productId,
    formik.values?.loanTermFrequency,
    formik.values?.loanTermFrequencyType,
  ]);

  const loanDocumentFormik = useFormik({
    initialValues: [],
    enableReinitialize: true,
    validateOnChange: false, // this one
    validateOnBlur: false,
    validationSchema: Yup.array().of(
      Yup.object().shape({
        name: Yup.string(),
        location: Yup.string(),
        description: Yup.string(),
      })
    ),

    onSubmit: async (values) => {
      try {
        const value = [...values];

        await addLoanDocumentMutation({ loanId, value }).unwrap();

        enqueueSnackbar(`Loan Document creation Successful!`, {
          variant: "success",
        });
        navigate(`/crm/clients/${clientId}/loan/${loanId}`);
      } catch (error) {
        enqueueSnackbar(`Loan Document creation Failed!`, {
          variant: "error",
        });
      }
    },
  });

  const contents = [
    {
      title: "Details",
      body: (
        <ClientXLeadLoanAddEditDetails
          setProductId={setProductId}
          formik={formik}
          clientData={clientData}
          employerDataIsloading={templateOptionDataIsLoading}
          employerData={templateOptionData?.employerData}
          data={templateOptionData}
          user={user}
        />
      ),
    },
    {
      title: "Terms",
      body: (
        <ClientXLeadLoanAddEditTerms
          employerData={templateOptionData?.employerData}
          data={templateOptionData}
          formik={formik}
          repaymentInfo={addRepaymentInfoMutationResult?.data}
        />
      ),
    },
    {
      title: "Preview",
      body: (
        <ClientXLeadLoanAddEditPreview
          employerData={templateOptionData?.employerData}
          data={templateOptionData}
          formik={formik}
          setStep={setStep}
        />
      ),
    },
    !edit && {
      title: "Documents",
      body: (
        <ClientXLeadLoanAddEditDocuments
          loanId={loanId}
          employerData={templateOptionData?.employerData}
          data={templateOptionData}
          formik={loanDocumentFormik}
        />
      ),
    },
  ].filter((el) => el !== false);

  const content = contents[step];
  const isFirstStep = step === 0;
  const isLastStep = step === contents.length - 1;

  const footer = (
    <div className="flex justify-end items-center gap-4 pb-20 mt-4">
      <Button
        variant="outlined"
        disabled={isFirstStep || step === 3}
        onClick={prevStep}
      >
        Previous
      </Button>

      <LoadingButton
        disabled={addMutationResult?.isLoading || editMutationResult?.isLoading}
        loading={
          addMutationResult?.isLoading ||
          editMutationResult?.isLoading ||
          isLoading ||
          addMutationResultDRS?.isLoading
        }
        loadingPosition="end"
        endIcon={<></>}
        onClick={() => {
          if (step === 2 || step === 1) {
            formik.handleSubmit();
          } else if (step === 3) {
            loanDocumentFormik.handleSubmit();
          } else {
            formik.values?.productId !== null
              ? nextStep(step)
              : enqueueSnackbar("Product Name is mandatory", {
                  variant: "error",
                });
          }
        }}
      >
        {isLastStep ? "Submit" : "Next"}
      </LoadingButton>
    </div>
  );

  console.log("formik", formik);

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "CRM", to: RouteEnum.CRM_CLIENTS },
          { name: "Clients Details", to: `${RouteEnum.CRM_CLIENTS}/${id}` },
          { name: "Create New Loan" },
        ]}
      />
      <Stepper
        activeStep={step}
        alternativeLabel={ismd}
        orientation={ismd ? "horizontal" : "vertical"}
        className="mb-4"
      >
        {contents.map((content, index) => (
          <Step key={step.title} completed={step > index}>
            <StepButton onClick={() => setStep(index)}>
              {content.title}
            </StepButton>
            {!ismd && (
              <StepContent>
                {content.body} {footer}
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
      {ismd && content.body}
      {ismd && footer}

      {openSuggestedPrincipal && (
        <Modal
          open={openSuggestedPrincipal}
          onClose={() => setOpenSuggestedPrincipal(false)}
          title="suggested loan amount"
        >
          <div className="flex gap-2 items-center justify-center">
            <Typography fontSize={30} fontWeight={800}>
              ₦{formatNumberToCurrency(suggestedPrincipal)}
            </Typography>
            <Button onClick={() => handleCopyClick(suggestedPrincipal)}>
              {isCopied ? "Copied" : "Copy Amount"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ClientXLeadLoanAddEdit;
