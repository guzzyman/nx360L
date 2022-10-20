import { useMemo, useState } from "react";
import {
  Button,
  Icon,
  Paper,
  ButtonBase,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  RouteEnum,
  TABLE_PAGINATION_DEFAULT,
  UIPermissionEnum,
} from "common/Constants";
import PageHeader from "common/PageHeader";
import { useSearchParams } from "react-router-dom";
import { sequestExceptionApi } from "./ExceptionStoreQuerySlice";
import { urlSearchParamsExtractor } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import ExceptionCreate from "./ExceptionCreate";
import useAuthUser from "hooks/useAuthUser";
import ExceptionPendingOnMe from "./ExceptionPendingOnMe";
import ExceptionPendingOnUnit from "./ExceptionPendingOnUnit";
import ExceptionOutGoingException from "./ExceptionOutGoingException";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function ExceptionList(props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [openModal, setOpenModal] = useState(false);

  const extractedSearchParams = useMemo(
    () =>
      urlSearchParamsExtractor(searchParams, {
        q: "",
        ...TABLE_PAGINATION_DEFAULT,
      }),
    [searchParams]
  );

  const authUser = useAuthUser();
  const authUserStaffId = authUser?.staff?.id;
  const authUserUnitId = authUser?.staff?.organizationUnit?.id;

  const authUserUIPermissionRestrictor = useAuthUserUIPermissionRestrictor();

  const { q, offset, limit } = extractedSearchParams;

  const [debouncedQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });
  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading, isError, refetch } =
    sequestExceptionApi.useGetRecentRequestsQuery({
      offset,
      limit,
      ...(debouncedQ
        ? {
            ticketId: debouncedQ,
            customerType: debouncedQ,
            customerName: debouncedQ,
          }
        : {}),
    });

  const exceptionPendingOnUnit =
    sequestExceptionApi.useGetExceptionPendingOnUnitQuery(authUserUnitId);
  const exceptionPendingOnMe =
    sequestExceptionApi.useGetExceptionPendingOnMeQuery(authUserStaffId); // Pending the time the challenge with organization mapping is resolved, we can use 8 as default
  const outgoingExceptions =
    sequestExceptionApi.useGetOutgoingExceptionsQuery(authUserStaffId);

  const exceptionPendingOnUnitResult = exceptionPendingOnUnit?.data?.data;
  const exceptionPendingOnMeResult = exceptionPendingOnMe?.data?.data;
  const outgoingExceptionsResult = outgoingExceptions?.data?.data;

  const tabs = authUserUIPermissionRestrictor.filter([
    {
      name: "EXCEPTIONS PENDING ON ME",
      content: (
        <ExceptionPendingOnMe
          exceptionPendingOnMeResult={exceptionPendingOnMeResult}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
        />
      ),
      permissions: [UIPermissionEnum.CREATE_JOURNALENTRY_CHECKER],
    },
    {
      name: "EXCEPTIONS PENDING ON UNIT",
      content: (
        <ExceptionPendingOnUnit
          exceptionPendingOnUnitResult={exceptionPendingOnUnitResult}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
        />
      ),
      permissions: [UIPermissionEnum.CREATESCHEDULEEXCEPTIONS_LOAN],
    },
    {
      name: "OUTGOING EXCEPTIONS",
      content: (
        <ExceptionOutGoingException
          outgoingExceptionsResult={outgoingExceptionsResult}
          setSearchParams={setSearchParams}
          extractedSearchParams={extractedSearchParams}
          q={q}
          offset={offset}
          limit={limit}
          requestQueryResult={data?.data}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
        />
      ),
      permissions: [UIPermissionEnum.CREATESCHEDULEEXCEPTIONS_LOAN_CHECKER],
    },
  ]);

  return (
    <>
      {openModal && (
        <ExceptionCreate
          title="New Exception"
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
      <PageHeader
        title="Exceptions"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Sequest", to: RouteEnum.SEQUEST_REQUEST },
          { name: "Exceptions" },
        ]}
      >
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.CREATE_JOURNALENTRY]}
        >
          <Button
            variant="outlined"
            endIcon={<Icon>add</Icon>}
            onClick={() => setOpenModal(true)}
          >
            New Exception Ticket
          </Button>
        </AuthUserUIPermissionRestrictor>
      </PageHeader>
      <Paper className="p-4 md:p-8 mb-4">
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          {tabs?.map((tab, index) => (
            <Tab key={tab.name} value={index} label={tab.name} />
          ))}
        </Tabs>
        <Divider className="mb-3" style={{ marginTop: -1 }} />
        {tabs?.[activeTab]?.content}
      </Paper>
    </>
  );
}

export default ExceptionList;
