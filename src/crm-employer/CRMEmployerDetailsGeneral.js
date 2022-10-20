import { Fragment, useState } from "react";
import {
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { ReactComponent as LoanBalanceSvg } from "assets/svgs/crm-client-details-loan-balance.svg";
import { ReactComponent as TotalSavingsSvg } from "assets/svgs/crm-client-details-savings.svg";
import { ReactComponent as InvestmentsSvg } from "assets/svgs/crm-client-details-investments.svg";
import { nimbleX360CRMClientApi } from "crm-client/CRMClientStoreQuerySlice";
import CurrencyTypography from "common/CurrencyTypography";

function CRMEmployerDetailsGeneral(props) {
  const { clientId, businessId } = props;

  const getClientSummary = nimbleX360CRMClientApi.useGetCRMEmployerSummaryQuery({
    clientId, businessId
  });

  return (
    <>
      <div className="mb-4">
        <Paper className="p-4">
          <Typography variant="h6" className="font-bold mb-4">
            Products
          </Typography>
          <div className="flex flex-col sm:flex-row">
            {[
              {
                IconSvg: LoanBalanceSvg,
                label: "Total Loan Balance",
                value: getClientSummary?.data?.loanInfo?.loanBalance || 0,
                currency: true,
              },
              {
                IconSvg: TotalSavingsSvg,
                label: "Total Savings",
                value: getClientSummary?.data?.walletInfo?.balance || 0,
                currency: true,
              },
              {
                IconSvg: InvestmentsSvg,
                label: "Total Employees",
                value: getClientSummary?.data?.employeeInfo?.numberOfEmployees || 0,
                currency: false,
              },
              {
                IconSvg: LoanBalanceSvg,
                label: "Total Loan Disbursed",
                value: getClientSummary?.data?.loanInfo?.loanDisbursed || 0,
                currency: true,
              },
            ].map(({ IconSvg, label, value, currency }, index) => (
              <Fragment key={label}>
                {!!index && <Divider orientation="vertical" flexItem />}
                <div className="flex flex-col items-center flex-1">
                  <IconSvg />
                  <Typography
                    color="textSecondary"
                    className="text-center mt-2"
                  >
                    {label}
                  </Typography>

                  {currency ? (
                    <CurrencyTypography variant="h6" className="text-center">
                      {value}
                    </CurrencyTypography>
                  ) : (
                    <Typography variant="h6" className="text-center">
                      {value}
                    </Typography>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </Paper>
      </div>
    </>
  );
}

export default CRMEmployerDetailsGeneral;
