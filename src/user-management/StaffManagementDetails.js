import { nimbleX360UserManagementApi } from "./UserManagementStoreQuerySlice";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "common/PageHeader";
import { DateConfig, RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import { Checkbox, FormControlLabel, Grid, Paper, Typography } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import useDataRef from "hooks/useDataRef";
import { LoadingButton } from "@mui/lab";
import { format } from "date-fns";

function StaffManagementDetails(props) {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = nimbleX360UserManagementApi.useGetStaffByIdQuery(id, {
        skip: !id
    });

    const isEdit = !!id;
    const [updateStaffMutation, updateStaffMutationResult] = nimbleX360UserManagementApi.useUpdateStaffMutation();

    const formik = useFormik({
        initialValues: {
            holidayDate: `${format(new Date(), "dd-MMMM-yyyy")}`,
            dateFormat: `${DateConfig.FORMAT}`,
            locale: "en",
            isHoliday: false,
        },
        validateOnChange: false,
        validateOnBlur: false,
        validationSchema: yup.object({}),
        onSubmit: async (values) => {
            let availability = formik.values.isHoliday ? `available` : `unavailable`;
            delete values.isHoliday;
            try {
                const func = isEdit
                    ? updateStaffMutation
                    : undefined;
                await func({ id, availability, ...values }).unwrap();
                enqueueSnackbar("Staff Updated", { variant: "success" });
                navigate(-1);
            } catch (error) {
                enqueueSnackbar("Error Updating Staff Details", { variant: "error" });
            }
        },
    });

    const dataRef = useDataRef({ formik });

    useEffect(() => {
        if (isEdit) {
            dataRef.current.formik.setValues({
                isHoliday: !data?.isHoliday,
                holidayDate: format(new Date(), "dd-MMMM-yyyy"),
                locale: "en",
                dateFormat: `${DateConfig.FORMAT}`,
            });
        }
    }, [dataRef, isEdit, data?.isHoliday]);

    return (
        <>
            <PageHeader
                title="Staff Management"
                breadcrumbs={[
                    { name: "Home", to: RouteEnum.DASHBOARD },
                    { name: "Administration", to: RouteEnum.ADMINISTRATION_PRODUCTS },
                    { name: "Users", to: RouteEnum.USER },
                    {
                        name: "Manage Staff",
                    },
                ]}
            ></PageHeader>
            <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
                {() => (
                    <form
                        className="w-full flex justify-center"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="max-w-full flex justify-center">
                            <div className="w-full">
                                <Paper className="max-w-full p-4 md:p-8 mb-4">
                                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                                        <Grid>
                                            <Typography variant="body2" color="textSecondary">
                                                FirstName:
                                            </Typography>
                                            <Typography variant={"h6"}>{data?.firstname}</Typography>
                                        </Grid>
                                        <Grid>
                                            <Typography variant="body2" color="textSecondary">
                                                LastName:
                                            </Typography>
                                            <Typography variant={"h6"}>{data?.lastname}</Typography>
                                        </Grid>
                                        <Grid>
                                            <Typography variant="body2" color="textSecondary">
                                                Team Lead:
                                            </Typography>
                                            <Typography variant={"h6"}>{data?.organisationalRoleParentStaff?.displayName}</Typography>
                                        </Grid>
                                        <Grid>
                                            <Typography variant="body2" color="textSecondary">
                                                Mobile Number:
                                            </Typography>
                                            <Typography variant={"h6"}>{data?.mobileNo}</Typography>
                                        </Grid>
                                        <Grid>
                                            <Typography variant="body2" color="textSecondary">
                                                Availability:
                                            </Typography>
                                            <Typography variant={"h6"}>
                                                {!data?.isHoliday ? `Available` : `Not available`}
                                            </Typography>
                                        </Grid>
                                        <FormControlLabel
                                            label="Available?"
                                            className="col-span-2"
                                            control={
                                                <Checkbox
                                                    checked={formik.values?.isHoliday}
                                                    onChange={(event) => {
                                                        formik.setFieldValue("isHoliday", event.target.checked);
                                                    }}
                                                    value={formik.values?.isHoliday}
                                                />
                                            }
                                        />
                                    </div>
                                </Paper>
                                <div className="flex items-center justify-end gap-4">
                                    <LoadingButton
                                        type="submit"
                                        disabled={
                                            updateStaffMutationResult.isLoading
                                        }
                                        loading={
                                            updateStaffMutationResult.isLoading
                                        }
                                        loadingPosition="end"
                                        endIcon={<></>}
                                    >
                                        {"Update Staff"}
                                    </LoadingButton></div>
                            </div>
                        </div>
                    </form>
                )}
            </LoadingContent>
        </>
    );
}
export default StaffManagementDetails;