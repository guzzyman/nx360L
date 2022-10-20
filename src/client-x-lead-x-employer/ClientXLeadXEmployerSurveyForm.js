import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Icon,
} from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import { useFormik } from "formik";
import useDataRef from "hooks/useDataRef";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import * as yup from "yup";
import { nxClientSurveyApi } from "./ClientXLeadXEmployerSurveyStoreQuerySlice";

function ClientXLeadXEmployerSurveyForm(props) {
  const {
    surveyId,
    userId,
    clientId,
    onClose,
    useGetClientSurveyTemplatesQuery,
    onSurveySelected,
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [submitClientSurveyMutation, submitClientSurveyMutationResult] =
    nxClientSurveyApi.useSubmitClientSurveyMutation();

  const surveyTemplateQueryResult = useGetClientSurveyTemplatesQuery();

  const surveyTemplate = surveyTemplateQueryResult?.data;

  const normalizedSurveyTemplate = useMemo(
    () =>
      surveyTemplate?.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {}) || {},
    [surveyTemplate]
  );

  const formik = useFormik({
    initialValues: {
      userId,
      clientId,
      surveyId: surveyId || "",
      scorecardValues: {},
    },
    validationSchema: yup.object({
      surveyId: yup.string().label("Survey").required(),
      scorecardValues: yup
        .object({})
        .required()
        .test(
          "isNotEmptyObject",
          // eslint-disable-next-line no-template-curly-in-string
          "${path} must have at least one question",
          (value) => value && !!Object.keys(value || {}).length
        ),
    }),
    onSubmit: async (values) => {
      try {
        const data = await submitClientSurveyMutation({
          ...values,
          scorecardValues: Object.values(values.scorecardValues).map(
            (score) => {
              const newScore = { ...score };
              if (
                newScore.multiScore &&
                typeof newScore.multiScore === "object"
              ) {
                newScore.multiScore = JSON.stringify(
                  Object.values(newScore.multiScore)
                );
              }
              return newScore;
            }
          ),
        }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage || "Survey Submitted Successfully",
          { variant: "success" }
        );
        onClose();
      } catch (error) {
        enqueueSnackbar(
          error?.data?.defaultUserMessage || "Failed to submit survey",
          { variant: "error" }
        );
      }
    },
  });

  const survey = normalizedSurveyTemplate[formik.values.surveyId];

  const dataRef = useDataRef({ onSurveySelected });

  useEffect(() => {
    dataRef.current.onSurveySelected?.(survey);
  }, [dataRef, survey]);

  return (
    <Paper className="p-4">
      <Typography variant="h6" className="font-bold py-5">
        Take Survey
      </Typography>
      {!surveyId && (
        <TextField
          margin="normal"
          className="mb-4"
          style={{ maxWidth: 200 }}
          fullWidth
          select
          required
          label="Survey Name"
          displayEmpty
          {...getTextFieldFormikProps(formik, "surveyId")}
          onChange={(e) => {
            const value = e.target.value;
            formik.setFieldValue("surveyId", value);
            formik.setFieldValue("scorecardValues", {});
          }}
        >
          {surveyTemplate?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      {!!survey ? (
        <div className="flex flex-col gap-x-8 gap-y-4">
          {survey?.questionDatas?.map((question) => {
            const normalizedResponseData =
              question.responseDatas?.reduce((acc, curr) => {
                acc[curr.id] = curr;
                return acc;
              }, {}) || {};
            const scorecardValue = formik.values.scorecardValues[question.id];
            const questionKey = `${question.id}`;

            return (
              <Paper
                elevation={0}
                className="bg-[#F3F8FB]"
                sx={{ backgroundColor: "#F3F8FB" }}
              >
                <Paper
                  elevation={0}
                  className="mb-2 p-3"
                  sx={{ backgroundColor: "#CAE2EF" }}
                >
                  <Typography className="font-bold">{question.text}</Typography>
                  {question.description ? (
                    <Typography variant="body2" color="textSecondary">
                      {/* {question.description} */}
                    </Typography>
                  ) : null}
                </Paper>
                {question.isMultiAnswer === AnswerTypeEnum.MULTIPLE && (
                  <FormGroup className="p-5">
                    {question.responseDatas.map((option, index) => {
                      const multiScore = scorecardValue?.multiScore;
                      const checked = !!multiScore?.[option.id];

                      return (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={(e) => {
                                const newMultiScore = { ...multiScore };

                                if (checked) {
                                  delete newMultiScore[option.id];
                                } else {
                                  newMultiScore[option.id] = {
                                    id: option.id,
                                    value: option.value,
                                  };
                                }

                                if (!Object.keys(newMultiScore).length) {
                                  const newScorecardValues = {
                                    ...formik.values.scorecardValues,
                                  };
                                  delete newScorecardValues[question.id];
                                  formik.setFieldValue(
                                    "scorecardValues",
                                    newScorecardValues
                                  );
                                } else {
                                  formik.setFieldValue(
                                    `scorecardValues.${questionKey}`,
                                    {
                                      questionId: question.id,
                                      responseId: option.id,
                                      value: option.value,
                                      multiScore: newMultiScore,
                                    }
                                  );
                                }
                              }}
                            />
                          }
                          label={option.text}
                        />
                      );
                    })}
                  </FormGroup>
                )}
                {question.isMultiAnswer === AnswerTypeEnum.SINGLE && (
                  <RadioGroup
                    className="p-5"
                    value={scorecardValue?.responseId || ""}
                    onChange={(e) => {
                      const responseId = e.target.value;
                      formik.setFieldValue(`scorecardValues.${questionKey}`, {
                        questionId: question.id,
                        responseId: responseId,
                        value: normalizedResponseData[responseId].value,
                      });
                    }}
                  >
                    {question.responseDatas?.map((option, index) => {
                      return (
                        <FormControlLabel
                          key={index}
                          value={option.id}
                          control={<Radio />}
                          label={option.text}
                        />
                      );
                    })}
                  </RadioGroup>
                )}
                {question.isMultiAnswer === AnswerTypeEnum.TEXT && (
                  <TextField
                    className="p-5"
                    multiline
                    fullWidth
                    maxRows={4}
                    value={scorecardValue?.multiScore || ""}
                    onChange={(e) => {
                      const multiScore = e.target.value;
                      formik.setFieldValue(`scorecardValues.${questionKey}`, {
                        multiScore,
                        questionId: question.id,
                        responseId: question.responseDatas?.[0]?.id,
                        value: question.responseDatas?.[0]?.value,
                      });
                    }}
                  />
                )}
              </Paper>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mb-8">
          <Icon className="text-7xl text-secondary-main">poll</Icon>
          <Typography>Please select a survey to proceed</Typography>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-4">
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loadingPosition="end"
          loading={submitClientSurveyMutationResult.isLoading}
          disabled={
            submitClientSurveyMutationResult.isLoading || !formik.isValid
          }
          endIcon={<></>}
          onClick={formik.handleSubmit}
        >
          Submit
        </LoadingButton>
      </div>
    </Paper>
  );
}

ClientXLeadXEmployerSurveyForm.defaultProps = {
  useGetClientSurveyTemplatesQuery:
    nxClientSurveyApi.useGetClientSurveyTemplatesQuery,
};

export default ClientXLeadXEmployerSurveyForm;

const AnswerTypeEnum = {
  SINGLE: 0,
  MULTIPLE: 1,
  TEXT: 2,
};
