import React from "react";
import { nimbleX360CRMClientApi } from "./CRMClientStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";
import { MenuItem, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

export default function CRMClientLoanReAssignLoanOfficerAdd(props) {
  const { onClose, clientLoanQueryResult, ...rest } = props;

  const loanLevel = `${
    clientLoanQueryResult.data?.status?.id === 100 ? "L1" : ""
  } ${clientLoanQueryResult.data?.status?.id === 200 ? "L2" : ""}`;

  const loanOfficerCode = `${
    clientLoanQueryResult.data?.status?.id === 100 ? 2501 : ""
  } ${clientLoanQueryResult.data?.status?.id === 200 ? 2502 : ""}`;

  const { loanId } = useParams();
  const [addMutation, { isLoading }] =
    nimbleX360CRMClientApi.useAssignLoanUnderwriterOfficerMutation();

  const usersQuery = nimbleX360CRMClientApi.useGetUsersQuery({
    showOnlyUnderwriterOfficer: true,
  });

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      toLoanOfficerId: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      toLoanOfficerId: Yup.string().required(),
    }),

    onSubmit: async (values) => {
      try {
        const newValue = {
          toLoanOfficerId: values.toLoanOfficerId,
          underwriterTypeId: usersQuery.data?.find(
            (value) =>
              parseInt(value.staff.id) === parseInt(values.toLoanOfficerId)
          )?.staff?.underwriterValue?.id,
        };

        await addMutation({
          loanId,
          params: { command: "assignStaffUnderwriter" },
          ...newValue,
        }).unwrap();
        enqueueSnackbar(`ReAssign ${loanLevel} Officer Successful!`, {
          variant: "success",
        });
        onClose();
      } catch (error) {
        enqueueSnackbar(`ReAssign ${loanLevel} Officer Failed!`, {
          variant: "error",
        });
        enqueueSnackbar(getUserErrorMessage(error.data.errors), {
          variant: "error",
        });
      }
    },
  });

  const loanUserQuery = usersQuery?.data?.filter(
    (val) =>
      parseInt(val?.staff?.underwriterValue?.id) ===
        parseInt(loanOfficerCode) && !val?.staff?.isHoliday
  );

  return (
    <Modal onClose={onClose} title={`Reassign ${loanLevel} Officer`} {...rest}>
      <div className="mt-4">
        <div className="mb-4">
          <TextField
            label="To loan officer"
            fullWidth
            {...getTextFieldFormikProps(formik, "toLoanOfficerId")}
            select
          >
            {loanUserQuery &&
              loanUserQuery?.map((data, index) => (
                <MenuItem value={data?.staff?.id} key={index} autoCapitalize>
                  {data.firstname} {data.lastname}
                </MenuItem>
              ))}
          </TextField>
        </div>
      </div>

      <div className="mt-5">
        <LoadingButton
          size="large"
          loading={isLoading}
          fullWidth
          onClick={formik.handleSubmit}
        >
          Reassign {loanLevel} Officer
        </LoadingButton>
      </div>
    </Modal>
  );
}
