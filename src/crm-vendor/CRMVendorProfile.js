import { Button, Chip, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactComponent as EditSvg } from "assets/svgs/edit-icon.svg";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";
import { RouteEnum, UIPermissionEnum } from "common/Constants";
import { parseDateToString } from "common/Utils";
import { useNavigate } from "react-router";
import { nimbleX360CRMVendorApi } from "./CRMVendorStoreQuerySlice";
import { useParams } from "react-router";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function CRMVendorProfile({ client }) {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data } = nimbleX360CRMVendorApi.useGetCRMVendorQuery(id, {
    skip: !id,
  });

  const { data: addressData } =
    nimbleX360CRMVendorApi.useGetCRMVendorsAddressQuery(
      { id },
      {
        skip: !id,
      }
    );

  const { data: bankData } = nimbleX360CRMVendorApi.useGetCRMVendorsBankQuery(
    { id },
    {
      skip: !id,
    }
  );

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
            {data?.emailAddress?.split(",")?.map((email, i) => (
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
    <div className="pb-10">
      {/* Employer Information */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex">
            <Typography variant="h5" mr={5}>
              <b>Personal Informations</b>
            </Typography>
            <AuthUserUIPermissionRestrictor
              permissions={[UIPermissionEnum.CREATE_ACCOUNTINGRULE]}
            >
              <Button
                onClick={() =>
                  navigate(RouteEnum.CRM_VENDOR_ADD + `/${client?.id}`)
                }
                variant="text"
                endIcon={<EditSvg />}
              >
                <b>Edit Profile</b>
              </Button>
            </AuthUserUIPermissionRestrictor>
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
      {/* End Employer information */}

      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5">
              <b>Vendor Address</b>
            </Typography>
            <Box />
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

      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5">
              <b>Bank Information</b>
            </Typography>
            <Box />
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
    </div>
  );
}

export default CRMVendorProfile;
