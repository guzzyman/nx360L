// import { useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  MenuItem,
  Typography,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360RoleApi } from "./RoleStoreQuerySlice";
import { useSnackbar } from "notistack";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import { useEffect } from "react";
import useDataRef from "hooks/useDataRef";
import { OfficerTypeEnum } from "./RoleConstants";

function RoleCreateEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const codeId = 62;
  const departmentCodeId = 63;
  const skipTracerCodeId = 65;
  const isEdit = !!id;
  const [addRoleMutation, addRoleMutationResult] =
    nimbleX360RoleApi.useAddRoleMutation();
  const [updateRoleMutation, updateRoleMutationResult] =
    nimbleX360RoleApi.useUpdateRoleMutation();
  const getCodeValues = nimbleX360RoleApi.useGetCodeValuesQuery(codeId);
  const getCodeValuesForDepartment =
    nimbleX360RoleApi.useGetCodeValuesQuery(departmentCodeId);
  const getCodeValuesForSkipTracers =
    nimbleX360RoleApi.useGetCodeValuesQuery(skipTracerCodeId);
  const getCodeValuesForDepartmentOptions = getCodeValuesForDepartment?.data;
  const codeValuesOptions = getCodeValues?.data;
  const codeValuesCollectionOptions = getCodeValuesForSkipTracers?.data;
  const getRolesByIdQuery = nimbleX360RoleApi.useGetRolesByIdQuery(id, {
    skip: !isEdit,
  });
  const rolesByIdQueryResult = getRolesByIdQuery?.data;

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      departmentId: "",
      locale: "en",

      underwriterTypeId: "",
      maxAmount: "",
      officer: "",
      collectionOfficerValueId: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      name: yup.string().trim().required(),
      description: yup.string().trim().required(),
      departmentId: yup.string().trim().required(),
      // officer: yup.string().required(),
    }),
    onSubmit: async ({ officer, ...values }) => {
      const _values = {
        ...values,
        loanOfficer: officer === OfficerTypeEnum.LOAN,
        collectionOfficer: officer === OfficerTypeEnum.COLLECTION,
        telesalesOfficer: officer === OfficerTypeEnum.TELESALES,
        underWriterOfficer: officer === OfficerTypeEnum.UNDERWRITER,
      };
      if (_values.loanOfficer) {
        delete _values.maxAmount;
        delete _values.underwriterTypeId;
        delete _values.collectionOfficerValueId;
        delete _values.underWriterOfficer;
      } else if (_values.underWriterOfficer) {
        delete _values.underWriterOfficer;
        delete _values.collectionOfficerValueId;
        delete _values.telesalesOfficer;
        delete _values.loanOfficer;
      } else if (_values.telesalesOfficer) {
        delete _values.maxAmount;
        delete _values.underwriterTypeId;
        delete _values.underWriterOfficer;
        delete _values.collectionOfficerValueId;
      } else if (_values.collectionOfficer) {
        delete _values.maxAmount;
        delete _values.underwriterTypeId;
        delete _values.underWriterOfficer;
      } else {
        delete _values.underwriterTypeId;
        delete _values.underWriterOfficer;
        delete _values.collectionOfficerValueId;
        delete _values.maxAmount;
      }
      try {
        const func = isEdit ? updateRoleMutation : addRoleMutation;
        const data = await func({ id, ..._values }).unwrap();
        enqueueSnackbar("Role Created", { variant: "success" });
        navigate(
          generatePath(RouteEnum.ROLES_PERMISSIONS_ADD, { id: data.resourceId })
        );
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.length ? (
            <div>
              {error?.data?.errors?.map((error, key) => (
                <Typography key={key}>{error?.defaultUserMessage}</Typography>
              ))}
            </div>
          ) : isEdit ? (
            <>
              <div>
                {error?.data?.errors?.map((error, key) => (
                  <Typography key={key}>{error?.defaultUserMessage}</Typography>
                ))}
              </div>
            </>
          ) : (
            <>
              <div>
                {error?.data?.errors?.map((error, key) => (
                  <Typography key={key}>{error?.defaultUserMessage}</Typography>
                ))}
              </div>
            </>
          ),
          { variant: "error" }
        );
      }
    },
  });

  const isLoanOfficer = formik.values.officer === OfficerTypeEnum.LOAN;
  const isCollectionOfficer =
    formik.values.officer === OfficerTypeEnum.COLLECTION;
  const isTelesalesOfficer =
    formik.values.officer === OfficerTypeEnum.TELESALES;
  const isUnderWriterOfficer =
    formik.values.officer === OfficerTypeEnum.UNDERWRITER;

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (isEdit) {
      dataRef.current.formik.setValues({
        name: rolesByIdQueryResult?.name || "",
        description: rolesByIdQueryResult?.description || "",
        maxAmount: rolesByIdQueryResult?.maxAmount || "",
        underwriterTypeId: rolesByIdQueryResult?.underwriterType?.id || "",
        locale: rolesByIdQueryResult?.locale || "en",
        departmentId: rolesByIdQueryResult?.department?.id || "",
        officer: rolesByIdQueryResult?.loanOfficer
          ? OfficerTypeEnum.LOAN
          : rolesByIdQueryResult?.collectionOfficer
          ? OfficerTypeEnum.COLLECTION
          : rolesByIdQueryResult?.telesalesOfficer
          ? OfficerTypeEnum.TELESALES
          : rolesByIdQueryResult?.underwriterType?.id > 0
          ? OfficerTypeEnum.UNDERWRITER
          : "",
      });
    }
  }, [
    dataRef,
    isEdit,
    rolesByIdQueryResult?.collectionOfficer,
    rolesByIdQueryResult?.department?.id,
    rolesByIdQueryResult?.description,
    rolesByIdQueryResult?.loanOfficer,
    rolesByIdQueryResult?.locale,
    rolesByIdQueryResult?.maxAmount,
    rolesByIdQueryResult?.name,
    rolesByIdQueryResult?.telesalesOfficer,
    rolesByIdQueryResult?.underwriterType?.id,
  ]);
  return (
    <>
      <PageHeader
        title={isEdit ? "Update Role" : "Create Role"}
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "System", to: RouteEnum.SYSTEM },
          { name: "Roles", to: RouteEnum.ROLES },
          {
            name: isEdit ? "Update Role" : "Create Role",
          },
        ]}
      >
        {isEdit ? (
          <Button
            onClick={() =>
              navigate(generatePath(RouteEnum.ROLES_PERMISSIONS_ADD, { id }))
            }
          >
            Edit Permissions
          </Button>
        ) : undefined}
      </PageHeader>
      <LoadingContent
        loading={getCodeValues.isLoading}
        error={getCodeValues.isError}
        onReload={getCodeValues.refetch}
      >
        {() => (
          <form
            className="w-full flex justify-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="max-w-full w-full">
              <Paper className="p-4 md:p-8 mb-4">
                <Typography variant="h6" className="font-bold">
                  {isEdit ? "Update Role" : "Create Role"}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Ensure you enter correct information.
                </Typography>
                <div className="max-w-3xl grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <div className="col-span-2 grid gap-4 sm:grid-cols-2">
                    <TextField
                      fullWidth
                      label="Role Name"
                      {...formik.getFieldProps("name")}
                      error={!!formik.touched.name && formik.errors.name}
                      helperText={!!formik.touched.name && formik.errors.name}
                    />
                    <TextField
                      fullWidth
                      label="Role Description"
                      {...formik.getFieldProps("description")}
                      error={
                        !!formik.touched.description &&
                        formik.errors.description
                      }
                      helperText={
                        !!formik.touched.description &&
                        formik.errors.description
                      }
                    />
                  </div>
                  <TextField
                    fullWidth
                    label="Department"
                    className="col-span-2"
                    select
                    {...formik.getFieldProps("departmentId")}
                    error={
                      !!formik.touched.departmentId &&
                      formik.errors.departmentId
                    }
                    helperText={
                      !!formik.touched.departmentId &&
                      formik.errors.departmentId
                    }
                  >
                    {getCodeValuesForDepartmentOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <div className="col-span-2 grid gap-4 sm:grid-cols-2">
                    <FormControl>
                      <FormLabel id="role-selection-radio-buttons-group-label">
                        Select officer category
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="role-selection-radio-buttons-group-label"
                        name="radio-buttons-group"
                        {...formik.getFieldProps("officer")}
                      >
                        {[
                          {
                            label: "Collection Officer",
                            value: OfficerTypeEnum.COLLECTION,
                          },
                          {
                            label: "Underwriter Officer",
                            value: OfficerTypeEnum.UNDERWRITER,
                          },
                          {
                            label: "Loan Officer",
                            value: OfficerTypeEnum.LOAN,
                          },
                          {
                            label: "Tele-sales Officer",
                            value: OfficerTypeEnum.TELESALES,
                          },
                        ].map((config, index) => {
                          return (
                            <FormControlLabel
                              key={index}
                              control={
                                <Radio
                                  value={config.value}
                                  onClick={(e) => {
                                    if (
                                      config.value === formik.values.officer
                                    ) {
                                      formik.setFieldValue("officer", "");
                                    }
                                  }}
                                />
                              }
                              label={config.label}
                            />
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  </div>
                  {isUnderWriterOfficer ? (
                    <>
                      <TextField
                        fullWidth
                        label="Loan Underwriter Type"
                        className="col-span-2"
                        select
                        {...formik.getFieldProps("underwriterTypeId")}
                        error={
                          !!formik.touched.underwriterTypeId &&
                          formik.errors.underwriterTypeId
                        }
                        helperText={
                          !!formik.touched.underwriterTypeId &&
                          formik.errors.underwriterTypeId
                        }
                      >
                        {codeValuesOptions?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth
                        className="col-span-2"
                        label="Maximum Amount"
                        {...formik.getFieldProps("maxAmount")}
                        error={
                          !!formik.touched.maxAmount && formik.errors.maxAmount
                        }
                        helperText={
                          !!formik.touched.maxAmount && formik.errors.maxAmount
                        }
                      />
                    </>
                  ) : (
                    false
                  )}
                  {isCollectionOfficer ? (
                    <>
                      <TextField
                        fullWidth
                        label="Skip Tracer Type"
                        className="col-span-2"
                        select
                        {...formik.getFieldProps("collectionOfficerValueId")}
                        error={
                          !!formik.touched.collectionOfficerValueId &&
                          formik.errors.collectionOfficerValueId
                        }
                        helperText={
                          !!formik.touched.collectionOfficerValueId &&
                          formik.errors.collectionOfficerValueId
                        }
                      >
                        {codeValuesCollectionOptions?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.description}
                          </MenuItem>
                        ))}
                      </TextField>
                    </>
                  ) : (
                    false
                  )}
                </div>
              </Paper>
              <div className="flex items-center justify-end gap-4">
                <Button color="error" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  disabled={
                    addRoleMutationResult.isLoading ||
                    updateRoleMutationResult.isLoading
                  }
                  loading={
                    addRoleMutationResult.isLoading ||
                    updateRoleMutationResult.isLoading
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

export default RoleCreateEdit;
