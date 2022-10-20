import { useState, useMemo } from "react";
import {
  Button,
  Step,
  StepButton,
  StepContent,
  Stepper,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  RouteEnum,
  MediaQueryBreakpointEnum,
  dateLocaleFormat,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import {
  getUserErrorMessage,
  parseDateToString,
  removeEmptyProperties,
} from "common/Utils";
import { nimbleX360CRMLeadApi } from "./CRMLeadStoreQuerySlice";
import CRMLeadAddEditFormLeadClassification from "./CRMLeadAddEditFormLeadClassification";
import CRMLeadAddEditFormPersonalInformation from "./CRMLeadAddEditFormPersonalInformation";
import CRMLeadAddEditFormEmploymentInformation from "./CRMLeadAddEditFormEmploymentInformation";
import CRMLeadAddEditFormResidentialInformation from "./CRMLeadAddEditFormResidentialInformation";
import CRMLeadAddEditFormPreview from "./CRMLeadAddEditFormPreview";
import useAuthUser from "hooks/useAuthUser";
import useScrollToTop from "common/useScrollToTop";

function CRMLeadAddEditForm(props) {
  let navigate = useNavigate();
  let { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);
  const [tempState, setTempState] = useState(null);
  const user = useAuthUser();

  const isEdit = !!id;

  const [clientId, setClientId] = useState(id);

  const [activeStep, setActiveStep] = useState(0);

  const { data } = nimbleX360CRMLeadApi.useGetCRMLeadQuery(
    isEdit ? id : clientId,
    {
      skip: isEdit ? !id : !clientId,
    }
  );

  const [addCRMLeadMutation, addCRMLeadMutationResul] =
    nimbleX360CRMLeadApi.useAddCRMLeadMutation();

  const stepFormikConfig = useMemo(() => {
    return getStepFormikConfig(data, activeStep, tempState, user);
  }, [activeStep, data, tempState, user]);

  const formik = useFormik({
    initialValues: stepFormikConfig.initialValues,
    enableReinitialize: true,
    validationSchema: stepFormikConfig.validationSchema,
    onSubmit: async (values) => {
      try {
        if (!isFirstStep || activeStep === 4) {
          const responseData = await addCRMLeadMutation(
            removeEmptyProperties(values)
          ).unwrap();

          setClientId(responseData?.resourceId);
          setTempState(null);
          enqueueSnackbar(`${isEdit ? "Updated" : "Added"}`, {
            variant: "success",
          });
        } else if (isFirstStep) {
          setTempState(formik.values);
        }
        if (activeStep === 4) {
          navigate(`${RouteEnum.CRM_LEADS}/${clientId}`);
        } else {
          nextStep();
        }
      } catch (error) {
        if (activeStep !== 1 && activeStep !== 4) {
          nextStep();
        }
        enqueueSnackbar(`Failed to ${isEdit ? "Updated" : "Added"}`, {
          variant: "error",
        });
        enqueueSnackbar(
          getUserErrorMessage(error.data.errors) ||
            "Form error, contact support",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const nextStep = () => {
    setActiveStep((p) => ++p);
  };

  const prevStep = () => {
    setActiveStep((p) => --p);
  };

  const goToStep = (id) => {
    setActiveStep(id);
  };

  const steps = [
    { content: <CRMLeadAddEditFormLeadClassification formik={formik} /> },
    {
      title: "Personal Information",
      content: <CRMLeadAddEditFormPersonalInformation formik={formik} />,
    },
    {
      title: "Employment Information",
      content: (
        <CRMLeadAddEditFormEmploymentInformation
          formik={formik}
          isEdit={isEdit}
          data={data}
        />
      ),
    },
    {
      title: "Residential Information",
      content: <CRMLeadAddEditFormResidentialInformation formik={formik} />,
    },
    {
      title: "Preview",
      content: (
        <CRMLeadAddEditFormPreview
          formik={formik}
          goToStep={goToStep}
          client={data}
        />
      ),
    },
  ];

  const step = steps[activeStep];
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  const isSecondToTheLast = activeStep === steps.length - 2;

  useScrollToTop(activeStep);

  const isFirstStepFilled =
    formik?.values?.leadSourceId &&
    formik?.values?.leadCategoryId &&
    formik?.values?.leadTypeId &&
    formik?.values?.leadRatingId &&
    formik?.values?.expectedRevenueIncome
      ? true
      : false;

  return (
    <>
      <PageHeader
        title={isLastStep ? step.title : `${isEdit ? "Edit" : "Add New"} Lead`}
        breadcrumbs={[
          { name: "CRM", to: RouteEnum.CRM_LEADS },
          { name: "Leads", to: RouteEnum.CRM_LEADS },
          { name: `${isEdit ? "Edit" : "Add New"} Lead` },
        ]}
      />
      <Stepper
        activeStep={activeStep - 1}
        alternativeLabel={ismd}
        orientation={ismd ? "horizontal" : "vertical"}
      >
        {!isFirstStep &&
          !isLastStep &&
          steps.slice(1, steps.length - 1).map((step, index) => (
            <Step key={step.title} completed={activeStep - 1 > index}>
              <StepButton onClick={() => setActiveStep(index + 1)}>
                {step.title}
              </StepButton>
              {!ismd && <StepContent>{step.content}</StepContent>}
            </Step>
          ))}
      </Stepper>
      {(ismd || isFirstStep || isFirstStep) && step.content}

      {/* show preview button when on last index */}
      <div className="flex justify-center items-center gap-4 pb-20">
        {activeStep === 4 && (
          <LoadingButton
            disabled={addCRMLeadMutationResul.isLoading}
            loading={addCRMLeadMutationResul.isLoading}
            onClick={formik.handleSubmit}
          >
            Submit
          </LoadingButton>
        )}
      </div>

      {!isLastStep && (
        <div className="flex justify-end items-center gap-4 pb-20">
          <Button variant="outlined" disabled={!activeStep} onClick={prevStep}>
            Previous
          </Button>

          <LoadingButton
            disabled={
              isFirstStep
                ? !isFirstStepFilled
                : addCRMLeadMutationResul.isLoading
            }
            loading={addCRMLeadMutationResul.isLoading}
            loadingPosition="end"
            endIcon={<></>}
            onClick={formik.handleSubmit}
          >
            {isFirstStep ? "Proceed" : isSecondToTheLast ? "Preview" : "Next"}
          </LoadingButton>
        </div>
      )}
    </>
  );
}

export default CRMLeadAddEditForm;

const addressValidationSchema = Yup.object({
  moreInfo: Yup.object().shape({
    address: Yup.array().of(
      Yup.object().shape({
        stateProvinceId: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
        lgaId: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
        addressLine1: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
        nearestLandMark: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
        residentStatusId: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
        dateMovedIn: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
      })
    ),
  }),
});

function getStepFormikConfig(data, step, tempState, user) {
  return [
    {
      initialValues: {
        leadSourceId: data?.leadSource?.id || "",
        leadCategoryId: data?.leadCategory?.id || "",
        leadTypeId: data?.leadTypeId || "",
        leadRatingId: data?.leadRating?.id || "",
        expectedRevenueIncome: data?.expectedRevenueIncome || "",
      },
      validationSchema: Yup.object({
        leadSourceId: Yup.string(),
        leadCategoryId: Yup.string(),
        leadTypeId: Yup.string(),
        leadRatingId: Yup.string(),
        expectedRevenueIncome: Yup.string(),
      }),
    },
    {
      initialValues: {
        ...(data?.id ? { id: data?.id } : {}),
        leadSourceId: tempState?.leadSourceId || data?.leadSource?.id || "",
        leadCategoryId:
          tempState?.leadCategoryId || data?.leadCategory?.id || "",
        leadTypeId: tempState?.leadTypeId || data?.leadTypeId || "",
        leadRatingId: tempState?.leadRatingId || data?.leadRating?.id || "",
        expectedRevenueIncome:
          tempState?.expectedRevenueIncome || data?.expectedRevenueIncome || 0,
        locale: dateLocaleFormat.LOCALE,
        moreInfo: {
          clients: {
            ...(data?.moreInfo?.clients?.id
              ? {
                  id: data?.moreInfo?.clients?.id,
                  doYouWantToUpdateCustomerInfo: true,
                }
              : { officeId: 1, activationChannelId: 78, savingsProductId: 1 }),
            ...(user?.staffId ? { staffId: user?.staffId } : {}),
            titleId: data?.moreInfo?.clients?.title?.id || "",
            firstname: data?.moreInfo?.clients?.firstname || "",
            lastname: data?.moreInfo?.clients?.lastname || "",
            middlename: data?.moreInfo?.clients?.middlename || "",
            mobileNo: data?.moreInfo?.clients?.mobileNo || "",
            emailAddress: data?.moreInfo?.clients?.emailAddress || "",
            maritalStatusId: data?.moreInfo?.clients?.maritalStatus?.id || "",
            dateOfBirth:
              parseDateToString(data?.moreInfo?.clients?.dateOfBirth) || "",
            alternateMobileNo: data?.moreInfo?.clients?.alternateMobileNo || "",
            numberOfDependent: data?.moreInfo?.clients?.numberOfDependent || "",
            dateFormat: dateLocaleFormat.DATE_FORMAT,
            locale: dateLocaleFormat.LOCALE,
            genderId: data?.moreInfo?.clients?.gender?.id || "",
            educationLevelId: data?.moreInfo?.clients?.educationLevel?.id || "",
            isComplete: !!data?.isComplete,
          },
        },
      },
      validationSchema: Yup.object({
        moreInfo: Yup.object().shape({
          clients: Yup.object().shape({
            titleId: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            firstname: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            middlename: Yup.string(),
            lastname: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            genderId: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            dateOfBirth: Yup.string(),
            maritalStatusId: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            numberOfDependent: Yup.string(),
            educationLevelId: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            mobileNo: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            alternateMobileNo: Yup.string(),
            emailAddress: Yup.string().email("Invalid email"),
          }),
        }),
      }),
    },
    {
      initialValues: {
        id: data?.id,
        moreInfo: {
          clients: {
            id: data?.moreInfo?.clients?.id,
            ...(user?.staffId ? { staffId: user?.staffId } : {}),
          },
          clientEmployers: [
            {
              ...(data?.moreInfo?.clientEmployers?.[0]?.id
                ? { id: data?.moreInfo?.clientEmployers?.[0]?.id }
                : {}),
              countryId: 29,
              stateId: data?.moreInfo?.clientEmployers?.[0]?.state?.id || "",
              lgaId: data?.moreInfo?.clientEmployers?.[0]?.lga?.id || "",
              staffId: data?.moreInfo?.clientEmployers?.[0]?.staffId || "",
              officeAddress:
                data?.moreInfo?.clientEmployers?.[0]?.officeAddress || "",
              nearestLandMark:
                data?.moreInfo?.clientEmployers?.[0]?.nearestLandMark || "",
              jobGrade: data?.moreInfo?.clientEmployers?.[0]?.jobGrade || "",
              employmentStatusId:
                data?.moreInfo?.clientEmployers?.[0]?.employmentStatus?.id ||
                "",
              salaryRangeId:
                data?.moreInfo?.clientEmployers?.[0]?.salaryRange?.id || "",
              employmentDate:
                parseDateToString(
                  data?.moreInfo?.clientEmployers?.[0]?.employmentDate
                ) || "",
              nextMonthSalaryPaymentDate:
                parseDateToString(
                  data?.moreInfo?.clientEmployers?.[0]
                    ?.nextMonthSalaryPaymentDate
                ) || "",
              employerId:
                data?.moreInfo?.clientEmployers?.[0]?.employer?.id || "",
              mobileNo: data?.moreInfo?.clientEmployers?.[0]?.mobileNo || "",
              emailAddress:
                data?.moreInfo?.clientEmployers?.[0]?.emailAddress || "",
              dateFormat: dateLocaleFormat.DATE_FORMAT,
              locale: dateLocaleFormat.LOCALE,
            },
          ],
        },
      },
      validationSchema: Yup.object({
        moreInfo: Yup.object().shape({
          clientEmployers: Yup.array().of(
            Yup.object().shape({
              employerId: Yup.string().when("isComplete", {
                is: true,
                then: Yup.string().required("Required"),
              }),
              stateId: Yup.string(),
              lgaId: Yup.string(),
              officeAddress: Yup.string(),
              nearestLandMark: Yup.string(),
              mobileNo: Yup.string(),
              staffId: Yup.string(),
              salaryRangeId: Yup.string(),
              jobGrade: Yup.string().when("isComplete", {
                is: true,
                then: Yup.string().required("Required"),
              }),
              employmentStatusId: Yup.string(),
              employmentDate: Yup.string().when("isComplete", {
                is: true,
                then: Yup.string().required("Required"),
              }),
              emailAddress: Yup.string(),
            })
          ),
        }),
      }),
    },
    {
      initialValues: {
        id: data?.id,
        moreInfo: {
          clients: {
            id: data?.moreInfo?.clients?.id,
          },
          addresses: [
            {
              ...(data?.moreInfo?.addresses?.[0]?.addressId
                ? { addressId: data?.moreInfo?.addresses?.[0]?.addressId }
                : {}),
              residentStatusId:
                data?.moreInfo?.addresses?.[0]?.residentStatusId || "",
              addressTypeId: 36,
              addressLine1: data?.moreInfo?.addresses?.[0]?.addressLine1 || "",
              lgaId: data?.moreInfo?.addresses?.[0]?.lgaId || "",
              nearestLandMark:
                data?.moreInfo?.addresses?.[0]?.nearestLandMark || "",
              stateProvinceId:
                data?.moreInfo?.addresses?.[0]?.stateProvinceId || "",
              dateMovedIn:
                parseDateToString(
                  data?.moreInfo?.addresses?.[0]?.dateMovedIn
                ) || "",
              countryId: 29,
              dateFormat: dateLocaleFormat.DATE_FORMAT,
              locale: dateLocaleFormat.LOCALE,
            },
          ],
        },
      },
      validationSchema: addressValidationSchema,
    },
    {
      initialValues: {
        id: data?.id,
        leadSourceId: data?.leadSource?.id,
        leadCategoryId: data?.leadCategory?.id,
        leadTypeId: data?.leadTypeId,
        leadRatingId: data?.leadRating?.id,
        expectedRevenueIncome: data?.expectedRevenueIncome,
        ...(user?.staffId ? { staffId: user?.staffId } : ""),
        locale: dateLocaleFormat.LOCALE,
        moreInfo: {
          clients: {
            ...(data?.moreInfo?.clients?.id
              ? {
                  id: data?.moreInfo?.clients?.id,
                  doYouWantToUpdateCustomerInfo: true,
                }
              : { officeId: 1 }),
            firstname: data?.moreInfo?.clients?.firstname || "",
            lastname: data?.moreInfo?.clients?.lastname || "",
            middlename: data?.moreInfo?.clients?.middlename || "",
            mobileNo: data?.moreInfo?.clients?.mobileNo || "",
            emailAddress: data?.moreInfo?.clients?.emailAddress || "",
            dateOfBirth:
              parseDateToString(data?.moreInfo?.clients?.dateOfBirth) || "",
            maritalStatusId: data?.moreInfo?.clients?.maritalStatus?.id || "",
            bvn: tempState?.clients?.bvn || data?.moreInfo?.clients?.bvn || "",
            alternateMobileNo: data?.moreInfo?.clients?.alternateMobileNo || "",
            numberOfDependent: data?.moreInfo?.clients?.numberOfDependent || "",
            dateFormat: dateLocaleFormat.DATE_FORMAT,
            locale: dateLocaleFormat.LOCALE,
            genderId: data?.moreInfo?.clients?.gender?.id || "",
            educationLevelId: data?.moreInfo?.clients?.educationLevel?.id || "",
            employmentSectorId:
              tempState?.clients?.employmentSectorId ||
              data?.moreInfo?.clients?.employmentSector?.id ||
              "",
            titleId: data?.moreInfo?.clients?.title?.id || "",
            isComplete: true,
          },
          clientEmployers: [
            {
              ...(data?.moreInfo?.clientEmployers?.[0]?.id
                ? { id: data?.moreInfo?.clientEmployers?.[0]?.id }
                : {}),

              countryId: 29,
              stateId: data?.moreInfo?.clientEmployers?.[0]?.state?.id || "",
              lgaId: data?.moreInfo?.clientEmployers?.[0]?.lga?.id || "",
              staffId: data?.moreInfo?.clientEmployers?.[0]?.staffId || "",
              officeAddress:
                data?.moreInfo?.clientEmployers?.[0]?.officeAddress || "",
              nearestLandMark:
                data?.moreInfo?.clientEmployers?.[0]?.nearestLandMark || "",
              jobGrade: data?.moreInfo?.clientEmployers?.[0]?.jobGrade || "",
              employmentStatusId:
                data?.moreInfo?.clientEmployers?.[0]?.employmentStatus?.id ||
                "",
              salaryRangeId:
                data?.moreInfo?.clientEmployers?.[0]?.salaryRange?.id || "",
              employmentDate:
                parseDateToString(
                  data?.moreInfo?.clientEmployers?.[0]?.employmentDate
                ) || "",
              employerId:
                data?.moreInfo?.clientEmployers?.[0]?.employer?.id || "",
              nextMonthSalaryPaymentDate:
                parseDateToString(
                  data?.moreInfo?.clientEmployers?.[0]
                    ?.nextMonthSalaryPaymentDate
                ) || "",
              mobileNo: data?.moreInfo?.clientEmployers?.[0]?.mobileNo || "",
              emailAddress:
                data?.moreInfo?.clientEmployers?.[0]?.emailAddress || "",
              dateFormat: dateLocaleFormat.DATE_FORMAT,
              locale: dateLocaleFormat.LOCALE,
            },
          ],
          addresses: [
            {
              ...(data?.moreInfo?.addresses?.[0]?.addressId
                ? { addressId: data?.moreInfo?.addresses?.[0]?.addressId }
                : {}),
              residentStatusId:
                data?.moreInfo?.addresses?.[0]?.residentStatusId || "",
              addressTypeId: 36,
              addressLine1: data?.moreInfo?.addresses?.[0]?.addressLine1 || "",
              lgaId: data?.moreInfo?.addresses?.[0]?.lgaId || "",
              nearestLandMark:
                data?.moreInfo?.addresses?.[0]?.nearestLandMark || "",
              stateProvinceId:
                data?.moreInfo?.addresses?.[0]?.stateProvinceId || "",
              dateMovedIn:
                parseDateToString(
                  data?.moreInfo?.addresses?.[0]?.dateMovedIn
                ) || "",
              countryId: 29,
              dateFormat: dateLocaleFormat.DATE_FORMAT,
              locale: dateLocaleFormat.LOCALE,
            },
          ],
        },
      },
      validationSchema: Yup.object({}),
    },
  ][step];
}
