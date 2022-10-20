import {
  Button,
  Step,
  StepButton,
  StepContent,
  Stepper,
  useMediaQuery,
} from "@mui/material";
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
import { getUserErrorMessage, removeEmptyProperties } from "common/Utils";
import { nimbleX360CRMVendorApi } from "./CRMVendorStoreQuerySlice";
import useScrollToTop from "common/useScrollToTop";
import CRMVendorAddEditFormPersonalInformation from "./CRMVendorAddEditFormPersonalInformation";
import CRMVendorAddEditFormResidentialInformation from "./CRMVendorAddEditFormResidentialInformation";
import CRMVendorAddEditFormBankDetails from "./CRMVendorAddEditFormBankDetails";
import CRMVendorAddEditFormPreview from "./CRMVendorAddEditFormPreview";
import { useNavigate, generatePath } from "react-router-dom";
import { useState } from "react";

function CRMVendorAddEdit(props) {
  let { id: routeId } = useParams();
  const [clientId, setClientId] = useState("");
  const id = routeId || clientId || "";
  const isEdit = !!routeId;

  const navigate = useNavigate();

  const [addMutation, addMutationResult] =
    nimbleX360CRMVendorApi.useAddCRMVendorMutation();

  const [updateMutation, updateMutationResult] =
    nimbleX360CRMVendorApi.useUpdateCRMVendorMutation();

  const { data } = nimbleX360CRMVendorApi.useGetCRMVendorQuery(id, {
    skip: !id,
  });

  const [addAddressMutation, addAddressMutationResult] =
    nimbleX360CRMVendorApi.useAddCRMVendorAddressMutation(
      { id },
      {
        skip: !id,
      }
    );

  const [updateAddressMutation, updateAddressMutationResult] =
    nimbleX360CRMVendorApi.useUpdateCRMVendorAddressMutation();

  const { data: addressData } =
    nimbleX360CRMVendorApi.useGetCRMVendorsAddressQuery(
      { id },
      {
        skip: !id,
      }
    );

  const [addBankMutation, addBankMutationResult] =
    nimbleX360CRMVendorApi.useAddCRMVendorBankMutation();

  const [updateBankMutation, updateBankMutationResult] =
    nimbleX360CRMVendorApi.useUpdateCRMVendorBankMutation();

  const { data: bankData } = nimbleX360CRMVendorApi.useGetCRMVendorsBankQuery(
    { id },
    {
      skip: !id,
    }
  );

  const { enqueueSnackbar } = useSnackbar();

  const ismd = useMediaQuery(MediaQueryBreakpointEnum.md);

  const { step, nextStep, prevStep, setStep } = useStep(0);

  const vendorPersonalInformationSchema = {
    fullname: Yup.string().required(),
    mobileNo: Yup.string().required(),
    ...(isEdit ? {} : { officeId: Yup.string().required() }),
    emailAddress: Yup.array(Yup.string().email().required()),
  };

  const clientBanksSchema = {
    bankId: Yup.string().required(),
    accountnumber: Yup.string().required(),
    accountname: Yup.string().required(),
  };

  const addressSchema = {
    stateProvinceId: Yup.string().required(),
    lgaId: Yup.string().required(),
    addressLine1: Yup.string().required(),
    nearestLandMark: Yup.string().required(),
    // residentStatusId: Yup.string().required(),
    // dateMovedIn: Yup.string().required(),
  };

  const formik = useFormik({
    initialValues: {
      mobileNo: data?.mobileNo || "",
      emailAddress: data?.emailAddress?.split(",") || [],
      fullname: data?.fullname || "",
      ...(isEdit ? {} : { officeId: data?.officeId || "" }),
      // dateFormat: "yyyy-MM-dd",
      // locale: dateLocaleFormat.LOCALE,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      ...vendorPersonalInformationSchema,
    }),
    onSubmit: async (values) => {
      try {
        let response;
        const newValue = removeEmptyProperties({
          ...values,
          emailAddress: values.emailAddress.toString(),
        });
        console.log("newValue", newValue);
        if (isEdit) {
          response = await updateMutation({
            id,
            ...newValue,
          }).unwrap();
        } else {
          response = await addMutation(newValue).unwrap();
        }

        if (response?.clientId) {
          !routeId && setClientId(response?.clientId);
          nextStep(1);
        }

        enqueueSnackbar(`Vendor ${isEdit ? "Update" : "creation"} Successful`, {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar(`Vendor ${isEdit ? "Update" : "creation"}  Failed`, {
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

  const clientBankformik = useFormik({
    initialValues: {
      ...(bankData?.[0]?.id ? { id: bankData?.[0]?.id } : {}),
      bankId: bankData?.[0]?.bank?.id || "",
      accountnumber: bankData?.[0]?.accountnumber || "",
      accountname: bankData?.[0]?.accountname || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      ...clientBanksSchema,
    }),
    onSubmit: async (values) => {
      try {
        let response;
        const newValue = removeEmptyProperties(values);

        if (isEdit && bankData?.length >= 1) {
          response = await updateBankMutation({
            vendorId: id,
            bankRouteId: bankData?.[0]?.id,
            ...newValue,
          }).unwrap();
        } else if (isEdit && bankData?.length === 0) {
          response = await addBankMutation({
            id,
            ...newValue,
          }).unwrap();
        } else {
          response = await addBankMutation({
            id,
            ...newValue,
          }).unwrap();
        }

        if (response) {
          nextStep(3);
        }

        enqueueSnackbar(
          `Vendor Bank ${isEdit ? "Update" : "creation"} Successful`,
          {
            variant: "success",
          }
        );
      } catch (error) {
        enqueueSnackbar(
          `Vendor Bank ${isEdit ? "Update" : "creation"}  Failed`,
          {
            variant: "error",
          }
        );
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

  const addressFormik = useFormik({
    initialValues: {
      ...(addressData?.[0]?.addressId
        ? { addressId: addressData?.[0]?.addressId }
        : {}),
      // residentStatusId: addressData?.[0]?.residentStatusId || "",
      addressTypeId: 36,
      addressLine1: addressData?.[0]?.addressLine1 || "",
      lgaId: addressData?.[0]?.lgaId || "",
      nearestLandMark: addressData?.[0]?.nearestLandMark || "",
      stateProvinceId: addressData?.[0]?.stateProvinceId || "",
      // dateMovedIn: parseDateToString(addressData?.[0]?.dateMovedIn) || "",
      countryId: 29,
      dateFormat: dateLocaleFormat.DATE_FORMAT,
      locale: dateLocaleFormat.LOCALE,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      ...addressSchema,
    }),
    onSubmit: async (values) => {
      try {
        let response;
        const newValue = removeEmptyProperties(values);

        if (isEdit && addressData?.length >= 1) {
          response = await updateAddressMutation({
            id,
            ...newValue,
          }).unwrap();
        } else if (isEdit && addressData?.length === 0) {
          response = await addAddressMutation({
            id,
            params: { type: 36 },
            ...newValue,
          }).unwrap();
        } else {
          response = await addAddressMutation({
            id,
            params: { type: 36 },
            ...newValue,
          }).unwrap();
        }

        if (response) {
          nextStep(2);
        }

        enqueueSnackbar(
          `Vendor Address ${isEdit ? "Update" : "creation"} Successful`,
          {
            variant: "success",
          }
        );
      } catch (error) {
        enqueueSnackbar(
          `Vendor Address ${isEdit ? "Update" : "creation"}  Failed`,
          {
            variant: "error",
          }
        );
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

  const contents = [
    {
      title: "Vendor Information",
      body: (
        <CRMVendorAddEditFormPersonalInformation
          formik={formik}
          isEdit={isEdit}
        />
      ),
    },
    {
      title: "Vendor Residential Address",
      body: (
        <CRMVendorAddEditFormResidentialInformation
          formik={addressFormik}
          isEdit={isEdit}
        />
      ),
    },
    {
      title: "Vendor Bank Information",
      body: (
        <CRMVendorAddEditFormBankDetails
          formik={clientBankformik}
          isEdit={isEdit}
        />
      ),
    },
    {
      title: "Preview",
      body: (
        <CRMVendorAddEditFormPreview
          data={data}
          addressData={addressData}
          bankData={bankData}
          isEdit={isEdit}
        />
      ),
    },
  ];

  const content = contents[step];
  const isFirstStep = step === 0;
  const isLastStep = step === contents.length - 1;

  const footer = (
    <div className="flex justify-end items-center gap-4 pb-20 mt-4">
      <Button
        variant="outlined"
        disabled={isFirstStep || !isEdit}
        onClick={prevStep}
      >
        Previous
      </Button>

      <LoadingButton
        disabled={
          isEdit
            ? updateMutationResult?.isLoading ||
              updateAddressMutationResult?.isLoading ||
              updateBankMutationResult?.isLoading
            : addMutationResult?.isLoading ||
              addAddressMutationResult?.isLoading ||
              addBankMutationResult?.isLoading
        }
        loading={
          isEdit
            ? updateMutationResult?.isLoading ||
              updateAddressMutationResult?.isLoading ||
              updateBankMutationResult?.isLoading
            : addMutationResult?.isLoading ||
              addAddressMutationResult?.isLoading ||
              addBankMutationResult?.isLoading
        }
        loadingPosition="end"
        endIcon={<></>}
        onClick={() => {
          if (step === 0) {
            formik.handleSubmit();
          } else if (step === 1) {
            addressFormik.handleSubmit();
          } else if (step === 2) {
            clientBankformik.handleSubmit();
          } else if (step === 3) {
            navigate(
              generatePath(RouteEnum.CRM_VENDOR_DETAILS, {
                id: routeId || clientId,
              })
            );
          } else {
            nextStep(step);
          }
        }}
      >
        {isLastStep ? "Submit" : step === 2 ? "preview" : "Next"}
      </LoadingButton>
    </div>
  );
  useScrollToTop(step);
  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        breadcrumbs={[
          { name: "CRM", to: RouteEnum.CRM_VENDOR },
          { name: "Vedor Details", to: `${RouteEnum.CRM_VENDOR}/${id}` },
          { name: `${isEdit ? "Edit" : "Create"} New Vendor` },
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
            <StepButton
              onClick={() => {
                isEdit && setStep(index);
              }}
            >
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

export default CRMVendorAddEdit;
