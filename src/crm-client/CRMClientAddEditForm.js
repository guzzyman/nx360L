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
import CRMClientAddEditFormSelector from "./CRMClientAddEditFormSelector";
import CRMClientAddEditFormPersonalInformation from "./CRMClientAddEditFormPersonalInformation";
import CRMClientAddEditFormEmploymentInformation from "./CRMClientAddEditFormEmploymentInformation";
import CRMClientAddEditFormNextOfKin from "./CRMClientAddEditFormNextOfKin";
import CRMClientAddEditFormBankDetails from "./CRMClientAddEditFormBankDetails";
import CRMClientAddEditFormDocumentUpload from "./CRMClientAddEditFormDocumentUpload";
import CRMClientAddEditFormPreview from "./CRMClientAddEditFormPreview";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import CRMClientAddEditFormResidentialInformation from "./CRMClientAddEditFormResidentialInformation";
import { useNavigate, useParams } from "react-router";
import {
  generateUUIDV4,
  getUserErrorMessage,
  isBlank,
  parseDateToString,
  removeBase64Meta,
  removeEmptyProperties,
} from "common/Utils";
import { format } from "date-fns/esm";
import { A_YEAR_FROM_NOW } from "./CRMClientConstants";
import { nimbleX360CRMLeadApi } from "crm-lead/CRMLeadStoreQuerySlice";
import useAuthUser from "hooks/useAuthUser";
import useScrollToTop from "common/useScrollToTop";

function CRMClientAddEditForm(props) {
  let navigate = useNavigate();
  let { id, leadId } = useParams();
  const [workEmailValid, setWorkEmailValid] = useState(false);
  const user = useAuthUser();

  const { enqueueSnackbar } = useSnackbar();
  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);
  const [tempState, setTempState] = useState(null);

  const isEdit = !!id;

  const [clientId, setClientId] = useState(id);

  const [activeStep, setActiveStep] = useState(0);

  const [BVNClientDetail, setBVNClientDetail] = useState(null);

  const { data } = nimbleX360CRMClientApi.useGetCRMCDLClientQuery(
    isEdit ? id : clientId,
    {
      skip: isEdit ? !id : !clientId,
    }
  );

  const { data: leadData } = nimbleX360CRMLeadApi.useGetCRMLeadQuery(leadId, {
    skip: !leadId,
  });

  const [addCRMClientMutation, addCRMClientMutationResul] =
    nimbleX360CRMClientApi.useAddCRMClientMutation();

  const stepFormikConfig = useMemo(() => {
    return getStepFormikConfig(
      data,
      activeStep,
      tempState,
      BVNClientDetail,
      leadData,
      user
    );
  }, [activeStep, data, tempState, BVNClientDetail, leadData, user]);

  useScrollToTop(activeStep);

  const formik = useFormik({
    initialValues: stepFormikConfig.initialValues,
    enableReinitialize: true,
    validationSchema: stepFormikConfig.validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("values", values);
        const clientIdentifierData =
          values?.clientIdentifiers?.length >= 1
            ? values?.clientIdentifiers?.map((clientIdentifier, i) => ({
                ...(clientIdentifier?.id ? { id: clientIdentifier?.id } : {}),
                documentKey: clientIdentifier?.documentKey,
                documentTypeId: clientIdentifier?.documentTypeId,
                status: "ACTIVE",
                expiryDate: !!clientIdentifier?.expiryDate
                  ? format(
                      clientIdentifier?.expiryDate,
                      dateLocaleFormat.DATE_FORMAT
                    )
                  : clientIdentifier?.expiryDate,
                dateFormat: dateLocaleFormat.DATE_FORMAT,
                locale: dateLocaleFormat.LOCALE,
                attachment: {
                  ...(clientIdentifier?.attachment?.id
                    ? { id: clientIdentifier?.attachment?.id }
                    : {}),
                  name: clientIdentifier?.attachment?.name || "",
                  fileName: clientIdentifier?.attachment?.fileName || "",
                  size: clientIdentifier?.attachment?.size || "",
                  type: clientIdentifier?.attachment?.type || "",
                  location: clientIdentifier?.attachment?.location,
                  description: clientIdentifier?.documentType?.name || "",
                },
              }))
            : [];

        const payLoad = [
          {},
          // Peronal Information and sector
          {
            clients: {
              ...(values?.clients?.id
                ? {
                    id: values?.clients?.id,
                    doYouWantToUpdateCustomerInfo: true,
                  }
                : {
                    officeId: 1,
                    activationChannelId: 78,
                    savingsProductId: 1,
                  }),
              ...(values?.clients?.staffId
                ? { staffId: values?.client?.staffId }
                : {}),
              firstname: values?.clients?.firstname,
              lastname: values?.clients?.lastname,
              middlename: values?.clients?.middlename,
              mobileNo: values?.clients?.mobileNo,
              emailAddress: values?.clients?.emailAddress,
              maritalStatusId: values?.clients?.maritalStatusId,
              dateOfBirth: !!values?.clients?.dateOfBirth
                ? format(
                    values?.clients?.dateOfBirth,
                    dateLocaleFormat.DATE_FORMAT
                  )
                : values?.clients?.dateOfBirth,
              bvn: values?.clients?.bvn,
              alternateMobileNo: values?.clients?.alternateMobileNo,
              numberOfDependent: values?.clients?.numberOfDependent,
              dateFormat: dateLocaleFormat.DATE_FORMAT,
              locale: dateLocaleFormat.LOCALE,
              genderId: values?.clients?.genderId,
              educationLevelId: values?.clients?.educationLevelId,
              employmentSectorId: values?.clients?.employmentSectorId,
              clientTypeId: values?.clients?.clientTypeId,
              titleId: values?.clients?.titleId,
              isComplete: values?.isComplete,
            },
          },

          // Employment Information
          {
            clients: {
              id: values?.clients?.id,
              // ...(values?.clients?.staffId
              //   ? { staffId: values?.clients?.staffId }
              //   : {}),
            },
            clientEmployers: [
              {
                workEmailVerified:
                  values?.clientEmployers?.[0]?.workEmailVerified,
                ...(values?.clientEmployers?.[0]?.id
                  ? { id: values?.clientEmployers?.[0]?.id }
                  : {}),
                countryId: 29,
                stateId: values?.clientEmployers?.[0]?.stateId,
                lgaId: values?.clientEmployers?.[0]?.lgaId,
                staffId: values?.clientEmployers?.[0]?.staffId,
                officeAddress: values?.clientEmployers?.[0]?.officeAddress,
                nearestLandMark: values?.clientEmployers?.[0]?.nearestLandMark,
                jobGrade: values?.clientEmployers?.[0]?.jobGrade,
                employmentStatusId:
                  values?.clientEmployers?.[0]?.employmentStatusId,
                salaryRangeId: values?.clientEmployers?.[0]?.salaryRangeId,
                employmentDate: !!values?.clientEmployers?.[0]?.employmentDate
                  ? format(
                      new Date(values?.clientEmployers?.[0]?.employmentDate),
                      dateLocaleFormat.DATE_FORMAT
                    )
                  : values?.clientEmployers?.[0]?.employmentDate,
                employerId: values?.clientEmployers?.[0]?.employerId,
                nextMonthSalaryPaymentDate: !!values?.clientEmployers?.[0]
                  ?.nextMonthSalaryPaymentDate
                  ? format(
                      values?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate,
                      dateLocaleFormat.DATE_FORMAT
                    )
                  : values?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate,
                mobileNo: values?.clientEmployers?.[0]?.mobileNo,
                emailAddress: values?.clientEmployers?.[0]?.emailAddress,
                dateFormat: dateLocaleFormat.DATE_FORMAT,
                locale: dateLocaleFormat.LOCALE,
              },
            ],
          },

          // Residentail Address
          {
            clients: {
              id: values?.clients?.id,
            },
            addresses: [
              {
                ...(values?.addresses?.[0]?.addressId
                  ? { addressId: values?.addresses?.[0]?.addressId }
                  : {}),
                residentStatusId: values?.addresses?.[0]?.residentStatusId,
                addressTypeId: 36,
                addressLine1: values?.addresses?.[0]?.addressLine1,
                lgaId: values?.addresses?.[0]?.lgaId,
                nearestLandMark: values?.addresses?.[0]?.nearestLandMark,
                stateProvinceId: values?.addresses?.[0]?.stateProvinceId,
                dateMovedIn: !!values?.addresses?.[0]?.dateMovedIn
                  ? format(
                      values?.addresses?.[0]?.dateMovedIn,
                      dateLocaleFormat.DATE_FORMAT
                    )
                  : values?.addresses?.[0]?.dateMovedIn,
                countryId: 29,
                dateFormat: dateLocaleFormat.DATE_FORMAT,
                locale: dateLocaleFormat.LOCALE,
              },
            ],
          },

          // Next Of Kin
          {
            clients: {
              id: values?.clients?.id,
            },
            addresses: [
              {
                ...(values?.addresses?.[0]?.addressId
                  ? { addressId: values?.addresses?.[0]?.addressId }
                  : {}),
                residentStatusId: values?.addresses?.[0]?.residentStatusId,
                addressTypeId: 36,
                addressLine1: values?.addresses?.[0]?.addressLine1,
                lgaId: values?.addresses?.[0]?.lgaId,
                nearestLandMark: values?.addresses?.[0]?.nearestLandMark,
                stateProvinceId: values?.addresses?.[0]?.stateProvinceId,
                dateMovedIn: !!values?.addresses?.[0]?.dateMovedIn
                  ? format(
                      values?.addresses?.[0]?.dateMovedIn,
                      dateLocaleFormat.DATE_FORMAT
                    )
                  : values?.addresses?.[0]?.dateMovedIn,
                countryId: 29,
                dateFormat: dateLocaleFormat.DATE_FORMAT,
                locale: dateLocaleFormat.LOCALE,
              },
              {
                ...(values?.addresses?.[1]?.addressId
                  ? { addressId: values?.addresses?.[1]?.addressId }
                  : {}),
                residentStatusId: values?.addresses?.[1]?.residentStatusId,
                addressTypeId: 36,
                addressLine1: values?.addresses?.[1]?.addressLine1,
                lgaId: values?.addresses?.[1]?.lgaId,
                nearestLandMark: values?.addresses?.[1]?.nearestLandMark,
                stateProvinceId: values?.addresses?.[1]?.stateProvinceId,
                dateMovedIn: !!values?.addresses?.[1]?.dateMovedIn
                  ? format(
                      values?.addresses?.[1]?.dateMovedIn,
                      dateLocaleFormat.DATE_FORMAT
                    )
                  : values?.addresses?.[1]?.dateMovedIn,
                countryId: 29,
                dateFormat: dateLocaleFormat.DATE_FORMAT,
                locale: dateLocaleFormat.LOCALE,
              },
            ],
            familyMembers: [
              {
                ...(values?.familyMembers?.[0]?.id
                  ? { id: values?.familyMembers?.[0]?.id }
                  : {}),
                titleId: values?.familyMembers?.[0]?.titleId || "",
                firstName: values?.familyMembers?.[0]?.firstName || "",
                middleName: values?.familyMembers?.[0]?.middleName || "",
                lastName: values?.familyMembers?.[0]?.lastName || "",
                relationshipId:
                  values?.familyMembers?.[0]?.relationshipId || "",
                maritalStatusId:
                  values?.familyMembers?.[0]?.maritalStatusId || "",
                mobileNumber: values?.familyMembers?.[0]?.mobileNumber || "",
                emailAddress: values?.familyMembers?.[0]?.emailAddress || "",
              },
            ],
          },

          // Bank Information
          {
            clients: {
              id: values?.clients?.id,
            },
            clientBanks: [
              {
                ...(values?.clientBanks?.[0]?.id
                  ? { id: values?.clientBanks?.[0]?.id }
                  : {}),
                bankId: values?.clientBanks?.[0]?.bankId || "",
                accountnumber: values?.clientBanks?.[0]?.accountnumber || "",
                accountname: values?.clientBanks?.[0]?.accountname || "",
                active: values?.clientBanks?.[0]?.active,
              },
            ],
          },

          // Client Document
          {
            clients: {
              id: values?.clients?.id,
            },
            avatar: values?.avatar || "",
            clientIdentifiers: [...clientIdentifierData],
          },

          // client preview
          {
            clients: {
              ...(values?.clients?.id
                ? {
                    id: values?.clients?.id,
                    doYouWantToUpdateCustomerInfo: true,
                  }
                : {
                    officeId: 1,
                    activationChannelId: 78,
                    savingsProductId: 1,
                  }),
              ...(values?.clients?.staffId
                ? { staffId: values?.client?.staffId }
                : {}),
              firstname: values?.clients?.firstname,
              lastname: values?.clients?.lastname,
              middlename: values?.clients?.middlename,
              mobileNo: values?.clients?.mobileNo,
              emailAddress: values?.clients?.emailAddress,
              maritalStatusId: values?.clients?.maritalStatusId,
              dateOfBirth: !!values?.clients?.dateOfBirth
                ? format(
                    values?.clients?.dateOfBirth,
                    dateLocaleFormat.DATE_FORMAT
                  )
                : values?.clients?.dateOfBirth,
              bvn: values?.clients?.bvn,
              alternateMobileNo: values?.clients?.alternateMobileNo,
              numberOfDependent: values?.clients?.numberOfDependent,
              dateFormat: dateLocaleFormat.DATE_FORMAT,
              locale: dateLocaleFormat.LOCALE,
              genderId: values?.clients?.genderId,
              educationLevelId: values?.clients?.educationLevelId,
              employmentSectorId: values?.clients?.employmentSectorId,
              clientTypeId: values?.clients?.clientTypeId,
              titleId: values?.clients?.titleId,
              isComplete: true,
            },
            addresses: [
              {
                ...(values?.addresses?.[0]?.addressId
                  ? { addressId: values?.addresses?.[0]?.addressId }
                  : {}),
                residentStatusId: values?.addresses?.[0]?.residentStatusId,
                addressTypeId: 36,
                addressLine1: values?.addresses?.[0]?.addressLine1,
                lgaId: values?.addresses?.[0]?.lgaId,
                nearestLandMark: values?.addresses?.[0]?.nearestLandMark,
                stateProvinceId: values?.addresses?.[0]?.stateProvinceId,
                dateMovedIn: !!values?.addresses?.[0]?.dateMovedIn
                  ? format(
                      values?.addresses?.[0]?.dateMovedIn,
                      dateLocaleFormat.DATE_FORMAT
                    )
                  : values?.addresses?.[0]?.dateMovedIn,
                countryId: 29,
                dateFormat: dateLocaleFormat.DATE_FORMAT,
                locale: dateLocaleFormat.LOCALE,
              },
            ],
            familyMembers: [
              {
                ...(values?.familyMembers?.[0]?.id
                  ? { id: values?.familyMembers?.[0]?.id }
                  : {}),
                titleId: values?.familyMembers?.[0]?.titleId || "",
                firstName: values?.familyMembers?.[0]?.firstName || "",
                middleName: values?.familyMembers?.[0]?.middleName || "",
                lastName: values?.familyMembers?.[0]?.lastName || "",
                relationshipId:
                  values?.familyMembers?.[0]?.relationshipId || "",
                maritalStatusId:
                  values?.familyMembers?.[0]?.maritalStatusId || "",
                mobileNumber: values?.familyMembers?.[0]?.mobileNumber || "",
                emailAddress: values?.familyMembers?.[0]?.emailAddress || "",
              },
            ],
            clientBanks: [
              {
                ...(values?.clientBanks?.[0]?.id
                  ? { id: values?.clientBanks?.[0]?.id }
                  : {}),
                bankId: values?.clientBanks?.[0]?.bankId || "",
                accountnumber: values?.clientBanks?.[0]?.accountnumber || "",
                accountname: values?.clientBanks?.[0]?.accountname || "",
                active: values?.clientBanks?.[0]?.active,
              },
            ],
            clientIdentifiers: [...clientIdentifierData],
            clientEmployers: [
              {
                workEmailVerified:
                  values?.clientEmployers?.[0]?.workEmailVerified,
                ...(values?.clientEmployers?.[0]?.id
                  ? { id: values?.clientEmployers?.[0]?.id }
                  : {}),
                countryId: 29,
                stateId: values?.clientEmployers?.[0]?.stateId,
                lgaId: values?.clientEmployers?.[0]?.lgaId,
                staffId: values?.clientEmployers?.[0]?.staffId,
                officeAddress: values?.clientEmployers?.[0]?.officeAddress,
                nearestLandMark: values?.clientEmployers?.[0]?.nearestLandMark,
                jobGrade: values?.clientEmployers?.[0]?.jobGrade,
                employmentStatusId:
                  values?.clientEmployers?.[0]?.employmentStatusId,
                salaryRangeId: values?.clientEmployers?.[0]?.salaryRangeId,
                employmentDate: !!values?.clientEmployers?.[0]?.employmentDate
                  ? format(
                      values?.clientEmployers?.[0]?.employmentDate,
                      dateLocaleFormat.DATE_FORMAT
                    )
                  : values?.clientEmployers?.[0]?.employmentDate,
                employerId: values?.clientEmployers?.[0]?.employerId,
                nextMonthSalaryPaymentDate: !!values?.clientEmployers?.[0]
                  ?.nextMonthSalaryPaymentDate
                  ? format(
                      values?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate,
                      dateLocaleFormat.DATE_FORMAT
                    )
                  : values?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate,
                mobileNo: values?.clientEmployers?.[0]?.mobileNo,
                emailAddress: values?.clientEmployers?.[0]?.emailAddress,
                dateFormat: dateLocaleFormat.DATE_FORMAT,
                locale: dateLocaleFormat.LOCALE,
              },
            ],
          },
        ][activeStep];

        if (!isFirstStep || activeStep === 7) {
          const responseData = await addCRMClientMutation(
            removeEmptyProperties(payLoad)
          ).unwrap();

          setClientId(responseData?.clientId);
          setTempState(null);
          enqueueSnackbar(`${isEdit ? "Updated" : "Added"}`, {
            variant: "success",
          });
        } else if (isFirstStep) {
          setTempState(formik.values);
        }
        if (activeStep === 7) {
          if (clientId) {
            navigate(`${RouteEnum.CRM_CLIENTS}/${clientId}`);
          } else {
            navigate(`${RouteEnum.CRM_CLIENTS}`);
          }
        } else {
          nextStep();
        }
      } catch (error) {
        console.log("error", error);
        if (activeStep !== 1 && activeStep !== 7) {
          nextStep();
        }
        enqueueSnackbar(`Failed to add ${isEdit ? "Updated" : "Added"}`, {
          variant: "error",
        });
        activeStep === 7 &&
          enqueueSnackbar("Check preview, and fill in the required fields", {
            variant: "error",
          });
        enqueueSnackbar(
          getUserErrorMessage(error?.data?.errors) ||
            "Form Error, contact support",
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
    {
      content: (
        <CRMClientAddEditFormSelector
          formik={formik}
          isEdit={isEdit}
          data={data}
          setBVNClientDetail={setBVNClientDetail}
        />
      ),
    },
    {
      title: "Personal Information",
      content: (
        <CRMClientAddEditFormPersonalInformation
          isEdit={isEdit}
          formik={formik}
          bvnClientDetail={BVNClientDetail}
        />
      ),
    },
    {
      title: "Employment Information",
      content: (
        <CRMClientAddEditFormEmploymentInformation
          workEmailValid={workEmailValid}
          setWorkEmailValid={setWorkEmailValid}
          formik={formik}
          isEdit={isEdit}
          data={data}
        />
      ),
    },
    {
      title: "Residential Information",
      content: <CRMClientAddEditFormResidentialInformation formik={formik} />,
    },
    {
      title: "Next of Kin",
      content: <CRMClientAddEditFormNextOfKin formik={formik} />,
    },
    {
      title: "Bank Details",
      content: (
        <CRMClientAddEditFormBankDetails formik={formik} isEdit={isEdit} />
      ),
    },
    {
      title: "Document Upload",
      content: (
        <CRMClientAddEditFormDocumentUpload formik={formik} isEdit={isEdit} />
      ),
    },
    {
      title: "Preview",
      content: (
        <CRMClientAddEditFormPreview
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

  console.log("formik", formik.values);
  return (
    <>
      <PageHeader
        title={
          isLastStep ? step.title : `${isEdit ? "Edit New" : "Add New"} Client`
        }
        breadcrumbs={[
          { name: "CRM", to: "/" },
          { name: "Clients", to: RouteEnum.CRM_CLIENTS },
          isEdit
            ? {
                name: "Client Details",
                to: `${RouteEnum.CRM_CLIENTS}/${id}`,
              }
            : {},
          { name: `${isEdit ? "Edit New" : "Add New"} Client` },
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
        {activeStep === 7 && (
          <LoadingButton
            disabled={
              addCRMClientMutationResul.isLoading ||
              (!BVNClientDetail &&
                isBlank(formik.values.clients?.employmentSectorId))
            }
            loading={addCRMClientMutationResul.isLoading}
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
              addCRMClientMutationResul.isLoading ||
              (activeStep === 0 &&
                (isEdit && data?.clients?.bvn !== undefined
                  ? isBlank(formik.values.clients?.employmentSectorId)
                  : (!BVNClientDetail &&
                      isEdit &&
                      !isBlank(data?.clients?.bvn)) ||
                    isBlank(formik.values.clients?.employmentSectorId)))
            }
            loading={addCRMClientMutationResul.isLoading}
            loadingPosition="end"
            endIcon={<></>}
            onClick={formik.handleSubmit}
          >
            {isFirstStep ? "Proceed" : isSecondToTheLast ? "Preview" : "Next"}
          </LoadingButton>
          {/* )} */}
        </div>
      )}
    </>
  );
}

export default CRMClientAddEditForm;

const addressValidationSchema = Yup.object({
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
      dateMovedIn: Yup.date().nullable(),
    })
  ),
});

function getStepFormikConfig(
  data,
  step,
  tempState,
  BVNClientDetail,
  leadData,
  user
) {
  const clientIdentifierData =
    data?.clientIdentifiers?.length >= 1
      ? data?.clientIdentifiers?.map((clientIdentifier, i) => ({
          ...(clientIdentifier?.id ? { id: clientIdentifier?.id } : {}),
          documentKey:
            clientIdentifier?.documentKey ||
            `${generateUUIDV4()}-${new Date().getTime()}`,
          documentTypeId: clientIdentifier?.documentType?.id || 66,
          status: "ACTIVE",
          expiryDate:
            (!!clientIdentifier?.expiryDate
              ? new Date(parseDateToString(clientIdentifier?.expiryDate))
              : clientIdentifier?.expiryDate) ||
            A_YEAR_FROM_NOW ||
            "",
          dateFormat: dateLocaleFormat.DATE_FORMAT,
          locale: dateLocaleFormat.LOCALE,
          attachment: {
            ...(clientIdentifier?.attachment?.id
              ? { id: clientIdentifier?.attachment?.id }
              : {}),
            name: clientIdentifier?.attachment?.name || "",
            fileName: clientIdentifier?.attachment?.fileName || "",
            size: clientIdentifier?.attachment?.size || "",
            type: clientIdentifier?.attachment?.type || "",
            location:
              removeBase64Meta(clientIdentifier?.attachment?.location) || "",
            description: clientIdentifier?.documentType?.name || "",
          },
        }))
      : [];

  return [
    {
      initialValues: {
        clients: {
          bvn: data?.clients?.bvn || "",
          employmentSectorId:
            data?.clients?.employmentSector?.id ||
            leadData?.moreInfo?.clients?.employmentSector?.id ||
            "",
          clientTypeId:
            data?.clients?.clientType?.id ||
            leadData?.moreInfo?.clients?.clientType?.id ||
            "",
        },
      },
      validationSchema: Yup.object({
        bvn: Yup.string().when(["showBvn"], {
          is: true,
          then: Yup.string()
            .min(11, "BVN must be number and  11 digits")
            .max(11, "BVN must be number and  11 digits")
            .required("Required"),
        }),
        employmentSectorId: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
        clientTypeId: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
      }),
    },
    {
      initialValues: {
        clients: {
          ...(data?.clients?.id
            ? {
                id: data?.clients?.id,
                doYouWantToUpdateCustomerInfo: true,
              }
            : { officeId: 1, activationChannelId: 78, savingsProductId: 1 }),
          ...(user?.staffId ? { staffId: user?.staffId } : {}),
          firstname:
            BVNClientDetail?.data?.firstName ||
            data?.clients?.firstname ||
            leadData?.moreInfo?.clients?.firstname ||
            "",
          lastname:
            BVNClientDetail?.data?.lastName ||
            data?.clients?.lastname ||
            leadData?.moreInfo?.clients?.lastname ||
            "",
          middlename:
            BVNClientDetail?.data?.otherNames ||
            data?.clients?.middlename ||
            leadData?.moreInfo?.clients?.middlename ||
            "",
          mobileNo:
            BVNClientDetail?.data?.phone ||
            data?.clients?.mobileNo ||
            leadData?.moreInfo?.clients?.mobileNo ||
            "",
          emailAddress:
            BVNClientDetail?.data?.personalEmail ||
            data?.clients?.emailAddress ||
            leadData?.moreInfo?.clients?.emailAddress ||
            "",
          maritalStatusId:
            data?.clients?.maritalStatus?.id ||
            leadData?.moreInfo?.clients?.maritalStatus?.id ||
            "",
          dateOfBirth:
            (BVNClientDetail?.data?.dateOfBirth
              ? new Date(BVNClientDetail?.data?.dateOfBirth)
              : "") ||
            (!!leadData?.moreInfo?.clients?.dateOfBirth
              ? new Date(
                  parseDateToString(leadData?.moreInfo?.clients?.dateOfBirth)
                )
              : leadData?.moreInfo?.clients?.dateOfBirth) ||
            (!!data?.clients?.dateOfBirth
              ? new Date(parseDateToString(data?.clients?.dateOfBirth))
              : data?.clients?.dateOfBirth) ||
            "",
          bvn:
            tempState?.clients?.bvn ||
            data?.clients?.bvn ||
            leadData?.moreInfo?.clients?.bvn ||
            "",
          alternateMobileNo:
            data?.clients?.alternateMobileNo ||
            leadData?.moreInfo?.clients?.alternateMobileNo ||
            "",
          numberOfDependent:
            data?.clients?.numberOfDependent ||
            leadData?.moreInfo?.clients?.numberOfDependent ||
            "",
          dateFormat: dateLocaleFormat.DATE_FORMAT,
          locale: dateLocaleFormat.LOCALE,
          genderId:
            (BVNClientDetail?.data?.gender
              ? BVNClientDetail?.data?.gender.toLowerCase() === "male"
                ? 45
                : 46
              : "") ||
            data?.clients?.gender?.id ||
            leadData?.moreInfo?.clients?.gender?.id ||
            "",
          educationLevelId:
            data?.clients?.educationLevel?.id ||
            leadData?.moreInfo?.clients?.educationLevel?.id ||
            "",
          employmentSectorId:
            tempState?.clients?.employmentSectorId ||
            data?.clients?.employmentSector?.id ||
            leadData?.moreInfo?.clients?.employmentSector?.id ||
            "",
          clientTypeId:
            tempState?.clients?.clientTypeId ||
            data?.clients?.clientType?.id ||
            leadData?.moreInfo?.clients?.clientType?.id ||
            "",
          titleId:
            data?.clients?.title?.id ||
            leadData?.moreInfo?.clients?.title?.id ||
            "",
          isComplete: !!data?.isComplete,
        },
      },
      validationSchema: Yup.object({
        bvn: Yup.string().when(["showBvn"], {
          is: true,
          then: Yup.string()
            .min(11, "BVN must be number and  11 digits")
            .max(11, "BVN must be number and  11 digits")
            .required("Required"),
        }),
        employmentSectorId: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
        clientTypeId: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
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
    },
    {
      initialValues: {
        clients: {
          id: data?.clients?.id,
          ...(user?.staffId ? { staffId: user?.staffId } : {}),
        },
        clientEmployers: [
          {
            workEmailVerified:
              data?.clientEmployers?.[0]?.workEmailVerified ||
              leadData?.moreInfo?.clientEmployers?.[0]?.workEmailVerified ||
              false,
            ...(data?.clientEmployers?.[0]?.id
              ? { id: data?.clientEmployers?.[0]?.id }
              : {}),
            ...(leadData?.moreInfo?.clientEmployers?.[0]?.id
              ? { id: leadData?.moreInfo?.clientEmployers?.[0]?.id }
              : {}),

            countryId: 29,
            stateId:
              data?.clientEmployers?.[0]?.state?.id ||
              leadData?.moreInfo?.clientEmployers?.[0]?.state?.id ||
              "",
            lgaId:
              data?.clientEmployers?.[0]?.lga?.id ||
              leadData?.moreInfo?.clientEmployers?.[0]?.lga?.id ||
              "",
            staffId:
              data?.clientEmployers?.[0]?.staffId ||
              leadData?.moreInfo?.clientEmployers?.[0]?.staffId ||
              "",
            officeAddress:
              data?.clientEmployers?.[0]?.officeAddress ||
              leadData?.moreInfo?.clientEmployers?.[0]?.officeAddress ||
              "",
            nearestLandMark:
              data?.clientEmployers?.[0]?.nearestLandMark ||
              leadData?.moreInfo?.clientEmployers?.[0]?.nearestLandMark ||
              "",
            jobGrade:
              data?.clientEmployers?.[0]?.jobGrade ||
              leadData?.moreInfo?.clientEmployers?.[0]?.jobGrade ||
              "",
            employmentStatusId:
              data?.clientEmployers?.[0]?.employmentStatus?.id ||
              leadData?.moreInfo?.clientEmployers?.[0]?.employmentStatus?.id ||
              "",
            salaryRangeId:
              data?.clientEmployers?.[0]?.salaryRange?.id ||
              leadData?.moreInfo?.clientEmployers?.[0]?.salaryRange?.id ||
              "",
            employmentDate:
              (!!data?.clientEmployers?.[0]?.employmentDate &&
                new Date(
                  parseDateToString(data?.clientEmployers?.[0]?.employmentDate)
                )) ||
              (!!leadData?.moreInfo?.clientEmployers?.[0]?.employmentDate &&
                new Date(
                  parseDateToString(
                    leadData?.moreInfo?.clientEmployers?.[0]?.employmentDate
                  )
                )) ||
              "",
            employerId:
              data?.clientEmployers?.[0]?.employer?.id ||
              leadData?.moreInfo?.clientEmployers?.[0]?.employer?.id ||
              "",
            nextMonthSalaryPaymentDate:
              (!!data?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate &&
                new Date(
                  parseDateToString(
                    data?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate
                  )
                )) ||
              (!!leadData?.moreInfo?.clientEmployers?.[0]
                ?.nextMonthSalaryPaymentDate &&
                new Date(
                  parseDateToString(
                    leadData?.moreInfo?.clientEmployers?.[0]
                      ?.nextMonthSalaryPaymentDate
                  )
                )) ||
              "",
            mobileNo:
              data?.clientEmployers?.[0]?.mobileNo ||
              leadData?.moreInfo?.clientEmployers?.[0]?.mobileNo ||
              "",
            emailAddress:
              data?.clientEmployers?.[0]?.emailAddress ||
              leadData?.moreInfo?.clientEmployers?.[0]?.emailAddress ||
              "",
            dateFormat: dateLocaleFormat.DATE_FORMAT,
            locale: dateLocaleFormat.LOCALE,
          },
        ],
      },
      validationSchema: Yup.object({
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
    },
    {
      initialValues: {
        clients: {
          id: data?.clients?.id,
        },
        addresses: [
          {
            ...(data?.addresses?.[0]?.addressId
              ? { addressId: data?.addresses?.[0]?.addressId }
              : {}),
            ...(leadData?.moreInfo?.addresses?.[0]?.addressId
              ? { addressId: leadData?.moreInfo?.addresses?.[0]?.addressId }
              : {}),
            residentStatusId:
              data?.addresses?.[0]?.residentStatusId ||
              leadData?.moreInfo?.addresses?.[0]?.residentStatusId ||
              "",
            addressTypeId: 36,
            addressLine1:
              data?.addresses?.[0]?.addressLine1 ||
              leadData?.moreInfo?.addresses?.[0]?.addressLine1 ||
              "",
            lgaId:
              data?.addresses?.[0]?.lgaId ||
              leadData?.moreInfo?.addresses?.[0]?.lga?.id ||
              "",
            nearestLandMark:
              data?.addresses?.[0]?.nearestLandMark ||
              leadData?.moreInfo?.addresses?.[0]?.nearestLandMark ||
              "",
            stateProvinceId:
              data?.addresses?.[0]?.stateProvinceId ||
              leadData?.moreInfo?.addresses?.[0]?.stateProvince?.id ||
              "",
            dateMovedIn:
              (!!data?.addresses?.[0]?.dateMovedIn
                ? new Date(parseDateToString(data?.addresses?.[0]?.dateMovedIn))
                : data?.addresses?.[0]?.dateMovedIn) ||
              (!!leadData?.moreInfo?.addresses?.[0]?.dateMovedIn
                ? new Date(
                    parseDateToString(
                      leadData?.moreInfo?.addresses?.[0]?.dateMovedIn
                    )
                  )
                : leadData?.moreInfo?.addresses?.[0]?.dateMovedIn) ||
              "",
            countryId: 29,
            dateFormat: dateLocaleFormat.DATE_FORMAT,
            locale: dateLocaleFormat.LOCALE,
          },
        ],
      },
      validationSchema: addressValidationSchema,
    },
    {
      initialValues: {
        clients: {
          id: data?.clients?.id,
        },
        addresses: [
          {
            ...(data?.addresses?.[0]?.addressId
              ? { addressId: data?.addresses?.[0]?.addressId }
              : {}),
            residentStatusId: data?.addresses?.[0]?.residentStatusId || "",
            addressTypeId: 36,
            addressLine1: data?.addresses?.[0]?.addressLine1 || "",
            lgaId: data?.addresses?.[0]?.lgaId || "",
            nearestLandMark: data?.addresses?.[0]?.nearestLandMark || "",
            stateProvinceId: data?.addresses?.[0]?.stateProvinceId || "",
            dateMovedIn:
              (!!data?.addresses?.[0]?.dateMovedIn
                ? new Date(parseDateToString(data?.addresses?.[0]?.dateMovedIn))
                : data?.addresses?.[0]?.dateMovedIn) || "",
            countryId: 29,
            dateFormat: dateLocaleFormat.DATE_FORMAT,
            locale: dateLocaleFormat.LOCALE,
          },
          {
            ...(data?.addresses?.[1]?.addressId
              ? { addressId: data?.addresses?.[1]?.addressId }
              : {}),
            residentStatusId: data?.addresses?.[1]?.residentStatusId || "",
            addressTypeId: 38,
            addressLine1: data?.addresses?.[1]?.addressLine1 || "",
            lgaId: data?.addresses?.[1]?.lgaId || "",
            nearestLandMark: data?.addresses?.[1]?.nearestLandMark || "",
            stateProvinceId: data?.addresses?.[1]?.stateProvinceId || "",
            dateMovedIn:
              (!!data?.addresses?.[1]?.dateMovedIn
                ? new Date(parseDateToString(data?.addresses?.[1]?.dateMovedIn))
                : data?.addresses?.[1]?.dateMovedIn) || "",
            countryId: 29,
            dateFormat: dateLocaleFormat.DATE_FORMAT,
            locale: dateLocaleFormat.LOCALE,
          },
        ],
        familyMembers: [
          {
            ...(data?.familyMembers?.[0]?.id
              ? { id: data?.familyMembers?.[0]?.id }
              : {}),
            titleId: data?.familyMembers?.[0]?.titleId || "",
            firstName: data?.familyMembers?.[0]?.firstName || "",
            middleName: data?.familyMembers?.[0]?.middleName || "",
            lastName: data?.familyMembers?.[0]?.lastName || "",
            relationshipId: data?.familyMembers?.[0]?.relationshipId || "",
            maritalStatusId: data?.familyMembers?.[0]?.maritalStatusId || "",
            mobileNumber: data?.familyMembers?.[0]?.mobileNumber || "",
            emailAddress: data?.familyMembers?.[0]?.emailAddress || "",
          },
        ],
      },
      validationSchema: Yup.object({
        address: addressValidationSchema,
        familyMembers: Yup.array().of(
          Yup.object().shape({
            titleId: Yup.string(),
            maritalStatusId: Yup.string(),
            relationshipId: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            firstName: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            middleName: Yup.string(),
            lastName: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            mobileNo: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            emailAddress: Yup.string().email(),
          })
        ),
      }),
    },
    {
      initialValues: {
        clients: {
          id: data?.clients?.id,
        },
        clientBanks: [
          {
            ...(data?.clientBanks?.[0]?.id
              ? { id: data?.clientBanks?.[0]?.id }
              : {}),
            bankId: data?.clientBanks?.[0]?.bank?.id || "",
            accountnumber: data?.clientBanks?.[0]?.accountnumber || "",
            accountname: data?.clientBanks?.[0]?.accountname || "",
            active: data?.clientBanks?.[0]?.active || false,
          },
        ],
      },
      validationSchema: Yup.object({
        clientBanks: Yup.array().of(
          Yup.object().shape({
            bankId: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            accountnumber: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            accountname: Yup.string(),
          })
        ),
      }),
    },
    {
      initialValues: {
        clients: {
          id: data?.clients?.id,
        },
        avatar: data?.avatar || "",
        clientIdentifiers: [...clientIdentifierData],
      },
      validationSchema: Yup.object({
        avatar: Yup.string().when("isComplete", {
          is: true,
          then: Yup.string().required("Required"),
        }),
        clientIdentifiers: Yup.array().of(
          Yup.object().shape({
            documentTypeId: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            expiryDate: Yup.string().when("isComplete", {
              is: true,
              then: Yup.string().required("Required"),
            }),
            attachment: Yup.object().shape({
              name: Yup.string(),
              fileName: Yup.string(),
              location: Yup.string(),
              size: Yup.number(),
              type: Yup.string(),
            }),
            accountname: Yup.string(),
          })
        ),
      }),
    },
    {
      initialValues: {
        clients: {
          ...(data?.clients?.id
            ? {
                id: data?.clients?.id,
                doYouWantToUpdateCustomerInfo: true,
              }
            : { officeId: 1 }),
          ...(user?.staffId ? { staffId: user?.staffId } : {}),
          firstname: data?.clients?.firstname || "",
          lastname: data?.clients?.lastname || "",
          middlename: data?.clients?.middlename || "",
          mobileNo: data?.clients?.mobileNo || "",
          emailAddress: data?.clients?.emailAddress || "",
          dateOfBirth:
            (!!data?.clients?.dateOfBirth
              ? new Date(parseDateToString(data?.clients?.dateOfBirth))
              : data?.clients?.dateOfBirth) || "",
          maritalStatusId: data?.clients?.maritalStatus?.id || "",
          bvn: tempState?.clients?.bvn || data?.clients?.bvn || "",
          alternateMobileNo: data?.clients?.alternateMobileNo || "",
          numberOfDependent: data?.clients?.numberOfDependent || "",
          dateFormat: dateLocaleFormat.DATE_FORMAT,
          locale: dateLocaleFormat.LOCALE,
          genderId: data?.clients?.gender?.id || "",
          educationLevelId: data?.clients?.educationLevel?.id || "",
          employmentSectorId:
            tempState?.clients?.employmentSectorId ||
            data?.clients?.employmentSector?.id ||
            "",
          clientTypeId:
            tempState?.clients?.clientTypeId ||
            data?.clients?.clientType?.id ||
            "",
          titleId: data?.clients?.title?.id || "",
          isComplete: true,
        },
        addresses: [
          {
            ...(data?.addresses?.[0]?.addressId
              ? { addressId: data?.addresses?.[0]?.addressId }
              : {}),
            residentStatusId: data?.addresses?.[0]?.residentStatusId || "",
            addressTypeId: 36,
            addressLine1: data?.addresses?.[0]?.addressLine1 || "",
            lgaId: data?.addresses?.[0]?.lgaId || "",
            nearestLandMark: data?.addresses?.[0]?.nearestLandMark || "",
            stateProvinceId: data?.addresses?.[0]?.stateProvinceId || "",
            dateMovedIn:
              (!!data?.addresses?.[0]?.dateMovedIn
                ? new Date(parseDateToString(data?.addresses?.[0]?.dateMovedIn))
                : data?.addresses?.[0]?.dateMovedIn) || "",
            countryId: 29,
            dateFormat: dateLocaleFormat.DATE_FORMAT,
            locale: dateLocaleFormat.LOCALE,
          },
          {
            ...(data?.addresses?.[1]?.addressId
              ? { addressId: data?.addresses?.[1]?.addressId }
              : {}),
            residentStatusId: data?.addresses?.[1]?.residentStatusId || "",
            addressTypeId: 38,
            addressLine1: data?.addresses?.[1]?.addressLine1 || "",
            lgaId: data?.addresses?.[1]?.lgaId || "",
            nearestLandMark: data?.addresses?.[1]?.nearestLandMark || "",
            stateProvinceId: data?.addresses?.[1]?.stateProvinceId || "",
            dateMovedIn:
              (!!data?.addresses?.[0]?.dateMovedIn
                ? new Date(parseDateToString(data?.addresses?.[1]?.dateMovedIn))
                : data?.addresses?.[0]?.dateMovedIn) || "",
            countryId: 29,
            dateFormat: dateLocaleFormat.DATE_FORMAT,
            locale: dateLocaleFormat.LOCALE,
          },
        ],
        familyMembers: [
          {
            ...(data?.familyMembers?.[0]?.id
              ? { id: data?.familyMembers?.[0]?.id }
              : {}),
            titleId: data?.familyMembers?.[0]?.titleId || "",
            firstName: data?.familyMembers?.[0]?.firstName || "",
            middleName: data?.familyMembers?.[0]?.middleName || "",
            lastName: data?.familyMembers?.[0]?.lastName || "",
            relationshipId: data?.familyMembers?.[0]?.relationshipId || "",
            maritalStatusId: data?.familyMembers?.[0]?.maritalStatusId || "",
            mobileNumber: data?.familyMembers?.[0]?.mobileNumber || "",
            emailAddress: data?.familyMembers?.[0]?.emailAddress || "",
          },
        ],
        clientBanks: [
          {
            ...(data?.clientBanks?.[0]?.id
              ? { id: data?.clientBanks?.[0]?.id }
              : {}),
            bankId: data?.clientBanks?.[0]?.bank?.id || "",
            accountnumber: data?.clientBanks?.[0]?.accountnumber || "",
            accountname: data?.clientBanks?.[0]?.accountname || "",
            active: data?.clientBanks?.[0]?.active || false,
          },
        ],
        clientIdentifiers: [...clientIdentifierData],
        clientEmployers: [
          {
            workEmailVerified:
              data?.clientEmployers?.[0]?.workEmailVerified ||
              leadData?.moreInfo?.clientEmployers?.[0]?.workEmailVerified ||
              false,
            ...(data?.clientEmployers?.[0]?.id
              ? { id: data?.clientEmployers?.[0]?.id }
              : {}),
            ...(leadData?.moreInfo?.clientEmployers?.[0]?.id
              ? { id: leadData?.moreInfo?.clientEmployers?.[0]?.id }
              : {}),
            countryId: 29,
            stateId:
              data?.clientEmployers?.[0]?.state?.id ||
              leadData?.moreInfo?.clientEmployers?.[0]?.state?.id ||
              "",
            lgaId:
              data?.clientEmployers?.[0]?.lga?.id ||
              leadData?.moreInfo?.clientEmployers?.[0]?.lga?.id ||
              "",
            staffId:
              data?.clientEmployers?.[0]?.staffId ||
              leadData?.moreInfo?.clientEmployers?.[0]?.staffId ||
              "",
            officeAddress:
              data?.clientEmployers?.[0]?.officeAddress ||
              leadData?.moreInfo?.clientEmployers?.[0]?.officeAddress ||
              "",
            nearestLandMark:
              data?.clientEmployers?.[0]?.nearestLandMark ||
              leadData?.moreInfo?.clientEmployers?.[0]?.nearestLandMark ||
              "",
            jobGrade:
              data?.clientEmployers?.[0]?.jobGrade ||
              leadData?.moreInfo?.clientEmployers?.[0]?.jobGrade ||
              "",
            employmentStatusId:
              data?.clientEmployers?.[0]?.employmentStatus?.id ||
              leadData?.moreInfo?.clientEmployers?.[0]?.employmentStatus?.id ||
              "",
            salaryRangeId:
              data?.clientEmployers?.[0]?.salaryRange?.id ||
              leadData?.moreInfo?.clientEmployers?.[0]?.salaryRange?.id ||
              "",
            employmentDate:
              (!!data?.clientEmployers?.[0]?.employmentDate
                ? new Date(
                    parseDateToString(
                      data?.clientEmployers?.[0]?.employmentDate
                    )
                  )
                : data?.clientEmployers?.[0]?.employmentDate) ||
              (!!leadData?.moreInfo?.clientEmployers?.[0]?.employmentDate
                ? new Date(
                    parseDateToString(
                      leadData?.moreInfo?.clientEmployers?.[0]?.employmentDate
                    )
                  )
                : leadData?.moreInfo?.clientEmployers?.[0]?.employmentDate) ||
              "",
            employerId:
              data?.clientEmployers?.[0]?.employer?.id ||
              leadData?.moreInfo?.clientEmployers?.[0]?.employer?.id ||
              "",
            nextMonthSalaryPaymentDate:
              (!!data?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate
                ? new Date(
                    parseDateToString(
                      data?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate
                    )
                  )
                : data?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate) ||
              (!!leadData?.moreInfo?.clientEmployers?.[0]
                ?.nextMonthSalaryPaymentDate
                ? new Date(
                    parseDateToString(
                      leadData?.moreInfo?.clientEmployers?.[0]
                        ?.nextMonthSalaryPaymentDate
                    )
                  )
                : leadData?.moreInfo?.clientEmployers?.[0]
                    ?.nextMonthSalaryPaymentDate) ||
              "",
            mobileNo:
              data?.clientEmployers?.[0]?.mobileNo ||
              leadData?.moreInfo?.clientEmployers?.[0]?.mobileNo ||
              "",
            emailAddress:
              data?.clientEmployers?.[0]?.emailAddress ||
              leadData?.moreInfo?.clientEmployers?.[0]?.emailAddress ||
              "",
            dateFormat: dateLocaleFormat.DATE_FORMAT,
            locale: dateLocaleFormat.LOCALE,
          },
        ],
      },
      validationSchema: Yup.object({}),
    },
  ][step];
}
