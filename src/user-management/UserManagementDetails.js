import { Button, Paper, Typography, Icon, Grid } from "@mui/material";
import PageHeader from "common/PageHeader";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { nimbleX360UserManagementApi } from "./UserManagementStoreQuerySlice";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function UserManagementDetails(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } =
    nimbleX360UserManagementApi.useGetUserByIdQuery(id);

  return (
    <>
      <PageHeader
        title="User Management"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Administration", to: RouteEnum.ADMINISTRATION_PRODUCTS },
          { name: "Users", to: RouteEnum.USER },
          {
            name: "Manage User",
          },
        ]}
      ></PageHeader>
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <div className="max-w-full flex justify-center">
            <div className="w-full">
              <div className="flex items-center justify-end gap-4 my-4">
                <AuthUserUIPermissionRestrictor
                  permissions={[UIPermissionEnum.UPDATE_USER]}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Icon>edit</Icon>}
                    onClick={() =>
                      navigate(generatePath(RouteEnum.USER_EDIT, { id }))
                    }
                  >
                    Edit
                  </Button>
                </AuthUserUIPermissionRestrictor>
                <AuthUserUIPermissionRestrictor
                  permissions={[UIPermissionEnum.DELETE_USER]}
                >
                  <Button color="error" startIcon={<Icon>delete</Icon>}>
                    Delete
                  </Button>
                </AuthUserUIPermissionRestrictor>
              </div>
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
                      UserName:
                    </Typography>
                    <Typography variant={"h6"}>{data?.username}</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Email:
                    </Typography>
                    <Typography variant={"h6"}>{data?.email}</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      UserRole(s):
                    </Typography>
                    <Typography variant={"h6"}>
                      {data?.selectedRoles?.map((item, index) => {
                        return item?.name;
                      })}
                    </Typography>
                  </Grid>
                </div>
              </Paper>
            </div>
          </div>
        )}
      </LoadingContent>
    </>
  );
}

export default UserManagementDetails;
