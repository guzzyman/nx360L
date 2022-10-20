import { Button, Paper, Typography, Icon, Grid } from "@mui/material";
import PageHeader from "common/PageHeader";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { nimbleX360ChartOfAccountApi } from "./ChartOfAccountStoreQuerySlice";
import { RouteEnum } from "common/Constants";
import LoadingContent from "common/LoadingContent";
import { useSnackbar } from "notistack";
import { useConfirmDialog } from "react-mui-confirm";

function GLAccountDetails(props) {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const confirm = useConfirmDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError, refetch } =
    nimbleX360ChartOfAccountApi.useGetGLAccountQuery(id);
  const [documentDelete] =
    nimbleX360ChartOfAccountApi.useDeleteGLAccountMutation();


  const handleGLAccountDelete = (id) =>
    confirm({
      title: "Are you sure you want to Delete Document?",
      onConfirm: async () => {
        try {
          await documentDelete(id).unwrap();
          enqueueSnackbar(`Document Deletion Successfully`, {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar(`Document Deletion Failed`, { variant: "error" });
        }
      },
      confirmButtonProps: {
        color: "warning",
      },
    });

  return (
    <>
      <PageHeader
        title="Manage GL Account"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Accounting", to: RouteEnum.ACCOUNTING },
          {
            name: "Manage GL Account",
          },
        ]}
      />
      <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
        {() => (
          <div className="w-full flex justify-center">
            <div className="max-w-3xl w-full">
              <div className="flex items-center justify-left gap-4 my-4">
                {data?.usage.value === "HEADER" ? (
                  <>
                    <Button
                      startIcon={<Icon>add</Icon>}
                      onClick={() =>
                        navigate(
                          generatePath(
                            RouteEnum.CHARTOFACCOUNTS_ADD_SUBLEDGER,{ id }
                          )
                        )
                      }
                    >
                      Subledger
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Icon>edit</Icon>}
                      onClick={() =>
                        navigate(
                          generatePath(RouteEnum.CHARTOFACCOUNTS_EDIT, { id })
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Icon>delete</Icon>}
                      onClick={() => handleGLAccountDelete(id)}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Icon>edit</Icon>}
                      onClick={() =>
                        navigate(
                          generatePath(RouteEnum.CHARTOFACCOUNTS_EDIT, { id })
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Icon>delete</Icon>}
                      onClick={() => handleGLAccountDelete(id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
              <Paper className="p-4 md:p-8 mb-4">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Account Name:
                    </Typography>
                    <Typography variant={"h6"}>{data?.name}</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Account Type:
                    </Typography>
                    <Typography variant={"h6"}>ASSET</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      GL Code:
                    </Typography>
                    <Typography variant={"h6"}>{data?.glCode}</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Account Usage:
                    </Typography>
                    <Typography variant={"h6"}>{data?.usage.value}</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Tag:
                    </Typography>
                    <Typography variant={"h6"}>{data?.tagId.name}</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="body2" color="textSecondary">
                      Description:
                    </Typography>
                    <Typography variant={"h6"}>{data?.description}</Typography>
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

export default GLAccountDetails;
