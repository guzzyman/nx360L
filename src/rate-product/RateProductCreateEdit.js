import { useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  MenuItem,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360RateProductApi } from "./RateProductStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";

function RateProductCreateEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = !!id;

  const [addRateProductMutation, addRateProductMutationResult] =
    nimbleX360RateProductApi.useAddRateProductMutation();

  const [updateRateProductMutation, updateRateProductMutationResult] =
    nimbleX360RateProductApi.useUpdateRateProductMutation();

  const rateProductTemplatesQueryResult =
    nimbleX360RateProductApi.useGetRateProductTemplateQuery();

  const rateProductQueryResult =
    nimbleX360RateProductApi.useGetRateProductByIdQuery(id, {
      skip: !isEdit,
    });

  const rateProduct = rateProductQueryResult.data;
  const options = rateProductTemplatesQueryResult.data;
  const rateAppliesToOptions = options?.chargeAppliesToOptions || [];

  const formik = useFormik({
    initialValues: {
      name: "",
      productApply: "",
      percentage: "",
      locale: "en",
      active: false,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      name: yup.string().trim().required(),
      productApply: yup.string().trim().required(),
      percentage: yup.string().trim().required(),
      active: yup.boolean().required(),
    }),
    onSubmit: async (values) => {
      try {
        const func = isEdit
          ? updateRateProductMutation
          : addRateProductMutation;
        await func({ id, ...values }).unwrap();
        enqueueSnackbar("Charge Created", { variant: "success" });
        navigate(-1);
      } catch (error) {
        enqueueSnackbar((
          <div>
            {error?.data?.errors?.map((error, key) => (
              <Typography key={key}>{error?.defaultUserMessage}</Typography>
            ))}
          </div>
        ), { variant: "error" });
      }
    },
  });

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (isEdit) {
      dataRef.current.formik.setValues({
        name: rateProduct?.name || "",
        productApply: rateProduct?.currencyOptions?.id || "",
        percentage: rateProduct?.percentage || "",
        locale: rateProduct?.locale || "en",
        active: rateProduct?.active || false,
      });
    }
    // eslint-disable-next-line
  }, [
    dataRef,
    rateProduct?.name,
    rateProduct?.productApply,
    rateProduct?.percentage,
    rateProduct?.locale,
    rateProduct?.active,
    isEdit,
  ]);

  return (
    <>
      <PageHeader
        title={isEdit ? "Update Rate Product" : "Create Rate Product"}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Products", to: RouteEnum.ADMINISTRATION_RATES },
          { name: "Rates", to: RouteEnum.ADMINISTRATION_PRODUCTS_RATES },
          {
            name: isEdit ? "Update Rate" : "Create Charge",
          },
        ]}
      />

      <LoadingContent
        loading={rateProductQueryResult.isLoading}
        error={rateProductQueryResult.isError}
        onReload={rateProductQueryResult.refetch}
      >
        {() => (
          <form
            className="w-full flex justify-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="max-w-full w-full">
              <Paper className="p-4 md:p-8 mb-4">
                <Typography variant="h6" className="font-bold">
                  Create Rate
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Ensure you enter correct information.
                </Typography>
                <div className="max-w-3xl grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <TextField
                    fullWidth
                    label="Charges Applies To"
                    className="col-span-2"
                    select
                    {...formik.getFieldProps("productApply")}
                    error={
                      !!formik.touched.productApply &&
                      formik.errors.productApply
                    }
                    helperText={
                      !!formik.touched.productApply &&
                      formik.errors.productApply
                    }
                  >
                    {rateAppliesToOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value === "Loan" ? option.value : undefined}
                      </MenuItem>
                    ))}
                  </TextField>
                  <div className="col-span-2 grid gap-4 sm:grid-cols-2">
                    <TextField
                      fullWidth
                      label="Charges Name"
                      {...formik.getFieldProps("name")}
                      error={!!formik.touched.name && formik.errors.name}
                      helperText={!!formik.touched.name && formik.errors.name}
                    />
                    <TextField
                      fullWidth
                      label="Percentage"
                      {...formik.getFieldProps("percentage")}
                      error={
                        !!formik.touched.percentage && formik.errors.percentage
                      }
                      helperText={
                        !!formik.touched.percentage && formik.errors.percentage
                      }
                    />
                  </div>
                  <FormControlLabel
                    label="Active"
                    className="col-span-2"
                    control={
                      <Checkbox
                        checked={formik.values?.active}
                        onChange={(event) => {
                          formik.setFieldValue("active", event.target.checked);
                        }}
                        value={formik.values?.active}
                      />
                    }
                  />
                </div>
              </Paper>
              <div className="flex items-center justify-end gap-4">
                <Button color="error" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  disabled={
                    addRateProductMutationResult.isLoading ||
                    updateRateProductMutationResult.isLoading
                  }
                  loading={
                    addRateProductMutationResult.isLoading ||
                    updateRateProductMutationResult.isLoading
                  }
                  loadingPosition="end"
                  endIcon={<></>}
                >
                  {isEdit ? "Update" : "Submit"}
                </LoadingButton>
              </div>
            </div>
          </form>
        )}
      </LoadingContent>
    </>
  );
}

export default RateProductCreateEdit;
