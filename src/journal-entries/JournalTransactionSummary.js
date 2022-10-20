import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";
import { parseDateToString } from "common/Utils";
import { useMemo } from "react";

function JournalTransactionSummary(props) {
    const { data, onClose } = props;

    const transactionSummaryData = useMemo(() => [
        {
            Label: "Office",
            Value: `${data?.officeName || "--"}`,
        },
        {
            Label: "Entry ID",
            Value: `${data?.id || "--"}`,
        },
        {
            Label: "Transaction ID",
            Value: `${data?.transactionId || "--"}`,
        },
        {
            Label: "Transaction Date",
            Value: `${parseDateToString(data?.transactionDate || "--")}`,
        },
        {
            Label: "Transaction Type",
            Value: `${data?.glAccountType?.value || "--"}`,
        },
        {
            Label: "Account",
            Value: `${data?.glAccountName}(${data?.glAccountCode})`,
        },
        {
            Label: `${data?.entryType?.value === 'CREDIT' ? 'CREDIT' : 'DEBIT' || "--"}`,
            Value: `${data?.entryType?.value === 'CREDIT' ? data?.amount : data?.amount || "--"}`,
        },
        {
            Label: "Payment Details",
            Value: `${data?.paymentDetails?.paymentType?.name || "--"}`,
        },
        {
            Label: "Payment Type Id",
            Value: `${data?.paymentDetails?.paymentType?.id || "--"}`,
        },
        {
            Label: "Cheque",
            Value: `${data?.paymentDetails?.checkNumber || "--"}`,
        },
        {
            Label: "Routing Code",
            Value: `${data?.paymentDetails?.routingCode || "--"}`,
        },
        {
            Label: "Receipt",
            Value: `${data?.paymentDetails?.receiptNumber || "--"}`,
        },
        {
            Label: "Bank",
            Value: `${data?.paymentDetails?.bankNumber || "--"}`,
        },
        {
            Label: "Created By",
            Value: `${data?.createdByUserName || "--"}`,
        },
        {
            Label: "Created On",
            Value: `${parseDateToString(data?.createdDate || "--")}`,
        },
    ], [data?.amount, data?.createdByUserName, data?.createdDate, data?.entryType?.value, data?.glAccountCode, data?.glAccountName, data?.glAccountType?.value, data?.id, data?.officeName, data?.paymentDetails?.bankNumber, data?.paymentDetails?.checkNumber, data?.paymentDetails?.paymentType?.id, data?.paymentDetails?.paymentType?.name, data?.paymentDetails?.receiptNumber, data?.paymentDetails?.routingCode, data?.transactionDate, data?.transactionId]);

    console.log(transactionSummaryData);
    return (
        <>
            <Dialog open fullWidth onClose={onClose}>
                <DialogTitle>View Journal Entry ({data?.transactionId})</DialogTitle>
                <Divider />
                <DialogContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 py-4">
                        {transactionSummaryData?.map((item) => (
                            <div className="grid gap-2 sm:grid-cols-2">
                                <Typography variant="body2" color="textSecondary">
                                    {item?.Label?.toUpperCase().concat(':')}
                                </Typography>
                                <Typography>{item?.Value?.toUpperCase()}</Typography>
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default JournalTransactionSummary;
