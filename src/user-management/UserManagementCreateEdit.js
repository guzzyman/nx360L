import { useEffect, useMemo, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  MenuItem,
  Typography,
  Autocomplete,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360UserManagementApi } from "./UserManagementStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";
import BackButton from "common/BackButton";
import { getTextFieldFormikProps } from "common/Utils";

function UserManagementCreateEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  // const departmentCodeId = 63;
  const isEdit = !!id;

  const userQueryResult = nimbleX360UserManagementApi.useGetUserByIdQuery(id, {
    skip: !isEdit,
  });

  const user = userQueryResult.data;
  const staffId = user?.staff?.id;

  const getUserRoles = nimbleX360UserManagementApi.useGetRolesQuery();

  const getUserRolesOptions = getUserRoles?.data || [];

  const getOffices = nimbleX360UserManagementApi.useGetOfficesQuery();

  const getOfficesOptions = getOffices?.data || [];

  const staffsQueryResult = nimbleX360UserManagementApi.useGetStaffsQuery();

  const getStaffOptions = staffsQueryResult?.data;

  const [autoCompleteValue, setAutoCompleteValue] = useState(
    getStaffOptions?.[0]
  );
  const [inputValue, setInputValue] = useState("");
  const [q, setQ] = useState("");

  const [addUserMutation, addUserMutationResult] =
    nimbleX360UserManagementApi.useAddUserMutation();

  const [updateUserMutation, updateUserMutationResult] =
    nimbleX360UserManagementApi.useUpdateUserMutation();

  const [updateUserRolesMutation, updateUserRolesMutationResult] =
    nimbleX360UserManagementApi.useUpdateUserRolesMutation();

  const [updateUserSupervisorMutation, updateUserSupervisorMutationResult] =
    nimbleX360UserManagementApi.useUpdateUserSupervisorMutation();

  const formik = useFormik({
    initialValues: {
      organisationalRoleParentStaffId: "",
      organizationUnitId: "",
      officeId: "",
      email: "",
      firstname: "",
      lastname: "",
      isLoanOfficer: true,
      collectionOfficer: true,
      isHoliday: true,
      mobileNo: "",
      isActive: true,
      underwriterValueId: "",
      agentCode: "",
      roles: [],
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      agentCode: yup.string().trim().required(),
      firstname: yup.string().trim().required(),
      lastname: yup.string().trim().required(),
      email: yup.string().trim().required(),
      mobileNo: yup.string().trim().required(),
      officeId: yup.string().trim().required(),
    }),
    onSubmit: async (values) => {
      const _values = { ...values };
      if (_values.collectionOfficer || !_values.underwriterValueId) {
        delete _values.underwriterValueId;
      }

      if (isEdit) {
        delete _values.email;
        delete _values.isLoanOfficer;
        delete _values.isHoliday;
        delete _values.isActive;
        // delete _values.organisationalRoleParentStaffId;
        delete _values.organizationUnitId;
        delete _values.officeId;
        delete _values.underwriterValueId;
        delete _values.collectionOfficer;
        delete _values.underwriterValueId;
        // delete _values.roles;
      }
      try {
        const func = isEdit ? updateUserMutation : addUserMutation;
        await func({ id, ..._values }).unwrap();
        enqueueSnackbar(isEdit ? "User Updated" : "User Created", {
          variant: "success",
        });
        navigate(-1);
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.length ? (
            <div>
              {error?.data?.errors?.map((error, key) => (
                <Typography key={key}>{error?.defaultUserMessage}</Typography>
              ))}
            </div>
          ) : isEdit ? (
            "Error Updating User"
          ) : (
            "Error Creating User"
          ),
          { variant: "error" }
        );
      }
    },
  });

  const rolesFormik = useFormik({
    initialValues: {
      roles: [],
    },
    validationSchema: yup.object({
      roles: yup.array().label("Roles").required(),
    }),
    onSubmit: async (values) => {
      try {
        const data = await updateUserRolesMutation({
          userId: id,
          staffId,
          ...values,
        }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage || "User roles successfully updated",
          { variant: "success" }
        );
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.[0]?.defaultUserMessage ||
            "Failed to update user roles",
          { variant: "error" }
        );
      }
    },
  });

  const supervisorFormik = useFormik({
    initialValues: {
      organisationalRoleParentStaffId: "",
    },
    validationSchema: yup.object({
      organisationalRoleParentStaffId: yup
        .string()
        .label("Supervisor")
        .required(),
    }),
    onSubmit: async (values) => {
      try {
        const data = await updateUserSupervisorMutation({
          staffId,
          ...values,
        }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage || "User supervisor successfully updated",
          { variant: "success" }
        );
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.[0]?.defaultUserMessage ||
            "Failed to update user supervisor",
          { variant: "error" }
        );
      }
    },
  });

  const selectedRoleByIdQueryResult =
    nimbleX360UserManagementApi.useGetRolesByIdQuery(
      (isEdit ? rolesFormik : formik).values?.roles?.[0],
      {
        skip: !(isEdit ? rolesFormik : formik).values?.roles?.[0],
      }
    );

  const selectedRoleById = selectedRoleByIdQueryResult?.data;

  const telesalesOfficer = selectedRoleById?.telesalesOfficer;
  const loanOfficer = selectedRoleById?.loanOfficer;
  const collectionOfficer = selectedRoleById?.collectionOfficer;
  const underwriterOfficer = selectedRoleById?.underwriterType?.id;
  const underwriterOfficerBoolean = underwriterOfficer > 0 ? true : false;

  const staffRoleIndex = [
    telesalesOfficer,
    loanOfficer,
    collectionOfficer,
    underwriterOfficerBoolean,
  ];

  const normalizedStaffOptions = useMemo(
    () =>
      getStaffOptions?.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {}) || {},
    [getStaffOptions]
  );

  const dataRef = useDataRef({ formik, supervisorFormik, rolesFormik });

  useEffect(() => {
    if (isEdit) {
      const values = dataRef.current.formik.values;
      dataRef.current.formik.setValues({
        ...values,
        organisationalRoleParentStaffId:
          user?.staff?.organisationalRoleParentStaff?.id ||
          values.organisationalRoleParentStaffId,
        organizationUnitId:
          user?.organizationUnit?.id || values.organizationUnitId,
        officeId: user?.officeId || values.officeId,
        email: user?.email,
        firstname: user?.firstname,
        lastname: user?.lastname,
        isLoanOfficer: user?.loanOfficer,
        collectionOfficer: user?.staff?.collectionOfficer,
        isHoliday: values.isHoliday,
        mobileNo: user?.staff?.mobileNo,
        isActive: user?.staff?.isActive,
        underwriterValueId:
          user?.staff?.underwriterValue?.id || values.underwriterValueId,
        agentCode: user?.staff?.agentCode,
        roles: user?.selectedRoles?.map((item, index) => {
          return item?.id;
        }),
      });

      dataRef.current.rolesFormik.setValues({
        ...dataRef.current.rolesFormik.values,
        roles: user?.selectedRoles?.map((item, index) => {
          return item?.id;
        }) || [""],
      });

      dataRef.current.supervisorFormik.setValues({
        ...dataRef.current.supervisorFormik.values,
        organisationalRoleParentStaffId:
          user?.staff?.organisationalRoleParentStaff?.id ||
          values.organisationalRoleParentStaffId,
      });
    }
  }, [dataRef, isEdit, user]);

  useEffect(() => {
    if (selectedRoleById) {
      dataRef.current.formik.setValues({
        ...dataRef.current.formik.values,
        organizationUnitId: selectedRoleById?.department?.id,
        isLoanOfficer: selectedRoleById?.loanOfficer,
        collectionOfficer: selectedRoleById?.collectionOfficer,
        underwriterValueId: selectedRoleById?.underwriterType?.id,
      });
    }
  }, [dataRef, selectedRoleById]);

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton />}
        title="User Management"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Administration", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          { name: "Users", to: RouteEnum.USER },
          {
            name: isEdit ? "Update User" : "Create User",
          },
        ]}
      ></PageHeader>

      <LoadingContent
        loading={getUserRoles.isLoading}
        error={getUserRoles.isError}
        onReload={getUserRoles.refetch}
      >
        {() => (
          <form
            className="w-full flex justify-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="max-w-full w-full">
              <Paper className="p-4 md:p-4 mb-4">
                <Typography variant="h6" className="font-bold">
                  Bio Data
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Ensure you enter correct information.
                </Typography>
                <div
                  className="grid gap-4 sm:grid-cols-2"
                  style={{ maxWidth: 500 }}
                >
                  <TextField
                    fullWidth
                    label="Agent Code"
                    disabled={isEdit}
                    {...getTextFieldFormikProps(formik, "agentCode")}
                    InputProps={{ readOnly: isEdit }}
                  />
                  <TextField
                    fullWidth
                    disabled={isEdit}
                    label="First Name"
                    {...getTextFieldFormikProps(formik, "firstname")}
                    InputProps={{ readOnly: isEdit }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    disabled={isEdit}
                    {...getTextFieldFormikProps(formik, "lastname")}
                    InputProps={{ readOnly: isEdit }}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    disabled={isEdit}
                    {...getTextFieldFormikProps(formik, "email")}
                    InputProps={{ readOnly: isEdit }}
                  />
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    disabled={isEdit}
                    {...getTextFieldFormikProps(formik, "mobileNo")}
                    InputProps={{ readOnly: isEdit }}
                  />
                </div>
              </Paper>

              <Paper className="p-4 md:p-4 mb-4">
                <Typography variant="h6" className="font-bold">
                  Office
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Ensure you enter correct information.
                </Typography>
                <div
                  className="grid gap-4 sm:grid-cols-3"
                  style={{ maxWidth: 750 }}
                >
                  <TextField
                    fullWidth
                    label="Branch/Offices"
                    disabled={isEdit}
                    select
                    {...formik.getFieldProps("officeId")}
                    error={!!formik.touched.officeId && formik.errors.officeId}
                    helperText={
                      !!formik.touched.officeId && formik.errors.officeId
                    }
                  >
                    {getOfficesOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Role"
                    // disabled={isEdit}
                    select
                    {...getTextFieldFormikProps(
                      isEdit ? rolesFormik : formik,
                      "roles.0"
                    )}
                  >
                    {getUserRolesOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  {isEdit && (
                    <div className="flex items-center justify-center sm:justify-start">
                      <LoadingButton
                        disabled={updateUserRolesMutationResult.isLoading}
                        loading={updateUserRolesMutationResult.isLoading}
                        loadingPosition="end"
                        endIcon={<></>}
                        onClick={rolesFormik.handleSubmit}
                      >
                        Update
                      </LoadingButton>
                    </div>
                  )}
                </div>
              </Paper>

              <Paper className="p-4 md:p-4 mb-4">
                <Typography variant="h6" className="font-bold">
                  Supervisor
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Ensure you enter correct information.
                </Typography>
                <div
                  className="grid gap-4 sm:grid-cols-2"
                  style={{ maxWidth: 500 }}
                >
                  {/* <TextField
                      fullWidth
                      label="Supervisor Agent Code"
                      disabled={isEdit}
                      select
                      {...formik.getFieldProps(
                        "organisationalRoleParentStaffId"
                      )}
                      error={
                        !!formik.touched.organisationalRoleParentStaffId &&
                        formik.errors.organisationalRoleParentStaffId
                      }
                      helperText={
                        !!formik.touched.organisationalRoleParentStaffId &&
                        formik.errors.organisationalRoleParentStaffId
                      }
                    >
                      {getStaffOptions?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.displayName} ({option.officeName})
                        </MenuItem>
                      ))}
                    </TextField> */}
                  <Autocomplete
                    fullWidth
                    loading={staffsQueryResult.isFetching}
                    freeSolo
                    options={getStaffOptions || []}
                    // disabled={isEdit}
                    // filterOptions={(options) => options}
                    getOptionLabel={(option) =>
                      option?.displayName
                        ? option?.displayName
                        : normalizedStaffOptions?.[option]?.displayName || ""
                    }
                    // renderOption={(props, option, { selected }) => (
                    //   <li {...props} key={option.id}>
                    //     <ListItemText
                    //       primary={`(${option.id}) ${option.displayName}`}
                    //       secondary={`${option.bvn}-${option.mobileNo}`}
                    //     />
                    //   </li>
                    // )}
                    isOptionEqualToValue={(option, value) => {
                      return option.id === value;
                    }}
                    // inputValue={q}
                    // onInputChange={(_, value) => setQ(value)}
                    value={
                      (isEdit ? supervisorFormik : formik).values
                        .organisationalRoleParentStaffId
                    }
                    onChange={(_, value) => {
                      (isEdit ? supervisorFormik : formik).setFieldValue(
                        "organisationalRoleParentStaffId",
                        value?.id
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        label="Supervisor Name"
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {staffsQueryResult.isFetching ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  {isEdit && (
                    <div className="flex items-center justify-center sm:justify-start">
                      <LoadingButton
                        disabled={updateUserSupervisorMutationResult.isLoading}
                        loading={updateUserSupervisorMutationResult.isLoading}
                        loadingPosition="end"
                        endIcon={<></>}
                        onClick={supervisorFormik.handleSubmit}
                      >
                        Update
                      </LoadingButton>
                    </div>
                  )}
                </div>
              </Paper>

              {!isEdit && (
                <div className="flex items-center justify-end gap-4">
                  <Button color="error" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    disabled={
                      addUserMutationResult.isLoading ||
                      updateUserMutationResult.isLoading
                    }
                    loading={
                      addUserMutationResult.isLoading ||
                      updateUserMutationResult.isLoading
                    }
                    loadingPosition="end"
                    endIcon={<></>}
                  >
                    {isEdit ? "Update" : "Submit"}
                  </LoadingButton>
                </div>
              )}
            </div>
          </form>
        )}
      </LoadingContent>
    </>
  );
}

export default UserManagementCreateEdit;
