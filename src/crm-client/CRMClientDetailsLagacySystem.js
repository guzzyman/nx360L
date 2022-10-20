import React from "react";
import Modal from "common/Modal";
import { Avatar, Button, Chip, Typography } from "@mui/material";
import { format, isValid } from "date-fns";
import {
  ClientXLeadStatusNameColorEnum,
  LagacySystemsEnum,
} from "client-x-lead/ClientXLeadConstants";
import { nimbleX360MambuApi } from "common/StoreQuerySlice";
import LoadingContent from "common/LoadingContent";

export default function CRMClientDetailsLagacySystem(props) {
  const { onClose, clientQueryResult, ...rest } = props;
  const mambu =
    clientQueryResult?.data?.clients?.sourceName?.toLocaleLowerCase() ===
    LagacySystemsEnum.MAMBU;

  const id = clientQueryResult?.data?.clients?.sourceId;

  const mambuClientDataQuery =
    nimbleX360MambuApi.useGetMambuCustomerDetailsQuery(id, { skip: !mambu });
  const mosulendClientDataQuery =
    nimbleX360MambuApi.useGetMosulendCustomerDetailsQuery(id, { skip: mambu });

  const clientData = mambu
    ? mambuClientDataQuery?.data?.data
    : mosulendClientDataQuery?.data?.data;

  const mambuClientInformation = [
    {
      title: "general",
      data: [
        {
          name: "Full Name",
          value:
            `${clientData?.client?.firstname || ""} ${
              clientData?.client?.middlename || ""
            } ${clientData?.client?.lastname || ""}` || "___",
        },
        {
          name: "Email Address",
          value: clientData?.client?.emailaddress || "___",
        },
        {
          name: "ID",
          value: clientData?.client?.id || "___",
        },
        {
          name: "Date Created",
          value: clientData?.client?.creationdate || "___",
          date: true,
        },
        {
          name: "Activation Date",
          value: clientData?.client?.activationdate || "___",
          date: true,
        },
        {
          name: "Closed Date",
          value: clientData?.client?.closeddate || "___",
          date: true,
        },
        {
          name: "Closed Date",
          value: clientData?.client?.closeddate || "___",
          date: true,
        },
        {
          name: "Last Modified",
          value: clientData?.client?.lastmodifieddate || "___",
          date: true,
        },
        {
          name: "Assigned To Branch",
          value: clientData?.mambuEmploymentDetails?.officeLocation || "___",
        },
        {
          name: "Assigned To Employer",
          value: clientData?.mambuEmploymentDetails?.employeeNumber || "___",
        },
        // {
        //   name: "Assigned To Credit Officer",
        //   value: "client",
        // },
        {
          name: "Client Status",
          value: clientData?.client?.state || "",
          status: true,
        },
        {
          name: "Approved Date",
          value: clientData?.client?.approveddate || "___",
        },
      ],
    },
    {
      title: "Employment Details",
      data: [
        {
          name: "Netpay",
          value: clientData?.mambuEmploymentDetails?.netPay || "___",
        },
        {
          name: "Salary Payment Date",
          value: clientData?.mambuEmploymentDetails?.salaryPaymentDate || "___",
          date: true,
        },
        {
          name: "Employee Number",
          value: clientData?.mambuEmploymentDetails?.employeeNumber || "___",
        },
        {
          name: "Job Description",
          value: clientData?.mambuEmploymentDetails?.jobDescription || "___",
        },
        {
          name: "Office Location",
          value: clientData?.mambuEmploymentDetails?.officeLocation || "___",
        },
        {
          name: "Office Phone Number LandLine",
          value:
            clientData?.mambuEmploymentDetails?.officeTelephoneNumberLandLine ||
            "___",
        },
        {
          name: "Office Phone Number Mobile",
          value:
            clientData?.mambuEmploymentDetails?.officeTelephoneNumberMobile ||
            "___",
        },
        {
          name: "Employer Email Address",
          value:
            clientData?.mambuEmploymentDetails?.employerEmailAddress || "___",
        },
      ],
    },
    {
      title: "Performance History",
      data: [
        {
          name: "Completed Loan Cycles",
          value: clientData?.client?.loancycle,
        },
      ],
    },
    {
      title: "Personal",
      data: [
        {
          name: "Gender",
          value: clientData?.client?.gender || "___",
        },
        {
          name: "Date Of Birth",
          value: clientData?.client?.birthdate || "___",
        },
        {
          name: "Preffered Language",
          value: clientData?.client?.preferredlanguage || "___",
        },
      ],
    },
    {
      title: "Bank Details",
      data: [
        {
          name: "BVN",
          value: clientData?.bankDetails?.bankVerificationNumber || "___",
        },
        {
          name: "Account Name",
          value: clientData?.bankDetails?.bankAccountName || "___",
        },
        {
          name: "Account Number",
          value: clientData?.bankDetails?.salaryAccountNumber || "___",
        },
        {
          name: "Bank Name",
          value: clientData?.bankDetails?.bank || "___",
        },
      ],
    },
    {
      title: "Contact",
      data: [
        {
          name: "Phone",
          value: clientData?.client?.mobilephonE1 || "___",
        },
        {
          name: "City",
          value: clientData?.address?.city || "___",
        },
        {
          name: "Region",
          value: clientData?.address?.region || "___",
        },
        {
          name: "Address",
          value: clientData?.address?.linE1 || "___",
        },
      ],
    },

    {
      title: "Next Of Kin",
      data: [
        {
          name: "Name",
          value: clientData?.mambuNextOfKin?.nextOfKinName || "___",
        },
        {
          name: "Address",
          value: clientData?.mambuNextOfKin?.nextOfKinAddress || "___",
        },
        {
          name: "Relationship",
          value: clientData?.mambuNextOfKin?.nextOfKinRelationship || "___",
        },
        {
          name: "Phone Number",
          value: clientData?.mambuNextOfKin?.nextOfKinPhoneNumber || "___",
        },
      ],
    },
  ];

  const mosulendClientInformation = [
    {
      title: "general",
      data: [
        {
          name: "Avatar",
          value: <Avatar src={clientData?.Photo} alt={clientData?.SURNAME} />,
        },
        {
          name: "Full Name",
          value:
            `${clientData?.SURNAME || ""}  ${clientData?.OTHER_NAMES || ""}` ||
            "___",
        },
        {
          name: "ID",
          value: clientData?.CUSTID || "___",
        },
        {
          name: "Date Created",
          value: clientData?.DATE_ADDED || "___",
        },
        {
          name: "SN",
          value: clientData?.SN || "___",
        },
        {
          name: "Marital Status",
          value: clientData?.MARITAL_STATUS || "___",
        },
        {
          name: "Number Of Children",
          value: clientData?.NO_OF_CHILDREN || "___",
        },
        {
          name: "Phone Number",
          value: clientData?.PHONE_NUMBER || "___",
        },
        {
          name: "Address",
          value: clientData?.ADDRESS || "___",
        },
        {
          name: "Level Of Account",
          value: clientData?.LevelOfAccount || "___",
        },
      ],
    },
    {
      title: "Personal",
      data: [
        {
          name: "Gender",
          value: clientData?.GENDER || "___",
        },
        {
          name: "Date Of Birth",
          value: clientData?.DATE_OF_BIRTH || "___",
        },
        {
          name: "State Of Origin",
          value: clientData?.StateOfOrigin || "___",
        },
        {
          name: "LGA Of Origin",
          value: clientData?.LgaOfOrigin || "___",
        },
      ],
    },
    {
      title: "Bank Details",
      data: [
        {
          name: "BVN",
          value: clientData?.BVN || "___",
        },
        {
          name: "Name Of Card",
          value: clientData?.NameOnCard || "___",
        },
        {
          name: "Account Name",
          value: clientData?.ACCOUNTNAME || "___",
        },
        {
          name: "Account Number",
          value: clientData?.ACCOUNTNO || "___",
        },
        {
          name: "Bank Name",
          value: clientData?.BANK_NAME || "___",
        },
      ],
    },
    {
      title: "Contact",
      data: [
        {
          name: "Phone",
          value: clientData?.PhoneNumber1 || "___",
        },
        {
          name: "Phone2",
          value: clientData?.PhoneNumber2 || "___",
        },
        {
          name: "state Of Residence",
          value: clientData?.StateOfResidence || "___",
        },
        {
          name: "Nationality",
          value: clientData?.Nationality || "___",
        },
        {
          name: "Address",
          value: clientData?.address?.linE1 || "___",
        },
        {
          name: "Residential Address",
          value: clientData?.ResidentialAddress || "____",
        },
        {
          name: "LGA Of Residence",
          value: clientData?.LgaOfResidence || "____",
        },
      ],
    },
    {
      title: "Next Of Kin",
      data: [
        {
          name: "Name",
          value: clientData?.NEXT_OF_KIN || "___",
        },
        {
          name: "Address",
          value: clientData?.NEXT_OF_KIN_ADDRESS || "___",
        },
        {
          name: "Relationship",
          value: clientData?.RELATIONSHIP_WITH_KIN || "___",
        },
        {
          name: "Phone Number",
          value: clientData?.NEXT_OF_KIN_PHONE || "___",
        },
      ],
    },
  ];

  const clientInformation = mambu
    ? mambuClientInformation
    : mosulendClientInformation;

  return (
    <Modal onClose={onClose} size="lg" title="Client Information" {...rest}>
      <LoadingContent
        error={
          mambu ? mambuClientDataQuery.isError : mosulendClientDataQuery.isError
        }
        loading={
          mambu
            ? mambuClientDataQuery.isFetching
            : mosulendClientDataQuery.isFetching
        }
        onReload={
          mambu ? mambuClientDataQuery.refetch : mosulendClientDataQuery.refetch
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {clientInformation.map((data, i) => (
            <div key={i}>
              <Typography
                variant="body1"
                fullWidth
                className="border-b-2 font-bold capitalize border-gray-200"
                gutterBottom
              >
                {data.title}
              </Typography>
              <div>
                {data.data.map((dataItem, i) => (
                  <div className="grid grid-cols-2 mb-2 gap-3">
                    <Typography>{dataItem.name}</Typography>
                    <Typography>
                      {dataItem?.date &&
                        (isValid(new Date(dataItem?.value))
                          ? format(new Date(dataItem?.value), "PPpp")
                          : "")}

                      {!dataItem?.date && !dataItem.status && dataItem.value}

                      {!dataItem?.date && dataItem.status && (
                        <Chip
                          variant="outlined-opaque"
                          color={ClientXLeadStatusNameColorEnum[dataItem.value]}
                          label={dataItem.value}
                        />
                      )}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-3 justify-center">
          <Button
            color="primary"
            className="max-w-sm"
            fullWidth
            onClick={() => onClose()}
          >
            Close
          </Button>
        </div>
      </LoadingContent>
    </Modal>
  );
}
