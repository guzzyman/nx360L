import {
  Icon,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LoadingContent from "common/LoadingContent";
import { nxClientSurveyApi } from "./ClientXLeadXEmployerSurveyStoreQuerySlice";
import dfnFormat from "date-fns/format";
import { useMemo, useState } from "react";
import { AnswerTypeEnum } from "./ClientXLeadXEmployerSurveyConstants";

function ClientXLeadXEmployerSurveyPreview({
  client,
  surveyPreviewId,
  setSurveyPreviewId,
}) {
  const [selectedDate, setSelectedDate] = useState("");

  const { data, isLoading, isError, refetch } =
    nxClientSurveyApi.useGetClientSurveyQuery({
      clientId: client?.clients?.id,
      surveyId: surveyPreviewId,
    });

  const { normalizedSubmissions, options } = useMemo(() => {
    const normalizedSubmissions =
      data?.reduce((acc, curr) => {
        acc[
          dfnFormat(curr.scorecardValues[0].createdOn, "dd MMM yyyy - HH:mm")
        ] = curr;
        return acc;
      }, {}) || {};
    const options = Object.keys(normalizedSubmissions);
    setSelectedDate(options[0]);
    return { normalizedSubmissions, options };
  }, [data]);

  const survey = normalizedSubmissions?.[selectedDate];

  return (
    <LoadingContent loading={isLoading} error={isError} onReload={refetch}>
      {() => (
        <Paper className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <IconButton edge="start" onClick={() => setSurveyPreviewId(-1)}>
              <Icon>arrow_back_ios_new</Icon>
            </IconButton>
            <Typography variant="h6" className="font-bold">
              {survey?.surveyName}
            </Typography>
            <TextField
              style={{ maxWidth: 200 }}
              fullWidth
              select
              required
              size="small"
              label="Select Date"
              displayEmpty
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
            >
              {options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {survey?.scorecardValues?.map((scorecardValue) => {
              const normalizedResponseData =
                scorecardValue.questionData.responseDatas?.reduce(
                  (acc, curr) => {
                    acc[curr.id] = curr;
                    return acc;
                  },
                  {}
                ) || {};
              return (
                <div>
                  <div className="mb-2">
                    <Typography className="font-bold">
                      {scorecardValue.questionData.text}
                    </Typography>
                    {scorecardValue.questionData.description ? (
                      <Typography variant="body2" color="textSecondary">
                        {scorecardValue.questionData.description}
                      </Typography>
                    ) : null}
                  </div>
                  <div>
                    {scorecardValue.questionData.isMultiAnswer ===
                    AnswerTypeEnum.MULTIPLE ? (
                      JSON.parse(scorecardValue.multiScore)?.map((score) => (
                        <Typography gutterBottom>
                          {normalizedResponseData[score.id]?.text}
                        </Typography>
                      ))
                    ) : (
                      <Typography gutterBottom>
                        {scorecardValue.questionData.isMultiAnswer ===
                        AnswerTypeEnum.TEXT
                          ? scorecardValue.multiScore
                          : normalizedResponseData[scorecardValue.responseId]
                              ?.text}
                      </Typography>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Paper>
      )}
    </LoadingContent>
  );
}

export default ClientXLeadXEmployerSurveyPreview;
