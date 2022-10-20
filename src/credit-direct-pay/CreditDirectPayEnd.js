import { Icon, Typography } from "@mui/material";
import dfnFormat from "date-fns/format";
import CreditDirectPayRedirectButtons from "./CreditDirectPayRedirectButtons";
import CreditDirectPayStepPaper from "./CreditDirectPayStepPaper";

function CreditDirectPayEnd(props) {
  const { cdlPayTokenizeCardMutationResult, config, state } = props;
  return (
    <>
      <CreditDirectPayStepPaper>
        <div className="flex items-center justify-center mb-2">
          <Icon className="text-4xl" color="success">
            check_circle
          </Icon>
        </div>
        <Typography variant="h6" className="text-center font-bold mb-4">
          Congratulations!
        </Typography>
        <Typography
          // variant="body2"
          className="mb-4 text-center text-success-main"
        >
          {state?.message ||
            cdlPayTokenizeCardMutationResult?.data?.defaultUserMessage}
        </Typography>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {[
            {
              label: "First Name",
              value: config.firstname,
            },
            {
              label: "Last Name",
              value: config.lastname,
            },
            {
              label: "Email",
              value: config.email,
            },
            {
              label: "Transaction Type",
              value: config?.transactionType,
            },
            {
              label: "Transaction Ref",
              value: state?.transactionRef,
            },
            {
              label: "Gateway",
              value: state?.gateway,
            },
            {
              label: "Date",
              value: dfnFormat(new Date(), "yyyy-MM-dd"),
            },
          ].map(({ label, value }) => (
            <div key={label} className="">
              <Typography variant="body2" className="text-text-secondary">
                {label}
              </Typography>
              {typeof value === "object" ? (
                value
              ) : (
                <Typography>
                  {value !== undefined && value !== null && value !== ""
                    ? value
                    : "-"}
                </Typography>
              )}
            </div>
          ))}
        </div>
        <CreditDirectPayRedirectButtons {...props} />
      </CreditDirectPayStepPaper>
    </>
  );
}

export default CreditDirectPayEnd;
