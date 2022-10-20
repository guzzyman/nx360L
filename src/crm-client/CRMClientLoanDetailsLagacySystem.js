import React, { useMemo } from "react";
import Modal from "common/Modal";
import { Button, Chip, Typography } from "@mui/material";
import { format, isValid } from "date-fns";
import {
  ClientXLeadStatusNameColorEnum,
  LagacySystemsEnum,
} from "client-x-lead/ClientXLeadConstants";
import { nimbleX360MambuApi } from "common/StoreQuerySlice";
import LoadingContent from "common/LoadingContent";

export default function CRMClientLoanDetailsLagacySystem(props) {
  const { onClose, clientQueryResult, clientLoanQueryResult, ...rest } = props;

  const mambu =
    clientLoanQueryResult?.data?.sourceName?.toLocaleLowerCase() ===
    LagacySystemsEnum.MAMBU;

  const sourceId = clientLoanQueryResult?.data?.sourceId;
  const clientId = clientQueryResult?.data?.clients?.sourceId;

  return (
    <Modal onClose={onClose} size="lg" title="Loan Information" {...rest}>
      {mambu && (
        <CRMClientLoanDetailsLagacySystemMumbu
          sourceId={sourceId}
          clientId={clientId}
        />
      )}
      {!mambu && (
        <CRMClientLoanDetailsLagacySystemMoselend
          sourceId={sourceId}
          clientId={clientId}
        />
      )}

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
    </Modal>
  );
}

function CRMClientLoanDetailsLagacySystemMumbu(props) {
  const { sourceId, clientId } = props;

  const loanListQuery = nimbleX360MambuApi.useGetMambuLoansQuery(clientId, {
    skip: !clientId,
  });
  const loanCommentsQuery = nimbleX360MambuApi.useGetMambuLoanCommentsQuery(
    sourceId,
    {
      skip: !sourceId,
    }
  );
  const loanSettlementsQuery =
    nimbleX360MambuApi.useGetMambuLoanActivitiesQuery(sourceId, {
      skip: !sourceId,
    });

  const loanProcessQuery = nimbleX360MambuApi.useGetMambuLoanTransactionsQuery(
    sourceId,
    {
      skip: !sourceId,
    }
  );

  const loanListData = loanListQuery?.data?.data?.filter(
    (data, i) => data.encodedkey === sourceId
  )?.[0];

  const loanCommentsData = loanCommentsQuery?.data?.data;
  const loanSettlementsData = loanSettlementsQuery?.data?.data;
  const loanProcessData = loanProcessQuery?.data?.data;

  const clientInformation = [
    {
      title: "general",
      data: [
        {
          name: "Loan Name",
          value: loanListData?.loanname || "_",
        },
        {
          name: "Loan Amount",
          value: loanListData?.loanamount || "",
        },
        {
          name: "Client Type",
          value: loanListData?.accountholdertype || "",
        },
        {
          name: "Client Status",
          value: loanListData?.accountstate || "",
          status: true,
        },
        {
          name: "Closed Date",
          value: loanListData?.closeddate || "",
          date: true,
        },
        {
          name: "Creation Date",
          value: loanListData?.creationdate || "",
          date: true,
        },
        {
          name: "Approved Date",
          value: loanListData?.approveddate || "",
          date: true,
        },
        {
          name: "Loan Repayment Installment",
          value: loanListData?.repaymentinstallments || "",
        },
        {
          name: "Loan Repayment Installment",
          value: loanListData?.repaymentinstallments || "",
        },
        {
          name: "Loan Repayment Period Count",
          value: loanListData?.repaymentperiodcount || "",
        },
        {
          name: "Loan Repayment Period Unit",
          value: loanListData?.repaymentperiodunit || "",
        },
        {
          name: "Loan Repayment Method",
          value: loanListData?.repaymentschedulemethod || "",
        },
        {
          name: "Scheduled Date Method",
          value: loanListData?.scheduleduedatesmethod || "",
        },
        {
          name: "Tax Rate",
          value: loanListData?.taxrate || "0",
        },
        {
          name: "Redraw Balace",
          value: loanListData?.redrawbalance || "0",
        },
        {
          name: "Prepayment Acceptance",
          value: loanListData?.prepaymentacceptance || "0",
        },
        {
          name: "Loan Amount",
          value: loanListData?.amount || "0",
        },
        {
          name: "Loan Balance",
          value: loanListData?.balance || "0",
        },
        {
          name: "Loan Type",
          value: loanListData?.type || "___",
        },
        {
          name: "Principle Balance",
          value: loanListData?.principalbalance || "0",
        },
        {
          name: "Principle Amount",
          value: loanListData?.principalamount || "0",
        },
        {
          name: "Interest Rate",
          value: loanListData?.interestrate || "0",
        },
        {
          name: "Interest Amount",
          value: loanListData?.interestamount || "0",
        },
        {
          name: "Comment",
          value: loanListData?.comment || "___",
        },
      ],
    },
    {
      title: "Loan Activities",
      data: [
        {
          name: "TeleCall Status",
          value: loanSettlementsData?.telecallStatus || "",
        },
        {
          name: "Telecaller Name",
          value: loanSettlementsData?.teleCallerName || "",
        },
        {
          name: "Telecaller Date",
          value: loanSettlementsData?.telecallDate || "",
        },
        {
          name: "Office Visitation Status",
          value: loanSettlementsData?.officeVisitationStatus || "",
        },
        {
          name: "Visitation Done By",
          value: loanSettlementsData?.visitationDoneBy || "",
        },
        {
          name: "Recovery Status",
          value: loanSettlementsData?.recoveryStatus || "",
        },
        {
          name: "Recovery Updated By",
          value: loanSettlementsData?.recoveryUpdateBy || "",
        },
        {
          name: "Recovery Updated By",
          value: loanSettlementsData?.recoveryActivityDate || "",
        },
        {
          name: "Recovery Activity Date",
          value: loanSettlementsData?.recoveryActivityDate || "",
        },
        {
          name: "PTP Amount",
          value: loanSettlementsData?.ptpAmount || "",
        },
        {
          name: "PTP Mode",
          value: loanSettlementsData?.ptpMode || "",
        },
        {
          name: "PTP Date",
          value: loanSettlementsData?.ptpDate || "",
          date: true,
        },
        {
          name: "Default Reasons",
          value: loanSettlementsData?.defaultReasons || "",
        },
        {
          name: "Collection Status Old",
          value: loanSettlementsData?.collectionStatusOld || "",
        },
      ],
    },
  ];

  const loanCommentsInformation = useMemo(
    () =>
      loanCommentsData?.length
        ? loanCommentsData?.reduce((acc, value) => {
            return acc.concat([
              [
                {
                  name: "Title",
                  value: value?.TITLE || "_",
                },
                {
                  name: "Username",
                  value: value?.USERNAME || "_",
                },
                {
                  name: "Created Date",
                  value: value?.CREATIONDATE || "",
                  date: true,
                },
                {
                  name: "Last Modified Date",
                  value: value?.LASTMODIFIEDDATE || "",
                  date: true,
                },
                {
                  name: "Description",
                  value: value?.TEXT || "_",
                },
                {
                  name: "Officer Comment",
                  value: value?.OfficerComment || "_",
                },
              ],
            ]);
          }, [])
        : "",
    [loanCommentsData]
  );

  const loanProcessInformation = useMemo(
    () =>
      loanProcessData?.length
        ? loanProcessData?.reduce((acc, value) => {
            return acc.concat([
              [
                {
                  name: "Amount",
                  value: value?.amount || "",
                },
                {
                  name: "Balance",
                  value: value?.balance || "",
                },
                {
                  name: "Type",
                  value: value?.type || "",
                },
                {
                  name: "Entry Date",
                  value: value?.entrydate || "",
                  date: true,
                },
                {
                  name: "Principal Amount",
                  value: value?.principalamount || "",
                },
                {
                  name: "Interest Amount",
                  value: value?.interestamount || "",
                },
                {
                  name: "Fees Amount",
                  value: value?.feesamount || "",
                },
                {
                  name: "Penalty Amount",
                  value: value?.penaltyamount || "",
                },
                {
                  name: "Tax Interest amount",
                  value: value?.taxoninterestamount || "",
                },
                {
                  name: "Deferred Interest Amount",
                  value: value?.deferredinterestamount || "",
                },
                {
                  name: "Deferred Tax Interest Amount",
                  value: value?.deferredtaxoninterestamount || "",
                },
                {
                  name: "Tax on Fees Amount",
                  value: value?.taxonfeesamount || "",
                },
                {
                  name: "Tax on Penalty Amount",
                  value: value?.taxonpenaltyamount || "",
                },
                {
                  name: "Product Type Key",
                  value: value?.producttypekey || "",
                },
                {
                  name: "Redraw Balance",
                  value: value?.redrawbalance || "",
                },
                {
                  name: "Principal Balance",
                  value: value?.principalbalance || "",
                },
                {
                  name: "Advance Position",
                  value: value?.advanceposition || "",
                },
                {
                  name: "Advance Position",
                  value: value?.advanceposition || "",
                },
                {
                  name: "External Id",
                  value: value?.externalid || "",
                },
              ],
            ]);
          }, [])
        : "",
    [loanProcessData]
  );

  return (
    <div>
      <LoadingContent
        error={loanListQuery.isError}
        loading={loanListQuery?.isFetching}
        onReload={loanListQuery.refetch}
      >
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-10">
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
                      {!dataItem.date && !dataItem.status && dataItem.value}

                      {!dataItem.date && dataItem.status && (
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
      </LoadingContent>

      <hr></hr>
      <LoadingContent
        error={loanProcessQuery.isError}
        loading={loanProcessQuery?.isFetching}
        onReload={loanProcessQuery.refetch}
      >
        <div className="mt-5">
          <Typography variant="h6" className="text-center" gutterBottom>
            Loan Transactions
          </Typography>

          <div className="grid grid-cols-1 gap-10">
            {loanProcessInformation &&
              loanProcessInformation?.map((data, i) => (
                <div key={i}>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {data?.map((dataItem, i) => (
                      <div className="grid grid-cols-2">
                        <Typography>{dataItem.name}</Typography>
                        <Typography>
                          {dataItem?.date &&
                            (isValid(new Date(dataItem?.value))
                              ? format(new Date(dataItem?.value), "PPpp")
                              : "")}
                          {!dataItem.date && !dataItem.status && dataItem.value}

                          {!dataItem.date && dataItem.status && (
                            <Chip
                              variant="outlined-opaque"
                              color={
                                ClientXLeadStatusNameColorEnum[dataItem.value]
                              }
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
        </div>
      </LoadingContent>

      <hr></hr>

      <LoadingContent
        error={loanCommentsQuery.isError}
        loading={loanCommentsQuery?.isFetching}
        onReload={loanCommentsQuery.refetch}
      >
        <div className="mt-5">
          <Typography variant="h6" className="text-center" gutterBottom>
            Loan Comments
          </Typography>

          <div className="grid grid-cols-1">
            {loanCommentsInformation &&
              loanCommentsInformation?.map((data, i) => (
                <div key={i}>
                  <div className="mb-10">
                    {data?.map((dataItem, i) => (
                      <div className="grid grid-cols-2">
                        <Typography>{dataItem.name}</Typography>
                        <Typography>
                          {dataItem?.date &&
                            (isValid(new Date(dataItem?.value))
                              ? format(new Date(dataItem?.value), "PPpp")
                              : "")}
                          {!dataItem.date && !dataItem.status && dataItem.value}

                          {!dataItem.date && dataItem.status && (
                            <Chip
                              variant="outlined-opaque"
                              color={
                                ClientXLeadStatusNameColorEnum[dataItem.value]
                              }
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
        </div>
      </LoadingContent>
    </div>
  );
}

function CRMClientLoanDetailsLagacySystemMoselend(props) {
  const { sourceId, clientId } = props;

  const loanListQuery = nimbleX360MambuApi.useGetMosulendLoanQuery(clientId, {
    skip: !clientId,
  });

  const loanListData = loanListQuery?.data?.data?.filter(
    (data) => parseInt(data.LOANID) === parseInt(sourceId)
  )?.[0];

  console.log("loanListData", loanListData);

  const loanSettlementsQuery =
    nimbleX360MambuApi.useGetMosulendLoanSettlementQuery(sourceId, {
      skip: !sourceId,
    });

  const loanProcessQuery = nimbleX360MambuApi.useGetMosulendLoanProcessQuery(
    sourceId,
    {
      skip: !sourceId,
    }
  );

  const loanSettlementsData = loanSettlementsQuery?.data?.data;
  const loanProcessData = loanProcessQuery?.data?.data;

  const clientInformation = [
    {
      title: "general",
      data: [
        {
          name: "Loan ID",
          value: loanListData?.LOANID || "_",
        },
        {
          name: "Loan Amount",
          value: loanListData?.LOAN_AMOUNT || "_",
        },
        {
          name: "Monthly Installment",
          value: loanListData?.MONTHLY_INSTALLMENT || "_",
        },
        {
          name: "Settlement Date",
          value: loanListData?.SETTLEMENT_DATE || "",
          date: true,
        },
        {
          name: "Creation Date",
          value: loanListData?.CREATION_DATE || "",
          date: true,
        },
        {
          name: "Tenure",
          value: loanListData?.TENOR || "_",
        },
        {
          name: "Rate",
          value: loanListData?.RATE || "_",
        },
        {
          name: "Effective Rate",
          value: loanListData?.EFFECTIVE_RATE || "_",
        },
        {
          name: "Category",
          value: loanListData?.CATEGORY || "_",
        },
        {
          name: "Topup",
          value: loanListData?.TOPUP || "_",
        },
        {
          name: "Available Amount",
          value: loanListData?.AVAIL_AMOUNT || "_",
        },
        {
          name: "Approved Limit",
          value: loanListData?.APPROVED_LIMIT || "_",
        },
        {
          name: "Loan Usage",
          value: loanListData?.LOAN_USAGE || "_",
        },
        {
          name: "Insured",
          value: loanListData?.INSURED || "_",
        },
        {
          name: "CRC",
          value: loanListData?.CRC || "_",
        },
      ],
    },
    {
      title: "Loan Settlements",
      data: [
        {
          name: "Loan Type",
          value: loanSettlementsData?.TYPE || "",
        },
        {
          name: "Date Entered",
          value: loanSettlementsData?.DATE_ENTERED || "",
          date: true,
        },
        {
          name: "Created Date",
          value: loanSettlementsData?.CREATION_DATE || "",
          date: true,
        },
        {
          name: "Settlement Date",
          value: loanSettlementsData?.SETTLEMENT_DATE || "",
          date: true,
        },
        {
          name: "Loan Amount",
          value: loanSettlementsData?.LOAN_AMOUNT || "",
        },
        {
          name: "Loan Tenure",
          value: loanSettlementsData?.LOAN_TENOR || "",
        },
        {
          name: "Amount Settled",
          value: loanSettlementsData?.AMOUNT_SETTLED || "",
        },
        {
          name: "Interest On Settlements",
          value: loanSettlementsData?.INTEREST_ON_SETTLEMENT || "",
        },
        {
          name: "Other Names",
          value: loanSettlementsData?.OTHER_NAMES || "",
        },
        {
          name: "Surnames",
          value: loanSettlementsData?.SURNAME || "",
        },
        {
          name: "EMployer Name",
          value: loanSettlementsData?.EMPLOYER_NAME || "",
        },
        {
          name: "EMployer Type",
          value: loanSettlementsData?.EMPLOYER_TYPE || "",
        },
        {
          name: "STatus",
          value: loanSettlementsData?.STATUS || "",
        },
        {
          name: "Sex",
          value: loanSettlementsData?.SEX || "",
        },
        {
          name: "Loan Duration",
          value: loanSettlementsData?.LOAN_DURATION || "",
        },
        {
          name: "Differential",
          value: loanSettlementsData?.DIFFERENTIAL || "",
        },
      ],
    },
  ];

  console.log("loanProcessQuery", loanProcessQuery);

  const loanProcessInformation = useMemo(
    () =>
      loanProcessData?.length
        ? loanProcessData?.reduce((acc, value) => {
            return acc.concat([
              [
                {
                  name: "Staff ID",
                  value: value?.STAFFID || "",
                },
                {
                  name: "Date Processed",
                  value: value?.DATE_PROCESS || "",
                  date: true,
                },
                {
                  name: "Status",
                  value: value?.STATUS || "",
                  status: true,
                },
                {
                  name: "Outletid",
                  value: value?.OUTLETID || "",
                },
                {
                  name: "Active",
                  value: value?.ACTIVE ? "ACTIVE" : "INACTIVE",
                  status: true,
                },
                {
                  name: "REASON",
                  value: value?.REASON || "",
                },
                {
                  name: "Assets Status",
                  value: value?.ASSET_STATUS || "",
                  status: true,
                },
                {
                  name: "Reconcile Date",
                  value: value?.RECONCILE_DATE || "",
                },
                {
                  name: "Outlet Name",
                  value: value?.OUTLET_NAME || "",
                },
                {
                  name: "State Name",
                  value: value?.STATE_NAME || "",
                },
                {
                  name: "Sales Zone",
                  value: value?.SALES_ZONE || "",
                },
                {
                  name: "State Office",
                  value: value?.STATE_OFFICE || "",
                },
                {
                  name: "Region Name",
                  value: value?.REGION_NAME || "",
                },
                {
                  name: "Region Name",
                  value: value?.REGION_NAME || "",
                },
                {
                  name: "Sales Region",
                  value: value?.SALES_REGION || "",
                },
                {
                  name: "District",
                  value: value?.DISTRICT || "",
                },
                {
                  name: "Address",
                  value: value?.ADDRESS || "",
                },
                {
                  name: "CRC Outlet Id",
                  value: value?.CRC_OUTLETID || "",
                },
                {
                  name: "Comment",
                  value: value?.COMMENT || "",
                },
              ],
            ]);
          }, [])
        : "",
    [loanProcessData]
  );

  return (
    <div>
      <LoadingContent
        error={loanListQuery.isError}
        loading={loanListQuery?.isFetching}
        onReload={loanListQuery.refetch}
      >
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-10">
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
                      {!dataItem.date && !dataItem.status && dataItem.value}

                      {!dataItem.date && dataItem.status && (
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
      </LoadingContent>

      <hr></hr>
      <LoadingContent
        error={loanProcessQuery.isError}
        loading={loanProcessQuery?.isFetching}
        onReload={loanProcessQuery.refetch}
      >
        <div className="mt-5">
          <Typography variant="h6" className="text-center" gutterBottom>
            Loan Process
          </Typography>

          <div className="grid grid-cols-1 gap-10">
            {loanProcessInformation &&
              loanProcessInformation?.map((data, i) => (
                <div key={i}>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {data?.map((dataItem, i) => (
                      <div className="grid grid-cols-2 mb-1">
                        <Typography>{dataItem.name}</Typography>
                        <Typography>
                          {dataItem?.date &&
                            (isValid(new Date(dataItem?.value))
                              ? format(new Date(dataItem?.value), "PPpp")
                              : "")}
                          {!dataItem.date && !dataItem.status && dataItem.value}

                          {!dataItem.date && dataItem.status && (
                            <Chip
                              variant="outlined-opaque"
                              color={
                                ClientXLeadStatusNameColorEnum[dataItem.value]
                              }
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
        </div>
      </LoadingContent>
    </div>
  );
}
