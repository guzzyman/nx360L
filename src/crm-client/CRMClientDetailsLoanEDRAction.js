import { IconButton, Icon, Menu, MenuItem } from "@mui/material";
import { RouteEnum } from "common/Constants";
import usePopOver from "hooks/usePopover";
import useToggle from "hooks/useToggle";
import { generatePath, useNavigate } from "react-router-dom";
import CRMClientDetailsLoanEDRMakeRepayment from "./CRMClientDetailsLoanEDRMakeRepayment";
import CRMClientDetailsLoanEDRPrepayLoan from "./CRMClientDetailsLoanEDRPrepayLoan";
import CRMClientDetailsLoanEDRForeclosure from "./CRMClientDetailsLoanEDRForeclosure";

function CRMClientDetailsLoanEDRAction({ data }) {
  const navigate = useNavigate();

  const popover = usePopOver();

  const [isMakeRepaymentDialog, toggleMakeRepayementDialog] = useToggle();
  const [isPrepayLoanDialog, togglePrepayLoanDialog] = useToggle();
  const [isLoanForeclosureDialog, toggleLoanForeclosureDialog] = useToggle();

  if (data?.status !== "PROCCESSING") {
    return null;
  }

  return (
    <>
      {isMakeRepaymentDialog && (
        <CRMClientDetailsLoanEDRMakeRepayment
          data={data}
          onClose={toggleMakeRepayementDialog}
        />
      )}
      {isPrepayLoanDialog && (
        <CRMClientDetailsLoanEDRPrepayLoan
          data={data}
          onClose={togglePrepayLoanDialog}
        />
      )}
      {isLoanForeclosureDialog && (
        <CRMClientDetailsLoanEDRForeclosure
          data={data}
          onClose={toggleLoanForeclosureDialog}
        />
      )}
      <IconButton onClick={popover.togglePopover}>
        <Icon>more_vert</Icon>
      </IconButton>
      <Menu
        anchorEl={popover.anchorEl}
        open={popover.isOpen}
        onClose={() => popover.togglePopover()}
      >
        {data?.isSingle ? (
          <>
            <MenuItem
              onClick={() => {
                popover.togglePopover();
                toggleMakeRepayementDialog();
              }}
            >
              Make Repayment
            </MenuItem>
            <MenuItem
              onClick={() => {
                popover.togglePopover();
                togglePrepayLoanDialog();
              }}
            >
              Prepay Loan
            </MenuItem>
            <MenuItem
              onClick={() => {
                popover.togglePopover();
                toggleLoanForeclosureDialog();
              }}
            >
              Loan Foreclosure
            </MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={() => {
              popover.togglePopover();
              navigate(
                generatePath(
                  RouteEnum.EDR_PARTIALLY_PROCESSED_DETAILS_BREAKDOWN_DETAILS,
                  { id: data?.glJournalId, tid: data?.id }
                )
              );
            }}
          >
            Go to EDR Partial Page
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default CRMClientDetailsLoanEDRAction;
