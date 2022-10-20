import { Fragment } from "react";
import { Paper, Typography, Divider } from "@mui/material";
import { ReactComponent as LoanBalanceSvg } from "assets/svgs/crm-client-details-loan-balance.svg";
import { ReactComponent as TotalSavingsSvg } from "assets/svgs/crm-client-details-savings.svg";
import { ReactComponent as InvestmentsSvg } from "assets/svgs/crm-client-details-investments.svg";
import { nimbleX360CRMVendorApi } from "./CRMVendorStoreQuerySlice";
import CurrencyTypography from "common/CurrencyTypography";

function CRMVendorDetailsGeneral(props) {
  const { clientId } = props;

  const getClientSummary = nimbleX360CRMVendorApi.useGetCRMVendorsSummaryQuery({
    id: clientId,
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
                value: getClientSummary?.data?.summaries?.balance || 0,
                currency: true,
              },
              {
                IconSvg: TotalSavingsSvg,
                label: "Total Savings",
                value: getClientSummary?.data?.summaries?.balance || 0,
                currency: true,
              },
              {
                IconSvg: InvestmentsSvg,
                label: "Total Investment",
                value: getClientSummary?.data?.summaries?.balance || 0,
                currency: false,
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

export default CRMVendorDetailsGeneral;
