import { Button, Chip, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactComponent as EditSvg } from "assets/svgs/edit-icon.svg";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";
import { parseDateToString } from "common/Utils";
import { nimbleX360CRMVendorApi } from "./CRMVendorStoreQuerySlice";

function CRMVendorAddEditFormPreview({
  goToStep,
  isEdit,
  data,
  addressData,
  bankData,
}) {
  const { officeData } = nimbleX360CRMVendorApi.useGetCRMVendorsOfficesQuery();
  console.log("officeData", officeData, data);
  const personalInformations = [
    {
      title: "Full Name",
      value: data?.fullname || "",
      required: true,
    },
    {
      title: "Phone Number",
      value: data?.mobileNo || "",
      required: true,
    },

    {
      title: "Office Name",
      value: data?.officeName || "",
    },
    {
      title: "Email Address",
      value:
        (
          <div className="flex flex-wrap gap-1">
            {data?.emailAddress?.split(",").map((email, i) => (
              <Chip key={i} label={email} />
            ))}
          </div>
        ) || "",
    },
  ];

  const residentialInformations = [
    {
      title: "Permanent Residential State",
      value: addressData?.[0]?.stateName || "",
      required: true,
    },
    {
      title: "LGA",
      value: addressData?.[0]?.lga || "",
      required: true,
    },
    {
      title: "Permanent Address",
      value: addressData?.[0]?.addressLine1 || "",
    },
    {
      title: "Nearest Landmark",
      value: addressData?.[0]?.nearestLandMark || "",
    },
    // {
    //   title: "Residential Status",
    //   value: addressData?.[0]?.residentStatus || "",
    //   required: true,
    // },
    // {
    //   title: "Date moved in",
    //   value: parseDateToString(addressData?.[0]?.dateMovedIn) || "",
    //   required: true,
    // },
  ];

  const bankInformation = [
    {
      title: "Bank",
      value: bankData?.[0]?.bank?.name || "",
      required: true,
    },
    {
      title: "Account Number",
      value: bankData?.[0]?.accountnumber || "",
      required: true,
    },
    {
      title: "Account Name",
      value: bankData?.[0]?.accountname || "",
    },
    {
      title: "Bank Verification",
      value: (
        <ClientXLeadStatusChip
          color={bankData?.[0]?.active ? "success" : "warning"}
          label={bankData?.[0]?.active ? "Verified" : "Unverified"}
        />
      ),
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
            {isEdit && (
              <Button
                onClick={() => goToStep(0)}
                variant="text"
                endIcon={<EditSvg />}
              >
                <b>Edit</b>
              </Button>
            )}
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

      {/* Residential Information */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" color="primary">
              <b>Residential Information</b>
            </Typography>
            {isEdit && (
              <Button
                onClick={() => goToStep(1)}
                variant="text"
                endIcon={<EditSvg />}
              >
                <b>Edit</b>
              </Button>
            )}
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

      {/* Bank Information */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" color="primary">
              <b>Bank Information</b>
            </Typography>
            {isEdit && (
              <Button
                onClick={() => goToStep(2)}
                variant="text"
                endIcon={<EditSvg />}
              >
                <b>Edit</b>
              </Button>
            )}
          </div>

          <Box mt={2}>
            <Grid container>
              {bankInformation.map((data, i) => (
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
      {/*  Bank Information*/}
    </div>
  );
}

export default CRMVendorAddEditFormPreview;
