import { Button, Paper, Typography, Icon, ButtonBase } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import useTable from "hooks/useTable";
import { nxClientSurveyApi } from "./ClientXLeadXEmployerSurveyStoreQuerySlice";
import dfnFormat from "date-fns/format";
import { DateConfig, UIPermissionEnum } from "common/Constants";
import AuthUserUIPermissionRestrictor from "common/AuthUserUIPermissionRestrictor";

function ClientXLeadXEmployerSurveyList(props) {
  const { client, toggleSurveyForm, setSurveyPreviewId } = props;

  const { data, isLoading, isError, refetch } =
    nxClientSurveyApi.useGetClientSurveysQuery(client?.clients?.id);

  const tableInstance = useTable({ columns, data });

  return (
    <Paper className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Typography variant="h6" className="font-bold">
          Surveys
        </Typography>
        <AuthUserUIPermissionRestrictor
          permissions={[UIPermissionEnum.READ_ClientTrendsByMonth]}
        >
          <Button
            variant="outlined"
            onClick={toggleSurveyForm}
            startIcon={<Icon>add</Icon>}
          >
            Take Survey
          </Button>
        </AuthUserUIPermissionRestrictor>
      </div>
      <AuthUserUIPermissionRestrictor
        permissions={[UIPermissionEnum.READ_ClientTrendsByDay]}
      >
        <DynamicTable
          instance={tableInstance}
          loading={isLoading}
          error={isError}
          onReload={refetch}
          RowComponent={ButtonBase}
          rowProps={(row) => ({
            onClick: () => setSurveyPreviewId(row.original.surveyId),
          })}
        />
      </AuthUserUIPermissionRestrictor>
    </Paper>
  );
}

export default ClientXLeadXEmployerSurveyList;

const columns = [
  { Header: "Survey", accessor: "surveyName" },
  {
    Header: "Date",
    accessor: (row) =>
      dfnFormat(
        row?.scorecardValues?.[0]?.createdOn || Date.now(),
        DateConfig.FORMAT
      ),
  },
  { Header: "Credit Score", accessor: "totalCreditScore" },
];
