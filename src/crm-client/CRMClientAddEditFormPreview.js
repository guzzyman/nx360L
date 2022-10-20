import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactComponent as EditSvg } from "assets/svgs/edit-icon.svg";
import ClientXLeadStatusChip from "client-x-lead/ClientXLeadStatusChip";
import PdfPreviewerModal from "common/PdfPreviewerModal";
import { getBase64FileType, parseDateToString } from "common/Utils";
import { useState } from "react";
import { Lightbox } from "react-modal-image";

function CRMClientAddEditFormPreview({ formik, goToStep, client }) {
  const [previewOpen, setPreviewOpen] = useState({});
  const personalInformations = [
    {
      title: "Title",
      value: client?.clients?.title.name || "",
      required: true,
    },
    {
      title: "First Name",
      value: client?.clients?.firstname || "",
      required: true,
    },
    {
      title: "Middle Name",
      value: client?.clients?.middlename || "",
    },
    {
      title: "Last Name",
      value: client?.clients?.lastname || "",
      required: true,
    },
    {
      title: "Gender",
      value: client?.clients?.gender?.name || "",
    },
    {
      title: "DOB",
      value: client?.clients?.dateOfBirth || "",
    },
    {
      title: "Marital Status",
      value: client?.clients?.maritalStatus?.name || "",
      required: true,
    },
    {
      title: "Educational Level",
      value: client?.clients?.educationLevel?.name || "",
      required: true,
    },
    {
      title: "No. Of Dependent",
      value: client?.clients?.numberOfDependent || "",
    },
    {
      title: "Phone Number",
      value: client?.clients?.mobileNo || "",
      required: true,
    },
    {
      title: "Alt Phone Number",
      value: client?.clients?.alternateMobileNo || "",
    },
    {
      title: "Email Address",
      value: client?.clients?.emailAddress || "",
    },
    {
      title: "BVN",
      value: client?.clients?.bvn || "",
    },
  ];

  const employmentInformations = [
    {
      title: "Organization",
      value: client?.clientEmployers?.[0]?.employer?.name || "",
      required: true,
    },
    {
      title: "State",
      value: client?.clientEmployers?.[0]?.state?.name || "",
    },
    {
      title: "LGA",
      value: client?.clientEmployers?.[0]?.lga?.name || "",
    },
    {
      title: "Address",
      value: client?.clientEmployers?.[0]?.officeAddress || "",
    },
    {
      title: "Nearest Landmark",
      value: client?.clientEmployers?.[0]?.nearestLandMark || "",
    },
    {
      title: "Employer’s Phone Number",
      value: client?.clientEmployers?.[0]?.mobileNo || "",
    },
    {
      title: "Staff ID",
      value: client?.clientEmployers?.[0]?.staffId || "",
    },
    {
      title: "Job Role/Grade",
      value: client?.clientEmployers?.[0]?.jobGrade || "",
      required: true,
    },
    {
      title: "Employment Type",
      value: client?.clientEmployers?.[0]?.employmentStatus?.name || "",
    },
    {
      title: "Date of Employment",
      value:
        parseDateToString(client?.clientEmployers?.[0]?.employmentDate) || "",
      required: true,
    },
    {
      title: "Work Email",
      value: client?.clientEmployers?.[0]?.emailAddress || "",
    },
    {
      title: "Work Email Verified",
      value: (
        <ClientXLeadStatusChip
          color={
            client?.clientEmployers?.[0]?.workEmailVerified
              ? "success"
              : "warning"
          }
          label={
            client?.clientEmployers?.[0]?.workEmailVerified
              ? "Verified"
              : "Unverified"
          }
        />
      ),
    },
    {
      title: "Salary Range",
      value: client?.clientEmployers?.[0]?.salaryRange?.name || "",
    },
    {
      title: "Salary Payment day",
      value:
        parseDateToString(
          client?.clientEmployers?.[0]?.nextMonthSalaryPaymentDate
        ) || "",
      required: true,
    },
  ];

  const residentialInformations = [
    {
      title: "Permanent Residential State",
      value: client?.addresses?.[0]?.stateName || "",
      required: true,
    },
    {
      title: "LGA",
      value: client?.addresses?.[0]?.lga || "",
      required: true,
    },
    {
      title: "Permanent Address",
      value: client?.addresses?.[0]?.addressLine1 || "",
    },
    {
      title: "Nearest Landmark",
      value: client?.addresses?.[0]?.nearestLandMark || "",
    },
    {
      title: "Residential Status",
      value: client?.addresses?.[0]?.residentStatus || "",
      required: true,
    },
    {
      title: "Date moved in",
      value: parseDateToString(client?.addresses?.[0]?.dateMovedIn) || "",
      required: true,
    },
  ];

  const nextOfKin = [
    {
      title: "Title",
      value: client?.familyMembers?.[0]?.title || "",
    },
    {
      title: "First Name",
      value: client?.familyMembers?.[0]?.firstName || "",
      required: true,
    },
    {
      title: "Middle Name",
      value: client?.familyMembers?.[0]?.middleName || "",
    },
    {
      title: "Last Name",
      value: client?.familyMembers?.[0]?.lastName || "",
    },
    {
      title: "Relationship",
      value: client?.familyMembers?.[0]?.relationship || "",
      required: true,
    },
    // {
    //   title: "Gender",
    //   value: client?.familyMembers?.[0]?.gender || "",
    // },
    // {
    //   title: "DOB",
    //   value: parseDateToString(client?.familyMembers?.[0]?.dateOfBirth) || "",
    // },
    {
      title: "Marital Status",
      value: client?.familyMembers?.[0]?.maritalStatus || "",
    },
    // {
    //   title: "No. Of Dependent",
    //   value: client?.familyMembers?.[0]?.noOfDependent || "",
    // },
    {
      title: "Phone Number",
      value: client?.familyMembers?.[0]?.mobileNumber || "",
      required: true,
    },
    {
      title: "Email Address",
      value: client?.familyMembers?.[0]?.emailAddress || "",
    },
  ];

  const nextOfKinAddress = [
    {
      title: "Permanent Residential State",
      value: client?.addresses?.[1]?.stateName || "",
      required: true,
    },
    {
      title: "LGA",
      value: client?.addresses?.[1]?.lga || "",
      required: true,
    },
    {
      title: "Permanent Address",
      value: client?.addresses?.[1]?.addressLine1 || "",
    },
    {
      title: "Nearest Landmark",
      value: client?.addresses?.[1]?.nearestLandMark || "",
    },
    {
      title: "Residential Status",
      value: client?.addresses?.[1]?.residentStatus || "",
      required: true,
    },
    {
      title: "Date moved in",
      value: parseDateToString(client?.addresses?.[1]?.dateMovedIn) || "",
      required: true,
    },
  ];

  const bankInformation = [
    {
      title: "Bank",
      value: client?.clientBanks?.[0]?.bank?.name || "",
      required: true,
    },
    {
      title: "Account Number",
      value: client?.clientBanks?.[0]?.accountnumber || "",
      required: true,
    },
    {
      title: "Account Name",
      value: client?.clientBanks?.[0]?.accountname || "",
    },
    {
      title: "Bank Verification",
      value: (
        <ClientXLeadStatusChip
          color={client?.clientBanks?.[0]?.active ? "success" : "warning"}
          label={client?.clientBanks?.[0]?.active ? "Verified" : "Unverified"}
        />
      ),
    },
  ];

  const clientIdentifiers =
    client?.clientIdentifiers?.length >= 1
      ? client?.clientIdentifiers?.map((identifier, i) => ({
          title: identifier?.documentType?.name || `Document ${i}`,
          value: identifier?.attachment?.location || "",
        }))
      : [];

  const documentUpload = [
    {
      title: "Passport Photograph",
      value: client?.avatar || "",
    },
    ...clientIdentifiers,
  ];

  const closePreview = (id) => {
    setPreviewOpen({ [id]: false });
  };

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

      {/* Next of kin Information */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" color="primary">
              <b>Next of Kin</b>
            </Typography>
            <Button
              onClick={() => goToStep(4)}
              variant="text"
              endIcon={<EditSvg />}
            >
              <b>Edit</b>
            </Button>
          </div>

          <Box mt={2}>
            <Grid container>
              {nextOfKin.map((data, i) => (
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
      {/*  Next of kin information */}

      {/* Next of Address */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" color="primary">
              <b>Next of Kin Address</b>
            </Typography>
            <Button
              onClick={() => goToStep(4)}
              variant="text"
              endIcon={<EditSvg />}
            >
              <b>Edit</b>
            </Button>
          </div>

          <Box mt={2}>
            <Grid container>
              {nextOfKinAddress.map((data, i) => (
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
      {/*  Next of Address */}

      {/* Bank Information */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" color="primary">
              <b>Bank Information</b>
            </Typography>
            <Button
              onClick={() => goToStep(5)}
              variant="text"
              endIcon={<EditSvg />}
            >
              <b>Edit</b>
            </Button>
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

      {/* Document upload */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" color="primary">
              <b>Document Uploads</b>
            </Typography>
            <Button
              onClick={() => goToStep(6)}
              variant="text"
              endIcon={<EditSvg />}
            >
              <b>Edit</b>
            </Button>
          </div>

          <Box mt={2}>
            {documentUpload.map((data, i) => (
              <div className="max-w-2xl mt-5">
                <Grid container alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="caption" key={i}>
                      {data.title}
                    </Typography>
                    {/* <Typography variant="body1">{data.value}</Typography> */}
                  </Grid>

                  <Grid item xs={2}>
                    <Button
                      onClick={() => setPreviewOpen({ [i]: true })}
                      variant="outlined"
                    >
                      Preview
                    </Button>
                    {previewOpen[i] &&
                      (getBase64FileType(data?.value) === "pdf" ? (
                        <PdfPreviewerModal
                          open={previewOpen[i]}
                          title={data?.title}
                          fileUrl={data?.value}
                          size="md"
                          onClose={() => closePreview(i)}
                        />
                      ) : (
                        <Lightbox
                          alt={data?.title}
                          medium={data?.value}
                          large={data?.value}
                          onClose={() => closePreview(i)}
                        />
                      ))}
                  </Grid>
                </Grid>
              </div>
            ))}
          </Box>
        </div>
      </Paper>
      {/*  Document upload  */}
    </div>
  );
}

export default CRMClientAddEditFormPreview;
