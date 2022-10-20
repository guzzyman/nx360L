import {
  Button,
  Step,
  StepButton,
  StepContent,
  Stepper,
  useMediaQuery,
} from "@mui/material";
import { MediaQueryBreakpointEnum, RouteEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import useStep from "hooks/useStep";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import BackButton from "common/BackButton";
import { useParams } from "react-router";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { getUserErrorMessage, removeEmptyProperties } from "common/Utils";
import { nimbleX360CRMEmployerApi } from "./CRMEmployerStoreQuerySlice";
import { useNavigate } from "react-router";
import CRMEmployerAddEditInformation from "./CRMEmployerAddEditInformation";
import CRMEmployerAddEditAddress from "./CRMEmployerAddEditAddress";
import CRMEmployerAddEditPreview from "./CRMEmployerAddEditPreview";
import useScrollToTop from "common/useScrollToTop";
import { useState } from "react";

function CRMEmployerAddEdit(props) {
  let { id, parentId } = useParams();
  const isEdit = !!id;
  const isAddBranch = !!parentId;
  
  let navigate = useNavigate();
  const [addMutation, addMutationResult] =
    nimbleX360CRMEmployerApi.useAddCRMEmployerMutation();

  const [updateMutation, updateMutationResult] =
    nimbleX360CRMEmployerApi.useUpdateCRMEmployerMutation();

  const { data } = nimbleX360CRMEmployerApi.useGetCRMEmployerQuery(id, {
    skip: !id,
  });

  const [officeType, setOfficeType] = useState(
    isEdit ? (data?.parent?.id ? 1 : 2) : isAddBranch ? 2 : 1
  );


  const { enqueueSnackbar } = useSnackbar();

  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);

  const { step, nextStep, prevStep, setStep } = useStep(0);

  const employerInformationSchema = {
    name: Yup.string(),
    slug: Yup.string().required(),
    clientTypeId: Yup.string(),
    parentId: Yup.string(),
    sectorId: Yup.string(),
    industryId: Yup.string(),
  };

  const employerAddressSchema = {
    lgaId: Yup.string(),
    stateId: Yup.string(),
    rcNumber: Yup.string(),
    contactPerson: Yup.string(),
    officeAddress: Yup.string(),
    nearestLandMark: Yup.string(),
    mobileNo: Yup.string(),
    emailAddress: Yup.string().email(),
    emailExtension: Yup.string()
      .trim()
      .when("sectorId", {
        is: (val) => parseInt(val) === 17,
        then: Yup.string()
          .label("Email Extension")
          .matches(
            "^@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$",
            "Invalid email extension, e.g @gmail.com"
          )
          .required(),
        otherwise: Yup.string().label("Email Extension"),
      }),
  };

  const formik = useFormik({
    initialValues: {
      countryId: 29,
      active: true,
      lgaId: data?.lga?.id || "",
      stateId: data?.state?.id || "",
      rcNumber: data?.rcNumber || "",
      contactPerson: data?.contactPerson || "",
      officeAddress: data?.officeAddress || "",
      nearestLandMark: data?.nearestLandMark || "",
      mobileNo: data?.mobileNo || "",
      emailAddress: data?.emailAddress || "",
      emailExtension: data?.emailExtension || "",
      name: data?.name || "",
      slug: data?.slug || "",
      clientTypeId: data?.clientType?.id || "",
      parentId: (isAddBranch ? parentId : data?.parent?.id ) || "",
      sectorId: data?.sector?.id || "",
      industryId: data?.industry?.id || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      ...employerInformationSchema,
      ...employerAddressSchema,
    }),
    onSubmit: async (values) => {
      try {
        let response;
        const newValue = removeEmptyProperties(values);
        if (isEdit) {
          response = await updateMutation({
            id,
            ...newValue,
          }).unwrap();
        } else {
          response = await addMutation(removeEmptyProperties(values)).unwrap();
        }

        enqueueSnackbar(
          `Employer ${isEdit ? "Update" : "creation"} Successful`,
          { variant: "success" }
        );
        navigate(`/crm/employer/${response?.resourceId}`);
      } catch (error) {
        enqueueSnackbar(`Employer ${isEdit ? "Update" : "creation"}  Failed`, {
          variant: "error",
        });
        enqueueSnackbar(
          getUserErrorMessage(error.data.errors) || "Form error, contact support",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const contents = [
    {
      title: "Employer Information",
      body: (
        <CRMEmployerAddEditInformation
          formik={formik}
          isEdit={isEdit}
          setOfficeType={setOfficeType}
          officeType={officeType}
          parentId={parentId}
          data={data}
          isAddBranch={isAddBranch}
        />
      ),
    },
    {
      title: "Employer Address",
      body: <CRMEmployerAddEditAddress formik={formik} />,
    },
    {
      title: "Preview",
      body: (
        <CRMEmployerAddEditPreview
          formik={formik}
          setStep={setStep}
          officeType={officeType}
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
          isEdit
            ? updateMutationResult?.isLoading
            : addMutationResult?.isLoading
        }
        loading={
          isEdit
            ? updateMutationResult?.isLoading
            : addMutationResult?.isLoading
        }
        loadingPosition="end"
        endIcon={<></>}
        onClick={() => {
          if (step === 2) {
            formik.handleSubmit();
          } else {
            nextStep(step);
          }
        }}
      >
        {isLastStep ? "Submit" : step ? "preview" : "Next"}
      </LoadingButton>
    </div>
  );
  useScrollToTop(step);
  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "CRM", to: RouteEnum.CRM_EMPLOYER },
          { name: "Employer Details", to: `${RouteEnum.CRM_EMPLOYER}/${id}` },
          { name: "Create New Employer" },
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

export default CRMEmployerAddEdit;
