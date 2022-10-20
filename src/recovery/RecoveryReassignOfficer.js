import React, { useMemo } from "react";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import Modal from "common/Modal";
import LoadingButton from "@mui/lab/LoadingButton";

import { nx360RecoveryApi } from "./RecoveryStoreQuerySlice";
import { MenuItem, TextField } from "@mui/material";
import { getTextFieldFormikProps, getUserErrorMessage } from "common/Utils";

function RecoveryReassignOfficer(props) {
    const { onClose, clientId, ...rest } = props;
    const [addMutation, { isLoading }] = nx360RecoveryApi.useReassignCollectionOfficerMutation();
    const templateOptionData = nx360RecoveryApi.useGetUsersQuery();
    const filteredTemplateOptionData = useMemo(() => templateOptionData?.data?.filter((obj)=>obj?.staff?.collectionOfficer === true), [templateOptionData?.data]);

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
            console.log(values)
            try {
                await addMutation({ ...values }).unwrap();
                enqueueSnackbar(`Recovery Officer Reassign Successful!`, {
                    variant: "success",
                });
                onClose();
            } catch (error) {
                enqueueSnackbar(`Recovery Officer Reassign Failed!`, {
                    variant: "error",
                });
                enqueueSnackbar(getUserErrorMessage(error.data.errors), {
                    variant: "error",
                });
            }
        },
    });

    return (
        <Modal onClose={onClose} size="" title="Reassign Collection Officer" {...rest}>
            <TextField
                {...getTextFieldFormikProps(formik, "toLoanOfficerId")}
                label="Officer"
                fullWidth
                select
            >
                {filteredTemplateOptionData &&
                    filteredTemplateOptionData?.map((option) => (
                        <MenuItem key={option?.id} value={option?.staff?.id}>
                            {option?.staff?.displayName}
                        </MenuItem>
                    ))}
            </TextField>

            <div className="mt-5">
                <LoadingButton
                    size="large"
                    loading={isLoading}
                    fullWidth
                    onClick={formik.handleSubmit}
                >
                    Reassign Recovery Officer
                </LoadingButton>
            </div>
        </Modal>
    );
}

export default RecoveryReassignOfficer;
