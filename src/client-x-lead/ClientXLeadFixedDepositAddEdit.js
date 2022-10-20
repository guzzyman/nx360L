import {
  Button,
  Step,
  StepButton,
  StepContent,
  Stepper,
  useMediaQuery,
} from "@mui/material";
import { useState, useMemo } from "react";
import {
  dateLocaleFormat,
  MediaQueryBreakpointEnum,
  RouteEnum,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import useStep from "hooks/useStep";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import BackButton from "common/BackButton";
import { useParams } from "react-router";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import {
  getUserErrorMessage,
  parseDateToString,
  removeEmptyProperties,
} from "common/Utils";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import ClientXLeadFixedDepositAddEditDetails from "./ClientXLeadFixedDepositAddEditDetails";
// import ClientXLeadFixedDepositAddEditCurrency from "./ClientXLeadFixedDepositAddEditCurrency";
import ClientXLeadFixedDepositAddEditSettings from "./ClientXLeadFixedDepositAddEditSettings";
import ClientXLeadFixedDepositAddEditInterestRateChart from "./ClientXLeadFixedDepositAddEditInterestRateChart";
// import ClientXLeadFixedDepositAddEditCharges from "./ClientXLeadFixedDepositAddEditCharges";
import ClientXLeadFixedDepositAddEditTerms from "./ClientXLeadFixedDepositAddEditTerms";
import { format } from "date-fns";
import CRMClientFixedDepositAddEditPreview from "crm-client/CRMClientFixedDepositAddEditPreview";

function ClientXLeadFixedDepositAddEdit(props) {
  let { id, depositId } = useParams();
  const location = useLocation();

  const isReoccurringDeposit = location.pathname?.includes("reoccurring");
  const edit = !!depositId;

  let navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);

  const { step, nextStep, prevStep, setStep } = useStep(0);
  const [productId, setProductId] = useState(null);

  const clientFixedDepositQueryResult = isReoccurringDeposit
    ? nimbleX360CRMClientApi.useGetClientReoccurringFixedDepositAccountDetailsQuery(
        {
          fixedDepositId: depositId,
          associations: "all",
        },
        {
          skip: !edit,
        }
      )
    : nimbleX360CRMClientApi.useGetClientFixedDepositAccountDetailsQuery(
        {
          fixedDepositId: depositId,
          associations: "all",
        },
        {
          skip: !edit,
        }
      );

  const [addMutation, addMutationResult] =
    nimbleX360CRMClientApi.useAddCRMClientFixedDepositMutation();

  const [addReocurringMutation, addReocurringMutationResult] =
    nimbleX360CRMClientApi.useAddCRMClientReoccurringFixedDepositMutation();

  const [editMutation, editMutationResult] =
    nimbleX360CRMClientApi.usePutCRMClientFixedDepositMutation();

  const [editReoccuringMutation, editReoccuringMutationResult] =
    nimbleX360CRMClientApi.usePutCRMClientReoccurringFixedDepositMutation();

  const fixedDepositQuery =
    nimbleX360CRMClientApi.useGetCRMClientFixedDepositTemplateQuery(
      useMemo(
        () => ({
          clientId: id,
          ...(productId !== undefined ||
          clientFixedDepositQueryResult?.data?.depositProductId
            ? {
                productId:
                  productId ||
                  clientFixedDepositQueryResult?.data?.depositProductId,
              }
            : {}),
        }),
        [productId, id, clientFixedDepositQueryResult?.data?.depositProductId]
      ),
      { skip: isReoccurringDeposit }
    );

  const reoccurringFixedDepositQuery =
    nimbleX360CRMClientApi.useGetCRMClientReoccurringFixedDepositTemplateQuery(
      useMemo(
        () => ({
          clientId: id,
          ...(productId !== undefined ||
          clientFixedDepositQueryResult?.data?.depositProductId
            ? {
                productId:
                  productId ||
                  clientFixedDepositQueryResult?.data?.depositProductId,
              }
            : {}),
        }),
        [productId, id, clientFixedDepositQueryResult?.data?.depositProductId]
      ),
      { skip: !isReoccurringDeposit }
    );

  const templateOptionData = isReoccurringDeposit
    ? reoccurringFixedDepositQuery.data
    : fixedDepositQuery.data;

  const fixedDepositDetailsSchema = {
    productId: Yup.string().required(),
    fieldOfficerId: Yup.string(),
    submittedOnDate: Yup.string(),
    externalId: Yup.string(),
    inMultiplesOfDepositTermTypeId: Yup.number(),
    depositPeriod: Yup.number()
      .label("Deposit Period Frequency")
      .min(templateOptionData?.minDepositTerm || 0)
      .max(templateOptionData?.maxDepositTerm || 0),
  };

  const fixedDepositChargesSchema = {
    charges: Yup.array().of(
      Yup.object().shape({
        chargeId: Yup.string(),
        amount: Yup.string(),
        dueDate: Yup.string(),
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

  const chartSlab = useMemo(
    () =>
      templateOptionData?.accountChart?.chartSlabs?.length
        ? templateOptionData?.accountChart?.chartSlabs?.reduce((acc, value) => {
            return acc.concat({
              description: value.description,
              fromPeriod: value.fromPeriod,
              toPeriod: value.toPeriod,
              annualInterestRate: value.annualInterestRate,
              locale: "en",
              incentives:
                value?.incentives?.map((item) => ({
                  entityType: {
                    id: item.entityType.id,
                    code: item.entityType.code,
                    value: item.entityType.value,
                  },
                  attributeName: item.attributeName,
                  conditionType: item.conditionType,
                  attributeValue: item.attributeValue,
                  incentiveType: item.incentiveType,
                  amount: item.amount,
                })) || [],
              periodType: value.periodType,
            });
          }, [])
        : "",
    [templateOptionData]
  );

  const detailsChartSlab = useMemo(
    () =>
      clientFixedDepositQueryResult?.data?.accountChart?.chartSlabs?.length
        ? clientFixedDepositQueryResult?.data?.accountChart?.chartSlabs?.reduce(
            (acc, value) => {
              return acc.concat({
                description: value.description,
                fromPeriod: value.fromPeriod,
                toPeriod: value.toPeriod,
                annualInterestRate: value.annualInterestRate,
                locale: "en",
                incentives:
                  value?.incentives?.map((item) => ({
                    entityType: {
                      id: item.entityType.id,
                      code: item.entityType.code,
                      value: item.entityType.value,
                    },
                    attributeName: item.attributeName,
                    conditionType: item.conditionType,
                    attributeValue: item.attributeValue,
                    incentiveType: item.incentiveType,
                    amount: item.amount,
                  })) || [],
                periodType: value.periodType,
              });
            },
            []
          )
        : "",
    [clientFixedDepositQueryResult?.data]
  );

  const formik = useFormik({
    initialValues: {
      ...(isReoccurringDeposit
        ? {
            isMandatoryDeposit:
              clientFixedDepositQueryResult?.data?.isMandatoryDeposit ||
              templateOptionData?.isMandatoryDeposit ||
              "",
            adjustAdvanceTowardsFuturePayments:
              clientFixedDepositQueryResult?.data
                ?.adjustAdvanceTowardsFuturePayments ||
              templateOptionData?.adjustAdvanceTowardsFuturePayments ||
              "",
            allowWithdrawal:
              clientFixedDepositQueryResult?.data?.allowWithdrawal ||
              templateOptionData?.allowWithdrawal ||
              "",
            isCalendarInherited:
              clientFixedDepositQueryResult?.data?.isCalendarInherited ||
              templateOptionData?.isCalendarInherited ||
              false,
            recurringFrequencyType:
              clientFixedDepositQueryResult?.data?.recurringFrequencyType?.id,
            recurringFrequency:
              clientFixedDepositQueryResult?.data?.recurringFrequency ||
              templateOptionData?.recurringFrequency ||
              "",
            mandatoryRecommendedDepositAmount:
              clientFixedDepositQueryResult?.data
                ?.mandatoryRecommendedDepositAmount ||
              templateOptionData?.mandatoryRecommendedDepositAmount ||
              "",
            expectedFirstDepositOnDate:
              parseDateToString(
                clientFixedDepositQueryResult?.data?.expectedFirstDepositOnDate
              ) ||
              templateOptionData?.expectedFirstDepositOnDate ||
              format(new Date(), dateLocaleFormat.DATE_FORMAT),
          }
        : {
            depositAmount:
              clientFixedDepositQueryResult?.data?.depositAmount ||
              templateOptionData?.amount ||
              "",
          }),
      productId:
        clientFixedDepositQueryResult?.data?.depositProductId || productId,
      clientId: id,
      externalId: clientFixedDepositQueryResult?.data?.externalId,
      fieldOfficerId: clientFixedDepositQueryResult?.data?.fieldOfficerId || "",
      dateFormat: dateLocaleFormat.DATE_FORMAT,
      locale: dateLocaleFormat.LOCALE,
      submittedOnDate:
        parseDateToString(
          clientFixedDepositQueryResult?.data?.timeline?.submittedOnDate
        ) || format(new Date(), "dd MMMM yyyy"),
      charges: charges || [],
      preClosurePenalApplicable:
        templateOptionData?.preClosurePenalApplicable || "",
      transferInterestToSavings:
        templateOptionData?.transferInterestToSavings || "",
      withHoldTax:
        clientFixedDepositQueryResult?.data?.withHoldTax ||
        templateOptionData?.withHoldTax ||
        "",
      minDepositTerm:
        clientFixedDepositQueryResult?.data?.minDepositTerm ||
        templateOptionData?.minDepositTerm ||
        "",
      minDepositTermTypeId:
        clientFixedDepositQueryResult?.data?.minDepositTermType?.id ||
        templateOptionData?.minDepositTermType?.id ||
        "",
      lockinPeriodFrequency:
        clientFixedDepositQueryResult?.data?.lockinPeriodFrequency ||
        templateOptionData?.lockinPeriodFrequency ||
        "",
      lockinPeriodFrequencyType:
        clientFixedDepositQueryResult?.data?.lockinPeriodFrequencyType?.id ||
        templateOptionData?.lockinPeriodFrequencyType?.id,
      maxDepositTerm:
        clientFixedDepositQueryResult?.data?.maxDepositTerm ||
        templateOptionData?.maxDepositTerm ||
        "",
      maxDepositTermTypeId:
        clientFixedDepositQueryResult?.data?.maxDepositTermTypeId ||
        templateOptionData?.maxDepositTermType?.id ||
        "",
      inMultiplesOfDepositTerm:
        clientFixedDepositQueryResult?.data?.inMultiplesOfDepositTerm ||
        templateOptionData?.inMultiplesOfDepositTerm ||
        "",
      inMultiplesOfDepositTermTypeId:
        clientFixedDepositQueryResult?.data?.inMultiplesOfDepositTermType?.id ||
        templateOptionData?.inMultiplesOfDepositTermType?.id ||
        0,
      preClosurePenalInterest:
        clientFixedDepositQueryResult?.data?.preClosurePenalInterest ||
        templateOptionData?.preClosurePenalInterest ||
        "",
      preClosurePenalInterestOnTypeId:
        clientFixedDepositQueryResult?.data?.preClosurePenalInterestOnType
          ?.id ||
        templateOptionData?.preClosurePenalInterestOnType?.id ||
        "",
      interestCompoundingPeriodType:
        clientFixedDepositQueryResult?.data?.interestCompoundingPeriodType
          ?.id ||
        templateOptionData?.interestCompoundingPeriodType?.id ||
        "",
      interestPostingPeriodType:
        clientFixedDepositQueryResult?.data?.interestPostingPeriodType?.id ||
        templateOptionData?.interestPostingPeriodType?.id ||
        "",
      interestCalculationType:
        clientFixedDepositQueryResult?.data?.interestCalculationType?.id ||
        templateOptionData?.interestCalculationType?.id ||
        "",
      interestCalculationDaysInYearType:
        clientFixedDepositQueryResult?.data?.interestCalculationDaysInYearType
          ?.id ||
        templateOptionData?.interestCalculationDaysInYearType?.id ||
        "",
      depositPeriod:
        clientFixedDepositQueryResult?.data?.depositPeriod ||
        templateOptionData?.depositPeriod ||
        "",
      depositPeriodFrequencyId:
        clientFixedDepositQueryResult?.data?.depositPeriodFrequency?.id ||
        templateOptionData?.depositPeriodFrequency?.id,
      linkAccountId:
        clientFixedDepositQueryResult?.data?.linkedAccount?.id ||
        templateOptionData?.savingsAccounts?.[0]?.id ||
        "",

      charts: {
        name:
          clientFixedDepositQueryResult?.data?.accountChart?.name ||
          templateOptionData?.accountChart?.name ||
          "",
        description:
          clientFixedDepositQueryResult?.data?.accountChart?.description ||
          templateOptionData?.accountChart?.description ||
          "",
        fromDate:
          parseDateToString(
            clientFixedDepositQueryResult?.data?.accountChart?.fromDate
          ) ||
          parseDateToString(templateOptionData?.accountChart?.fromDate) ||
          "",
        endDate:
          parseDateToString(
            clientFixedDepositQueryResult?.data?.accountChart?.endDate
          ) ||
          parseDateToString(templateOptionData?.accountChart?.endDate) ||
          "",
        dateFormat: dateLocaleFormat.DATE_FORMAT,
        locale: dateLocaleFormat.LOCALE,
        chartSlabs: detailsChartSlab || chartSlab || [],
        isActiveChart: "true",
      },
      nominalAnnualInterestRate:
        clientFixedDepositQueryResult?.data?.nominalAnnualInterestRate ||
        templateOptionData?.nominalAnnualInterestRate ||
        chartSlab?.[0]?.annualInterestRate ||
        "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      ...fixedDepositDetailsSchema,
      ...fixedDepositChargesSchema,
    }),
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        if (edit) {
          if (isReoccurringDeposit) {
            await editReoccuringMutation({
              depositId,
              ...removeEmptyProperties(values),
            }).unwrap();
          } else {
            await editMutation({
              depositId,
              ...removeEmptyProperties(values),
            }).unwrap();
          }
        } else {
          if (isReoccurringDeposit) {
            await addReocurringMutation(removeEmptyProperties(values)).unwrap();
          } else {
            await addMutation(removeEmptyProperties(values)).unwrap();
          }
        }

        enqueueSnackbar(
          ` ${isReoccurringDeposit && "Reoccurring"} Fixed Deposit ${
            edit ? "Edit" : "creation"
          } Successfull`,
          {
            variant: "success",
          }
        );
        navigate(`${RouteEnum.CRM_CLIENTS}/${id}`);
        nextStep(step);
      } catch (error) {
        enqueueSnackbar(
          ` ${isReoccurringDeposit && "Reoccurring"} Fixed Deposit ${
            edit ? "Edit" : "creation"
          } Failed`,
          {
            variant: "error",
          }
        );
        enqueueSnackbar(
          getUserErrorMessage(error.data.errors) ||
            "Form error, contact Support",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const contents = [
    {
      title: "Details",
      body: (
        <ClientXLeadFixedDepositAddEditDetails
          setProductId={setProductId}
          formik={formik}
          isEdit={edit}
          data={templateOptionData}
        />
      ),
    },
    // {
    //   title: "Currency",
    //   body: (
    //     <ClientXLeadFixedDepositAddEditCurrency
    //       data={templateOptionData}
    //       formik={formik}
    //     />
    //   ),
    // },
    {
      title: "Terms",
      body: (
        <ClientXLeadFixedDepositAddEditTerms
          data={templateOptionData}
          formik={formik}
          isReoccurringDeposit={isReoccurringDeposit}
        />
      ),
    },

    {
      title: "Settings",
      body: (
        <ClientXLeadFixedDepositAddEditSettings
          data={templateOptionData}
          formik={formik}
          isReoccurringDeposit={isReoccurringDeposit}
        />
      ),
    },
    {
      title: "Interest Rate Chart",
      body: (
        <ClientXLeadFixedDepositAddEditInterestRateChart
          data={templateOptionData}
          formik={formik}
          isEdit={edit}
        />
      ),
    },
    // {
    //   title: "Charges",
    //   body: (
    //     <ClientXLeadFixedDepositAddEditCharges
    //       data={templateOptionData}
    //       formik={formik}
    //     />
    //   ),
    // },
    {
      title: "Preview",
      body: (
        <CRMClientFixedDepositAddEditPreview
          data={templateOptionData}
          setStep={setStep}
          formik={formik}
        />
      ),
    },
  ];

  const content = contents[step];
  const isFirstStep = step === 0;
  const isLastStep = step === contents.length - 1;

  const footer = (
    <div className="flex justify-end items-center gap-4 pb-20 mt-4">
      <Button variant="outlined" disabled={isFirstStep} onClick={prevStep}>
        Previous
      </Button>

      <LoadingButton
        disabled={
          addMutationResult?.isLoading ||
          editMutationResult?.isLoading ||
          addReocurringMutationResult?.isLoading ||
          editReoccuringMutationResult?.isLoading
        }
        loading={
          addMutationResult?.isLoading ||
          editMutationResult?.isLoading ||
          addReocurringMutationResult?.isLoading ||
          editReoccuringMutationResult?.isLoading
        }
        loadingPosition="end"
        endIcon={<></>}
        onClick={() => {
          if (step === 4) {
            formik.handleSubmit();
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

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "CRM", to: RouteEnum.CRM_CLIENTS },
          { name: "Clients Details", to: `${RouteEnum.CRM_CLIENTS}/${id}` },
          {
            name: `${edit ? "Edit" : "Create"} ${
              isReoccurringDeposit && "Reoccurring"
            }  Fixed Deposit`,
          },
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
    </>
  );
}

export default ClientXLeadFixedDepositAddEdit;
