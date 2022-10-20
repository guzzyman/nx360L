import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { nimbleX360UserManagementApi } from "./UserManagementStoreQuerySlice";
import * as yup from "yup";
import useDataRef from "hooks/useDataRef";
import { useEffect, useMemo } from "react";
import PageHeader from "common/PageHeader";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import { Button, Checkbox, FormControlLabel, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useAuthUser from "hooks/useAuthUser";

function StaffManagementCreateEdit(props){
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();  
    const { id } = useParams();
    // const authUser = useAuthUser();  
    const isEdit = !!id;
  
    // const [updateRateProductMutation, updateRateProductMutationResult] =
    // nimbleX360UserManagementApi.useUpdateRateProductMutation();
    const staffDetails = nimbleX360UserManagementApi.useGetUserByIdQuery(id);
    const staffDetailsQueryResult = staffDetails?.data;
    console.log(staffDetailsQueryResult);

    return <>Here</>;
  
    // const formik = useFormik({
    //   initialValues: {
    //     holidayDate: "",
    //     dateFormat: "",
    //     locale: "en",
    //     isHoliday: false,
    //   },
    //   validateOnChange: false,
    //   validateOnBlur: false,
    //   validationSchema: yup.object({
    //     name: yup.string().trim().required(),
    //     productApply: yup.string().trim().required(),
    //     percentage: yup.string().trim().required(),
    //     active: yup.boolean().required(),
    //   }),
    //   onSubmit: async (values) => {
    //     try {
    //       const func = isEdit
    //         ? updateRateProductMutation
    //         : undefined;
    //       await func({ id, ...values }).unwrap();
    //       enqueueSnackbar("Staff Updated", { variant: "success" });
    //       navigate(-1);
    //     } catch (error) {
    //       enqueueSnackbar("Error Updating Staff Details", { variant: "error" });
    //     }
    //   },
    // });
  
    // const dataRef = useDataRef({ formik });
  
    // useEffect(() => {
    //   if (isEdit) {
    //     dataRef.current.formik.setValues({
    //       name: rateProduct?.name || "",
    //       productApply: rateProduct?.currencyOptions?.id || "",
    //       percentage: rateProduct?.percentage || "",
    //       locale: rateProduct?.locale || "en",
    //       active: rateProduct?.active || false,
    //     });
    //   }
    //   // eslint-disable-next-line
    // }, [
    //   dataRef,
    //   rateProduct?.name,
    //   rateProduct?.productApply,
    //   rateProduct?.percentage,
    //   rateProduct?.locale,
    //   rateProduct?.active,
    //   isEdit,
    // ]);
  
    // return (
    //   <>
    //     <PageHeader
    //       title={isEdit ? "Update Rate Product" : "Create Rate Product"}
    //       breadcrumbs={[
    //         { name: "Home", to: RouteEnum.DASHBOARD },
    //         { name: "Products", to: RouteEnum.ADMINISTRATION_RATES },
    //         { name: "Rates", to: RouteEnum.ADMINISTRATION_PRODUCTS_RATES },
    //         {
    //           name: isEdit ? "Update Rate" : "Create Charge",
    //         },
    //       ]}
    //     />
  
    //     <LoadingContent
    //     //   loading={rateProductQueryResult.isLoading}
    //     //   error={rateProductQueryResult.isError}
    //     //   onReload={rateProductQueryResult.refetch}
    //     >
    //       {() => (
    //         <form
    //           className="w-full flex justify-center"
    //           onSubmit={formik.handleSubmit}
    //         >
    //           <div className="max-w-full w-full">
    //             <Paper className="p-4 md:p-8 mb-4">
    //               <Typography variant="h6" className="font-bold">
    //                 Create Rate
    //               </Typography>
    //               <Typography
    //                 variant="body2"
    //                 color="textSecondary"
    //                 className="max-w-sm mb-4"
    //               >
    //                 Ensure you enter correct information.
    //               </Typography>
    //               <div className="max-w-3xl grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
    //                 <div className="col-span-2 grid gap-4 sm:grid-cols-2">
    //                   <TextField
    //                     fullWidth
    //                     label="Charges Name"
    //                     {...formik.getFieldProps("name")}
    //                     error={!!formik.touched.name && formik.errors.name}
    //                     helperText={!!formik.touched.name && formik.errors.name}
    //                   />
    //                   <TextField
    //                     fullWidth
    //                     label="Percentage"
    //                     {...formik.getFieldProps("percentage")}
    //                     error={
    //                       !!formik.touched.percentage && formik.errors.percentage
    //                     }
    //                     helperText={
    //                       !!formik.touched.percentage && formik.errors.percentage
    //                     }
    //                   />
    //                 </div>
    //                 <FormControlLabel
    //                   label="Available?"
    //                   className="col-span-2"
    //                   control={
    //                     <Checkbox
    //                       checked={formik.values?.isHoliday}
    //                       onChange={(event) => {
    //                         formik.setFieldValue("isHoliday", event.target.checked);
    //                       }}
    //                       value={formik.values?.isHoliday}
    //                     />
    //                   }
    //                 />
    //               </div>
    //             </Paper>
    //             <div className="flex items-center justify-end gap-4">
    //               <Button color="error" onClick={() => navigate(-1)}>
    //                 Cancel
    //               </Button>
    //               <LoadingButton
    //                 type="submit"
    //                 disabled={
    //                   updateRateProductMutationResult.isLoading
    //                 }
    //                 loading={
    //                   updateRateProductMutationResult.isLoading
    //                 }
    //                 loadingPosition="end"
    //                 endIcon={<></>}
    //               >
    //                 {isEdit ? "Update" : "Submit"}
    //               </LoadingButton>
    //             </div>
    //           </div>
    //         </form>
    //       )}
    //     </LoadingContent>
    //   </>
    // );
}

export default StaffManagementCreateEdit;