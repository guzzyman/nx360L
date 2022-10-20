// import React, { useEffect, useRef } from "react";
import { nimbleX360JournalEntriesApi } from "./JournalEntriesStoreQuerySlice";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { getTextFieldFormikProps } from "common/Utils";
import {
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
// import useAuthUser from "hooks/useAuthUser";
import { useParams } from "react-router-dom";

export default function JournalEntryReverseTransaction(props) {
    const {
        title = "New Exception",
        submitText = "Reverse",
        open,
        onClose,
        userType,
        customerId,
        isDisabled,
        ...rest
    } = props;

    const {id} = useParams();
    // const authUser = useAuthUser();

    const [addMutation, { isLoading }] =
        nimbleX360JournalEntriesApi.useReverseJournalEntryMutation();

    const { enqueueSnackbar } = useSnackbar();
    const formik = useFormik({
        initialValues: {
            comment: "",
        },

        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object({
            comment: Yup.string().trim().required(),
        }),
        onSubmit: async (values) => {
            try {
                await addMutation({ id,...values }).unwrap();
                enqueueSnackbar("Transaction Reversed!",
                    {
                        variant: "success",
                    }
                );
                onClose();
            } catch (error) {
                enqueueSnackbar("Failed to Add Interaction",
                    {
                        variant: "error",
                    }
                );
            }
        },
    });

    return (
        <Dialog open={open} fullWidth {...rest}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 py-4">
                    <TextField
                        label="Comment"
                        fullWidth
                        multiline
                        rows={6}
                        className="sm:col-span-2"
                        {...getTextFieldFormikProps(formik, "comment")}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" onClick={onClose}>
                    Cancel
                </Button>
                <LoadingButton loading={isLoading} onClick={formik.handleSubmit}>
                    {submitText}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
