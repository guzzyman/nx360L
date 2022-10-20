import { Icon, Fab, Paper, Typography, CircularProgress } from "@mui/material";
import { RouteEnum } from "common/Constants";
import { useNavigate, generatePath } from "react-router-dom";
import { nimbleX360AdminSystemSurveyApi } from "./SystemSurveyQuerySlice";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import clsx from "clsx";

function SystemSurveyListItem({ item }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isActive = useMemo(
    () => Date.now() > item?.validFrom && Date.now() < item?.validTo,
    [item?.validFrom, item?.validTo]
  );

  const [updateSurveyStatusMutation, updateSurveyStatusMutationResult] =
    nimbleX360AdminSystemSurveyApi.useUpdateSurveyStatusMutation();

  async function handleSurveyStatusUpdate() {
    try {
      const data = await updateSurveyStatusMutation({
        id: item?.id,
        command: isActive ? "deactivate" : "activate",
      });
      enqueueSnackbar(data?.defaultUserMessag || "Status Updated", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        error?.data?.defaultUserMessag || "Failed to Update Status",
        {
          variant: "success",
        }
      );
    }
  }

  return (
    <Paper className="p-2 sm:p-4">
      <div className="relative h-44 rounded overflow-hidden mb-2">
        <img
          src="https://www.apple.com/newsroom/images/product/mac/standard/Apple_MacBook-Pro_16-inch-Screen_10182021_big_carousel.jpg.large.jpg"
          alt=""
          className="w-full h-full"
        />
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <Fab
            size="small"
            color="primary"
            onClick={() =>
              navigate(generatePath(RouteEnum.SURVEYS_EDIT, { id: item?.id }))
            }
          >
            <Icon>edit</Icon>
          </Fab>
          <Fab
            size="small"
            className={clsx(
              isActive
                ? "bg-success-main text-success-contrastText"
                : "bg-error-main text-error-contrastText"
            )}
            onClick={handleSurveyStatusUpdate}
            disabled={updateSurveyStatusMutationResult.isLoading}
          >
            {updateSurveyStatusMutationResult?.isLoading ? (
              <CircularProgress
                className={clsx(
                  isActive
                    ? "text-success-contrastText"
                    : "text-error-contrastText"
                )}
              />
            ) : (
              <Icon>{isActive ? "lock_open" : "lock"}</Icon>
            )}
          </Fab>
        </div>
      </div>
      <Typography className="font-bold">{item?.name}</Typography>
      <Typography variant="body2" color="textSecondary">
        {item?.description}
      </Typography>
    </Paper>
  );
}

export default SystemSurveyListItem;
