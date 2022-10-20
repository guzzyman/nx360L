import { Button, Icon } from "@mui/material";
import { RouteEnum } from "common/Constants";
import PageHeader from "common/PageHeader";
import DynamicTable from "common/DynamicTable";
import SystemSurveyListItem from "./SystemSurveyListItem";
import { useNavigate } from "react-router-dom";
import nimbleX360AdminSystemSurveyApi from "./SystemSurveyQuerySlice";
import useTable from "hooks/useTable";

function SystemSurveys(props) {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } =
    nimbleX360AdminSystemSurveyApi?.useGetAllSurveysQuery();

  const tableInstance = useTable({ columns, data });

  return (
    <>
      <PageHeader
        title="Manage Surveys"
        breadcrumbs={[
          { name: "System", to: RouteEnum.SYSTEM },
          { name: "Manage Surveys" },
        ]}
      >
        <Button
          endIcon={<Icon>add</Icon>}
          onClick={() => navigate(RouteEnum.SURVEYS_ADD)}
        >
          Add New Survey
        </Button>
      </PageHeader>
      <DynamicTable
        instance={tableInstance}
        view={"grid"}
        loading={isLoading}
        error={isError}
        onReload={refetch}
        classes={{
          content: "",
        }}
        renderItem={(row) => {
          return <SystemSurveyListItem key={row.index} item={row.original} />;
        }}
      />
    </>
  );
}

export default SystemSurveys;

const columns = [{ Header: "Name" }];
