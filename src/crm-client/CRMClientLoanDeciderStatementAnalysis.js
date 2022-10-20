import { Icon, Paper, Typography } from "@mui/material";

function CRMClientLoanDeciderStatementAnalysis(props) {
  return (
    <>
      <Paper className="flex flex-col items-center p-4">
        <div className="mb-2">
          <Icon />
        </div>
        <div>
          <Typography variant="h6" className="text-center font-bold">
            {props.name}
          </Typography>
          <Typography
            className="text-center"
            variant="body2"
            color="textSecondary"
          >
            {props.description}
          </Typography>
        </div>
      </Paper>
    </>
  );
}

export default CRMClientLoanDeciderStatementAnalysis;
