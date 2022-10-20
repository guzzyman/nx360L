import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactComponent as EditSvg } from "assets/svgs/edit-icon.svg";
import { nimbleX360Api } from "common/StoreQuerySlice";
import { nimblex360LoginApi } from "login/LoginStoreQuerySlice";
import { useMemo } from "react";
import { nimbleX360CRMEmployerApi } from "./CRMEmployerStoreQuerySlice";

function CRMEmployerAddEditPreview({ formik, setStep, officeType }) {
  const client = formik.values;

  const { data: clientType } = nimblex360LoginApi.useGetCodeValuesQuery(16);
  const { data: employerSector } = nimbleX360Api.useGetCodeValuesQuery(36);
  const { data: employerIndustry } = nimbleX360Api.useGetCodeValuesQuery(39);

  const { data: employerParent, isLoading: employerParentIsLoading } =
    nimbleX360CRMEmployerApi.useGetCRMEmployersQuery({
      selectOnlyParentEmployer: true,
    });

  const { data: stateIdList } = nimbleX360Api.useGetCodeValuesQuery(27);

  const { data: LGAIdList } = nimbleX360Api.useGetStateLGAQuery(
    client?.stateId
  );

  const isPrivateSector = client?.sectorId === 17;
  console.log(
    "client?.parentId",
    employerParent?.pageItems?.find(
      (e) => parseInt(e.id) === parseInt(client?.parentId)
    )?.name
  );

  const employerInformation = useMemo(
    () => [
      {
        title: "Fullname",
        value: client?.name || "",
      },
      {
        title: "Nickname",
        value: client?.slug || "",
      },
      {
        title: "Employer Type",
        value:
          clientType?.find((e) => e.id === client?.clientTypeId)?.name || "",
        required: true,
      },
      {
        title: "Head Office",
        value:
          employerParent?.pageItems?.find(
            (e) => parseInt(e.id) === parseInt(client?.parentId)
          )?.name || `${employerParentIsLoading ? "loading..." : ""}`,
        ...(officeType === 2 && {
          required: true,
        }),
      },
      {
        title: "sector",
        value:
          employerSector?.find((e) => e.id === client?.sectorId)?.name || "",
      },
      {
        title: "industryId",
        value:
          employerIndustry?.find((e) => e.id === client?.industryId)?.name ||
          "",
      },
    ],
    [
      employerParent,
      employerIndustry,
      client,
      officeType,
      clientType,
      employerSector,
      employerParentIsLoading,
    ]
  );

  const employerAddress = [
    {
      title: "rcNumber",
      value: client?.rcNumber || "",
    },
    {
      title: "State",
      value: `${
        stateIdList?.find((e) => e.id === client?.stateId)?.name || ""
      }`,
    },
    {
      title: "LGA",
      value: LGAIdList?.find((e) => e.id === client?.lgaId)?.name || "",
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
      required: isPrivateSector ? true : false,
    },
  ];

  return (
    <div className="pb-10">
      {/* Employer Information */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5" mr={5}>
              <b>Employer Informations</b>
            </Typography>
            <Button
              onClick={() => setStep(0)}
              variant="text"
              endIcon={<EditSvg />}
            />
          </div>

          <Box mt={2}>
            <Grid container>
              {employerInformation.map((data, i) => (
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

      {/* Employment Address */}
      <Paper className="my-10 py-10 px-5 rounded-md">
        <div>
          <div className="flex justify-between">
            <Typography variant="h5">
              <b>Employment Address</b>
            </Typography>
            <Button
              onClick={() => setStep(1)}
              variant="text"
              endIcon={<EditSvg />}
            />
          </div>

          <Box mt={2}>
            <Grid container>
              {employerAddress.map((data, i) => (
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
      {/* End employment Address */}
    </div>
  );
}

export default CRMEmployerAddEditPreview;
