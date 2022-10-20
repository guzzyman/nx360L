import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactComponent as EditSvg } from "assets/svgs/edit-icon.svg";
import { RouteEnum } from "common/Constants";
import { useNavigate } from "react-router";

function CRMEmployerProfile({ client }) {
  const navigate = useNavigate();
  const employerInformation = [
    {
      title: "Fullname",
      value: client?.name || "",
    },
    {
      title: "Nickname",
      value: client?.slug || "",
    },
    {
      title: "clientType",
      value: client?.clientType?.name || "",
    },
    {
      title: "Head Office",
      value: client?.parent?.name || "",
    },
    {
      title: "sector",
      value: client?.sector?.name || "",
    },
    {
      title: "industryId",
      value: client?.industry?.name || "",
    },
  ];

  const employerAddress = [
    {
      title: "rcNumber",
      value: client?.rcNumber || "",
    },
    {
      title: "State",
      value: client?.state?.name || "",
    },
    {
      title: "LGA",
      value: client?.lga?.name || "",
    },
    {
      title: "Address",
      value: client?.officeAddress || "",
    },
    {
      title: "Nearest Landmark",
      value: client?.nearestLandMark || "",
    },
    {
      title: "Employer Phone Number",
      value: client?.mobileNo || "",
    },
    {
      title: "contactPerson",
      value: client?.contactPerson || "",
    },
    {
      title: "emailAddress",
      value: client?.emailAddress || "",
    },
    {
      title: "Employment Extension",
      value: client?.emailExtension || "",
    },
  ];

  return (
    <div className="pb-10">
      {/* Employer Information */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex">
            <Typography variant="h5" mr={5}>
              <b>Employer Informations</b>
            </Typography>
            <Button
              onClick={() =>
                navigate(RouteEnum.CRM_EMPLOYER_ADD + `/${client?.id}`)
              }
              variant="text"
              endIcon={<EditSvg />}
            >
              <b>Edit Profile</b>
            </Button>
          </div>

          <Box mt={2}>
            <Grid container>
              {employerInformation.map((data, i) => (
                <Grid item xs={6} md={3} mt={3}>
                  <Box>
                    <Typography variant="caption">{data.title}</Typography>
                    <Typography variant="body1">{data.value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      </Paper>
      {/* End Employer information */}

      {/* Employment Address */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5">
              <b>Employment Address</b>
            </Typography>
            <Box />
          </div>

          <Box mt={2}>
            <Grid container>
              {employerAddress.map((data, i) => (
                <Grid item xs={6} md={3} mt={3}>
                  <Box>
                    <Typography variant="caption">{data.title}</Typography>
                    <Typography variant="body1">{data.value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      </Paper>
      {/* End employment Address */}
    </div>
  );
}

export default CRMEmployerProfile;
