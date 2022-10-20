import {
  Paper,
  Typography,
  TextField,
  MenuItem,
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { format } from "date-fns";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import InputAdornment from "@mui/material/InputAdornment";

function ClientXLeadLoanAddEditDetails({
  formik,
  setProductId,
  clientData,
  employerDataIsloading,
  data,
  user,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientEMployerExist =
    !!clientData?.clientEmployers?.[0]?.employer?.parent?.id;

  return (
    <div className="grid gap-4">
      <Paper className="p-4 md:p-8">
        <Typography variant="h6" className="font-bold">
          Details
        </Typography>
        <Typography variant="body2" className="mb-8" color="textSecondary">
          Kindly fill in all required information in the loan application form.{" "}
          {/* if loan product is empty, display below warning */}
          {clientData && !clientEMployerExist && (
            <div className=" max-w-3xl mt-2">
              <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                Loan product is not available for client, kindly update client
                employer to view loan product.{" "}
                <Button
                  variant="contained"
                  size="small"
                  className="opaque"
                  color="warning"
                  onClick={() =>
                    navigate(
                      generatePath(RouteEnum.CRM_CLIENTS_ADD_INSTANCE, { id })
                    )
                  }
                >
                  Update client employer
                </Button>
              </Alert>
            </div>
          )}
        </Typography>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-3xl">
          <TextField
            select
            required
            label="Product Name"
            onChange={(newValue) => {
              formik.setFieldValue("productId", newValue.target.value);
              setProductId(newValue.target.value);
            }}
            value={formik.values?.productId}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {employerDataIsloading && (
                    <CircularProgress color="inherit" size={20} />
                  )}
                </InputAdornment>
              ),
            }}
          >
            {data?.productOptions &&
              data?.productOptions?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            select
            required
            label="Loan Officer"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {employerDataIsloading && (
                    <CircularProgress color="inherit" size={20} />
                  )}
                </InputAdornment>
              ),
            }}
            disabled={user.staffId}
            {...getTextFieldFormikProps(formik, "loanOfficerId")}
          >
            {data?.loanOfficerOptions &&
              data?.loanOfficerOptions?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.displayName}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            select
            required
            label="Loan Purpose"
            {...getTextFieldFormikProps(formik, "loanPurposeId")}
          >
            {data?.loanPurposeOptions &&
              data?.loanPurposeOptions?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>

          {/* <TextField
            select
            required
            label="Fund"
            {...getTextFieldFormikProps(formik, "fundId")}
          >
            {data?.fundOptions &&
              data?.fundOptions?.map((option, index) => (
                <MenuItem key={index} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField> */}

          {/* <DesktopDatePicker
            value={formik.values?.approvedOnDate || new Date()}
            label="Submitted On*"
            inputFormat="dd/MM/yyyy"
            maxDate={new Date()}
            minDate={new Date()}
            disabled
            InputProps={{ readOnly: true }}
            {...getTextFieldFormikProps(formik, "submittedOnDate")}
            onChange={(newValue) => {
              formik.setFieldValue(
                "submittedOnDate",
                format(new Date(newValue), "dd MMMM yyyy")
              );
            }}
            renderInput={(params) => (
              <TextField
                InputProps={{ readOnly: true }}
                fullWidth
                {...params}
              />
            )}
          />

          <DesktopDatePicker
            value={formik.values?.approvedOnDate || new Date()}
            InputProps={{ readOnly: true }}
            label="Disbursed On*"
            inputFormat="dd/MM/yyyy"
            disabled
            maxDate={new Date()}
            minDate={new Date()}
            {...getTextFieldFormikProps(formik, "expectedDisbursementDate")}
            onChange={(newValue) => {
              formik.setFieldValue(
                "expectedDisbursementDate",
                format(new Date(newValue), "dd MMMM yyyy")
              );
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          /> */}
        </div>
      </Paper>
    </div>
  );
}

export default ClientXLeadLoanAddEditDetails;
