import { Alert, Button } from "@mui/material";
import Modal from "common/Modal";
import React from "react";

export default function CRMClientDetailsLoanSendForApprovalChecks(props) {
  const { onClose, clientLoanQueryResult, ...rest } = props;
  const isLafSigned = clientLoanQueryResult.data?.isLafSigned;
  const isDocumentComplete = clientLoanQueryResult.data?.isDocumentComplete;
  const isPaymentMethod = !!clientLoanQueryResult.data?.paymentMethod?.id;
  return (
    <Modal
      onClose={onClose}
      size="md"
      title="Complete Approval Checks"
      {...rest}
    >
      <div>
        {isLafSigned ? (
          <Alert className="mb-2" severity="success">
            LAF successfully signed
          </Alert>
        ) : (
          <Alert className="mb-2" severity="warning">
            Kindly Sign LAF
          </Alert>
        )}
        {isDocumentComplete ? (
          <Alert className="mb-2" severity="success">
            Document completed
          </Alert>
        ) : (
          <Alert className="mb-2" severity="warning">
            Kindly upload documents
          </Alert>
        )}
        {isPaymentMethod ? (
          <Alert severity="success">Payment method confirmed</Alert>
        ) : (
          <Alert severity="warning">Payment method not found</Alert>
        )}
      </div>

      <div className="mt-5 flex gap-3 justify-between">
        <Button
          variant="outlined"
          color="warning"
          fullWidth
          onClick={() => onClose()}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
