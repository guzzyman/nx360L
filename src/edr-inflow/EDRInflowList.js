import EDRList from "edr/EDRList";
import EDRInflowListUploadGroupButton from "./EDRInflowListUploadGroupButton";
import { DateConfig, RouteEnum, UIPermissionEnum } from "common/Constants";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EDRStatusEnum } from "edr/EDRConstants";
import useToggle from "hooks/useToggle";
import { DatePicker, LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import { nxEDRInflowApi } from "./EDRInflowStoreQuerySlice";
import { useSnackbar } from "notistack";
import { getTextFieldFormikProps } from "common/Utils";
import { useMemo } from "react";
import * as dfn from "date-fns";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";
import EDRInflowFundEmployer from "./EDRInflowFundEmployer";

function EDRInflowList(props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [isSpoolInflowModal, toggleSpoolInflowModal] = useToggle();

  const [spoolEDRInflowMutation, spoolEDRInflowMutationResult] =
    nxEDRInflowApi.useSpoolEDRInflowMutation();

  const { startPeriod, endPeriod } = useMemo(
    () => ({
      startPeriod: dfn.subWeeks(new Date(), 1),
      endPeriod: new Date(),
    }),
    []
  );

  const spoolInflowFormik = useFormik({
    initialValues: {
      startPeriod,
      endPeriod,
    },
    validationSchema: yup.object({
      startPeriod: yup.date().label("Start Date").required(),
      endPeriod: yup.date().label("End Date").required(),
    }),
    onSubmit: async (values) => {
      try {
        const data = await spoolEDRInflowMutation({
          startPeriod: dfn.format(
            values.startPeriod,
            DateConfig.HYPHEN_dd_MM_yyyy
          ),
          endPeriod: dfn.format(values.endPeriod, DateConfig.HYPHEN_dd_MM_yyyy),
        }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage || "Successfully Spooled FCMB Inflow",
          { variant: "success" }
        );
        toggleSpoolInflowModal(false);
      } catch (error) {
        enqueueSnackbar(
          error?.data?.[0]?.defaultUserMessage || "Failed to Spool FCMB Inflow",
          { variant: "error" }
        );
      }
    },
  });

  return (
    <>
      <EDRList
        title="FCMB Inflow"
        breadcrumbs={() => [{ name: "FCMB Inflow" }]}
        defaultSearchParams={defaultSearchParams}
        queryArgs={queryArgs}
        detailsRoutePath={RouteEnum.EDR_DETAILS}
        tableHookProps={() => ({
          displayRowCheckbox: true,
        })}
        actions={(scaffoldProps) => (
          <>
            {/* <EDRInflowListUploadGroupButton {...scaffoldProps} /> */}
            {!!scaffoldProps?.tableInstance?.selectedFlatRows?.length ? (
              <>
                <EDRInflowFundEmployer
                  transactions={scaffoldProps?.tableInstance?.selectedFlatRows?.map(
                    (row) => row.original
                  )}
                />
              </>
            ) : null}
            <AuthUserUIPermissionRestrictor
              permissions={[UIPermissionEnum.ALLOCATECASHIER_TELLER]}
            >
              <Button onClick={toggleSpoolInflowModal}>Spool Inflow</Button>
              <Dialog open={isSpoolInflowModal} fullWidth>
                <DialogTitle>Spool FCMB Inflow</DialogTitle>
                <DialogContent>
                  <div className="grid md:grid-cols-2 gap-x-4">
                    <DatePicker
                      disableFuture
                      label="Start Date"
                      value={spoolInflowFormik.values.startPeriod}
                      onChange={(newValue) => {
                        spoolInflowFormik.setFieldValue(
                          "startPeriod",
                          newValue
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          required
                          margin="normal"
                          {...getTextFieldFormikProps(
                            spoolInflowFormik,
                            "startPeriod"
                          )}
                          {...params}
                        />
                      )}
                    />
                    <DatePicker
                      disableFuture
                      minDate={spoolInflowFormik.values.startPeriod}
                      label="Close Date"
                      value={spoolInflowFormik.values.endPeriod}
                      onChange={(newValue) => {
                        spoolInflowFormik.setFieldValue("endPeriod", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          margin="normal"
                          required
                          {...getTextFieldFormikProps(
                            spoolInflowFormik,
                            "endPeriod"
                          )}
                          {...params}
                        />
                      )}
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button variant="outlined" onClick={toggleSpoolInflowModal}>
                    Cancel
                  </Button>
                  <LoadingButton
                    disabled={spoolEDRInflowMutationResult.isLoading}
                    loading={spoolEDRInflowMutationResult.isLoading}
                    loadingPosition="end"
                    endIcon={<></>}
                    onClick={spoolInflowFormik.handleSubmit}
                  >
                    Spool
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </AuthUserUIPermissionRestrictor>
            <AuthUserUIPermissionRestrictor
              permissions={[UIPermissionEnum.READ_Branch_Expected_Cash_Flow]}
            >
              <Button onClick={() => navigate(RouteEnum.EDR_CREATE)}>
                Create Inflow
              </Button>
            </AuthUserUIPermissionRestrictor>
          </>
        )}
      />
    </>
  );
}

export default EDRInflowList;

const queryArgs = {
  statusId: EDRStatusEnum.PENDING,
  withUniqueId: false,
};

const defaultSearchParams = { limit: 100 };
