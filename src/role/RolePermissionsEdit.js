import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  List,
  ListItemButton,
  Grid,
  Chip,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360RoleApi } from "./RoleStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import RolePermissionsEditThreshold from "./RolePermissionsEditThreshold";
import useToggle from "hooks/useToggle";
import useDataRef from "hooks/useDataRef";
import SearchTextField from "common/SearchTextField";

function PermissionsCreateEdit(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  const [filterPermissionToken, setFilterPermissionToken] = useState("");

  const [selectedPermissionGroup, setSelectedPermissionGroup] = useState("");
  const [isEdit, toggleEdit] = useToggle();

  const [updatePermissionsMutation, updatePermissionsMutationResult] =
    nimbleX360RoleApi.useUpdateRolePermissionsMutation();

  const getPermission = nimbleX360RoleApi.useGetPermissionListQuery(id, {
    skip: !id,
  });

  const loanProductsData = getPermission?.data?.loanProductsData;
  const getPermissionData = getPermission?.data?.permissionUsageData;
  const getRolesByIdQuery = nimbleX360RoleApi.useGetRolesByIdQuery(id);
  const rolesByIdQueryResult = getRolesByIdQuery?.data;

  const {
    nomalizedPermissionGroups,
    permissionGroups,
    initialSelectedPermissions,
  } = useMemo(() => {
    const { nomalizedPermissionGroups, initialSelectedPermissions } =
      getPermissionData?.reduce(
        (acc, curr) => {
          acc.nomalizedPermissionGroups[curr.grouping] = [
            ...(acc.nomalizedPermissionGroups[curr.grouping] || []),
            curr,
          ];
          if (curr.selected) {
            acc.initialSelectedPermissions[curr.code] = true;
          }
          return acc;
        },
        { nomalizedPermissionGroups: {}, initialSelectedPermissions: {} }
      ) || {};

    return {
      nomalizedPermissionGroups,
      permissionGroups: Object.keys(nomalizedPermissionGroups || {}),
      initialSelectedPermissions,
    };
  }, [getPermissionData]);

  const { initialLoanProductPermissionsLeft, loanProductPermissionsRight } =
    useMemo(() => {
      return (
        loanProductsData?.reduce(
          (acc, curr) => {
            if (curr.selected) {
              acc.loanProductPermissionsRight.push(curr);
            } else {
              acc.initialLoanProductPermissionsLeft.push(curr);
            }
            return acc;
          },
          {
            initialLoanProductPermissionsLeft: [],
            loanProductPermissionsRight: [],
          }
        ) || {}
      );
    }, [loanProductsData]);

  const filteredPermissionGroups = permissionGroups?.filter(
    (group) =>
      nomalizedPermissionGroups?.[group]?.find((permission) => {
        return (
          permission?.code
            ?.toLocaleLowerCase()
            ?.includes(filterPermissionToken?.toLocaleLowerCase()) ||
          permission?.actionName
            ?.toLocaleLowerCase()
            ?.includes(filterPermissionToken?.toLocaleLowerCase()) ||
          permission?.entityName
            ?.toLocaleLowerCase()
            ?.includes(filterPermissionToken?.toLocaleLowerCase())
        );
      })
    // group.includes(filterPermissionToken)
  );

  const permissions = nomalizedPermissionGroups?.[selectedPermissionGroup];

  const filteredPermissions = permissions?.filter(
    (permission) =>
      permission?.code
        ?.toLocaleLowerCase()
        ?.includes(filterPermissionToken?.toLocaleLowerCase()) ||
      permission?.actionName
        ?.toLocaleLowerCase()
        ?.includes(filterPermissionToken?.toLocaleLowerCase()) ||
      permission?.entityName
        ?.toLocaleLowerCase()
        ?.includes(filterPermissionToken?.toLocaleLowerCase())
  );

  const formik = useFormik({
    initialValues: {
      loanProductPermissionsChecked: [],
      loanProductPermissionsLeft: [],
      loanProductPermissionsRight: [],
      permissions: {},
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({}),
    onSubmit: async (values) => {
      try {
        const data = await updatePermissionsMutation({
          id,
          permissions: values.permissions,
          loanProductPermissions: values.loanProductPermissionsRight.reduce(
            (acc, curr) => {
              acc[curr.shortName] = true;
              return acc;
            },
            {}
          ),
        }).unwrap();

        enqueueSnackbar("Role Permissions Updated", { variant: "success" });
        // navigate(-1);
      } catch (error) {
        enqueueSnackbar("Error Updating Permissions", { variant: "error" });
        enqueueSnackbar(
          error?.data?.errors?.length ? (
            <div>
              {error?.data?.errors?.map((error, key) => (
                <Typography key={key}>{error?.defaultUserMessage}</Typography>
              ))}
            </div>
          ) : (
            "Error Updating Permission Role"
          ),
          { variant: "error" }
        );
      }
    },
  });

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (id) {
      dataRef.current.formik.setValues({
        ...dataRef.current.formik.values,
        permissions: initialSelectedPermissions,
        loanProductPermissionsLeft: initialLoanProductPermissionsLeft,
        loanProductPermissionsRight: loanProductPermissionsRight,
      });
    }
  }, [
    dataRef,
    loanProductPermissionsRight,
    initialLoanProductPermissionsLeft,
    initialSelectedPermissions,
    id,
  ]);

  function renderSection(title, description, children) {
    return (
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold">
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className="max-w-sm mb-4"
        >
          {description}
        </Typography>
        {children}
      </Paper>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Role Permissions"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "System", to: RouteEnum.SYSTEM },
          { name: "Roles", to: RouteEnum.ROLES },
          {
            name: "Edit Permission",
          },
        ]}
      />

      <LoadingContent
        loading={getPermission.isLoading}
        error={getPermission.isError}
        onReload={getPermission.refetch}
      >
        {() => (
          <form onSubmit={formik.handleSubmit}>
            <Paper className="p-4 mb-4">
              <div className="flex justify-end items-center gap-2">
                <Button onClick={() => toggleEdit()}>
                  {isEdit ? "Cancel Edit" : "Edit"}
                </Button>
                <Button>Disable</Button>
                <Button color="error">Delete</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                <Grid>
                  <Typography variant="body2" color="textSecondary">
                    Name:
                  </Typography>
                  <Typography variant={"h6"}>
                    {rolesByIdQueryResult?.name}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="body2" color="textSecondary">
                    Description:
                  </Typography>
                  <Typography variant={"h6"}>
                    {rolesByIdQueryResult?.description}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="body2" color="textSecondary">
                    Status:
                  </Typography>
                  <Typography variant={"h6"}>
                    {rolesByIdQueryResult?.disabled}
                  </Typography>
                </Grid>
              </div>
            </Paper>

            {rolesByIdQueryResult?.underwriterType?.id > 0 &&
              renderSection(
                "Threshold Management",
                "Ensure you enter correct information.",
                <RolePermissionsEditThreshold
                  formik={formik}
                  loanProductsData={loanProductsData}
                  isEdit={isEdit}
                />
              )}
            {renderSection(
              "Permissions",
              "Select from the list of Permmissions below to assign a permission.",
              <>
                <div className="mb-4">
                  <SearchTextField
                    value={filterPermissionToken}
                    onChange={(e) => setFilterPermissionToken(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <div
                    className="bg-gray-100 p-4 mb-4 rounded-md overflow-y w-full"
                    style={{ maxWidth: 280 }}
                  >
                    {filteredPermissionGroups?.length ? (
                      <List>
                        {filteredPermissionGroups?.map((group, index) => {
                          return (
                            <>
                              <ListItemButton
                                key={group}
                                selected={selectedPermissionGroup === group}
                                onClick={() =>
                                  setSelectedPermissionGroup(group)
                                }
                              >
                                <ListItemText>
                                  {group.toUpperCase()}
                                </ListItemText>
                                <ListItemIcon>
                                  <Chip
                                    label={
                                      nomalizedPermissionGroups?.[
                                        group
                                      ]?.filter(
                                        (permission) =>
                                          !!formik.values.permissions?.[
                                            permission.code
                                          ]
                                      )?.length || 0
                                    }
                                    color="primary"
                                    className="ml-4"
                                    size="small"
                                  />
                                </ListItemIcon>
                              </ListItemButton>
                            </>
                          );
                        })}
                      </List>
                    ) : (
                      <Typography>No Search Result</Typography>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    {filteredPermissions?.map((permission) => (
                      <Tooltip
                        key={permission.code}
                        {...props}
                        className="ml-1 pointer-events-auto"
                        title={permission?.code}
                      >
                        <FormControlLabel
                          disabled={!isEdit}
                          label={
                            permission?.actionName && permission?.entityName
                              ? `${permission?.actionName} ${permission?.entityName}`
                              : permission?.code
                          }
                          control={
                            <Checkbox
                              checked={
                                !!formik.values.permissions[permission.code]
                              }
                              onChange={(e) => {
                                const newPermissions = {
                                  ...formik.values.permissions,
                                };
                                if (e.target.checked) {
                                  newPermissions[permission.code] = true;
                                } else {
                                  // delete newPermissions[permission.code];
                                  newPermissions[permission.code] = false;
                                }
                                formik.setFieldValue(
                                  `permissions`,
                                  newPermissions
                                );
                              }}
                            />
                          }
                        />
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center justify-end gap-4 mb-8">
              <Button color="error" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                disabled={updatePermissionsMutationResult.isLoading}
                loading={updatePermissionsMutationResult.isLoading}
                loadingPosition="end"
                endIcon={<></>}
              >
                Submit
              </LoadingButton>
            </div>
          </form>
        )}
      </LoadingContent>
    </>
  );
}

export default PermissionsCreateEdit;
