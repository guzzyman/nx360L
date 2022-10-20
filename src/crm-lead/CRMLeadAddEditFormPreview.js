import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactComponent as EditSvg } from "assets/svgs/edit-icon.svg";
import { formatNumberToCurrency, parseDateToString } from "common/Utils";

function CRMLeadAddEditFormPreview({ goToStep, client }) {
  const personalInformations = [
    {
      title: "Title",
      value: client?.moreInfo?.clients?.title.name || "",
    },
    {
      title: "First Name",
      value: client?.moreInfo?.clients?.firstname || "",
      required: true,
    },
    {
      title: "Middle Name",
      value: client?.moreInfo?.clients?.middlename || "",
   
    },
    {
      title: "Last Name",
      value: client?.moreInfo?.clients?.lastname || "",
      required: true,
    },
    {
      title: "Gender",
      value: client?.moreInfo?.clients?.gender?.name || "",
    },
    {
      title: "DOB",
      value: parseDateToString(client?.moreInfo?.clients?.dateOfBirth) || "",
    },
    {
      title: "Marital Status",
      value: client?.moreInfo?.clients?.maritalStatus?.name || "",
    },
    {
      title: "Educational Level",
      value: client?.moreInfo?.clients?.educationLevel?.name || "",
    },
    {
      title: "No. Of Dependent",
      value: client?.moreInfo?.clients?.numberOfDependent || "",
    },
    {
      title: "Phone Number",
      value: client?.moreInfo?.clients?.mobileNo || "",
      required: true,
    },
    {
      title: "Alt Phone Number",
      value: client?.moreInfo?.clients?.alternateMobileNo || "",
    },
    {
      title: "Email Address",
      value: client?.moreInfo?.clients?.emailAddress || "",
    },
    {
      title: "Lead Source",
      value: client?.leadSource?.name || "",
    },
    {
      title: "Lead Rating",
      value: client?.leadRating?.name || "",
    },
    {
      title: "Lead Category",
      value: client?.leadCategory?.name || "",
    },
    {
      title: "Interested Product",
      value: client?.leadType|| "",
    },
    {
      title: "Revenue Inflow",
      value: formatNumberToCurrency(client?.expectedRevenueIncome) || "",
    },
  ];

  const employmentInformations = [
    {
      title: "Organization",
      value: client?.moreInfo?.clientEmployers?.[0]?.employer?.name || "",
    },
    {
      title: "State",
      value: client?.moreInfo?.clientEmployers?.[0]?.state?.name || "",
    },
    {
      title: "LGA",
      value: client?.moreInfo?.clientEmployers?.[0]?.lga?.name || "",
    },
    {
      title: "Address",
      value: client?.moreInfo?.clientEmployers?.[0]?.officeAddress || "",
    },
    {
      title: "Nearest Landmark",
      value: client?.moreInfo?.clientEmployers?.[0]?.nearestLandMark || "",
    },
    {
      title: "Employer’s Phone Number",
      value: client?.moreInfo?.clientEmployers?.[0]?.mobileNo || "",
    },
    {
      title: "Staff ID",
      value: client?.moreInfo?.clientEmployers?.[0]?.staffId || "",
    },
    {
      title: "Job Role/Grade",
      value: client?.moreInfo?.clientEmployers?.[0]?.jobGrade || "",
    },
    {
      title: "Employment Type",
      value:
        client?.moreInfo?.clientEmployers?.[0]?.employmentStatus?.name || "",
    },
    {
      title: "Date of Employment",
      value:
        parseDateToString(
          client?.moreInfo?.clientEmployers?.[0]?.employmentDate
        ) || "",
    },
    {
      title: "Work Email",
      value: client?.moreInfo?.clientEmployers?.[0]?.emailAddress || "",
    },
    {
      title: "Salary Range",
      value: client?.moreInfo?.clientEmployers?.[0]?.salaryRange?.name || "",
    },
    {
      title: "Salary Payment day",
      value:
        parseDateToString(
          client?.moreInfo?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate
        ) || "",
    },
  ];

  const residentialInformations = [
    {
      title: "Permanent Residential State",
      value: client?.moreInfo?.addresses?.[0]?.stateName || "",
    },
    {
      title: "LGA",
      value: client?.moreInfo?.addresses?.[0]?.lga || "",
    },
    {
      title: "Permanent Address",
      value: client?.moreInfo?.addresses?.[0]?.addressLine1 || "",
    },
    {
      title: "Nearest Landmark",
      value: client?.moreInfo?.addresses?.[0]?.nearestLandMark || "",
    },
    {
      title: "Residential Status",
      value: client?.moreInfo?.addresses?.[0]?.residentStatus || "",
    },
  ];

  return (
    <div>
      {/* personal Information */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" color="primary">
              <b>Personal Informations</b>
            </Typography>
            <Button
              onClick={() => goToStep(1)}
              variant="text"
              endIcon={<EditSvg />}
            >
              <b>Edit</b>
            </Button>
          </div>

          <Box mt={2}>
            <Grid container>
              {personalInformations.map((data, i) => (
                <Grid item xs={6} md={3} mt={3}>
                  <Box>
                    <Typography
                      variant="caption"
                      color={data.required && data.value === "" ? "red" : ""}
                    >
                      {data.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color={data.required && data.value === "" ? "red" : ""}
                    >
                      {data.required && data.value === ""
                        ? "*required"
                        : data.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      </Paper>
      {/* End personal information */}

      {/* Employment Information */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" color="primary">
              <b>Employment Information</b>
            </Typography>
            <Button
              onClick={() => goToStep(2)}
              variant="text"
              endIcon={<EditSvg />}
            >
              <b>Edit</b>
            </Button>
          </div>

          <Box mt={2}>
            <Grid container>
              {employmentInformations.map((data, i) => (
                <Grid item xs={6} md={3} mt={3}>
                  <Box>
                    <Typography
                      variant="caption"
                      color={data.required && data.value === "" ? "red" : ""}
                    >
                      {data.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color={data.required && data.value === "" ? "red" : ""}
                    >
                      {data.required && data.value === ""
                        ? "*required"
                        : data.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      </Paper>
      {/* End employment information */}

      {/* Residential Information */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" color="primary">
              <b>Residential Information</b>
            </Typography>
            <Button
              onClick={() => goToStep(3)}
              variant="text"
              endIcon={<EditSvg />}
            >
              <b>Edit</b>
            </Button>
          </div>

          <Box mt={2}>
            <Grid container>
              {residentialInformations.map((data, i) => (
                <Grid item xs={6} md={3} mt={3}>
                  <Box>
                    <Typography
                      variant="caption"
                      color={data.required && data.value === "" ? "red" : ""}
                    >
                      {data.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color={data.required && data.value === "" ? "red" : ""}
                    >
                      {data.required && data.value === ""
                        ? "*required"
                        : data.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      </Paper>

      {/* Residential information */}
    </div>
  );
}

export default CRMLeadAddEditFormPreview;
