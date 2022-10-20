import { useEffect } from "react";
import {
  Paper,
  TextField,
  Typography,
  Button,
  Checkbox,
  Icon,
  FormControlLabel,
  IconButton,
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import {
  generateUUIDV4,
  getTextFieldFormikProps,
  getCheckFieldFormikProps,
  removeEmptyProperties,
  excludeProperties,
} from "common/Utils";
import { useFormik } from "formik";
import * as yup from "yup";
import PageHeader from "common/PageHeader";
import BackButton from "common/BackButton";
import { useNavigate, useParams } from "react-router-dom";
import nimbleX360AdminSystemSurveyApi from "./SystemSurveyQuerySlice";
import { RouteEnum } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";

function SystemSurveyCreateEdit() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = !!id;

  const [createSurveyMutation, createSurveyMutationResult] =
    nimbleX360AdminSystemSurveyApi.useCreateSurveyMutation();

  const [updateSurveyMutation, updateSurveyMutationResult] =
    nimbleX360AdminSystemSurveyApi.useUpdateSurveyMutation();

  const surveyQueryResult = nimbleX360AdminSystemSurveyApi.useGetSurveyQuery(
    id,
    { skip: !isEdit }
  );

  const survey = surveyQueryResult?.data;

  const formik = useFormik({
    initialValues: {
      key: generateUUIDV4().slice(24),
      name: "",
      countryCode: "234",
      description: "",
      questionDatas: [],
    },
    validationSchema: yup.object({
      key: yup.string().label("Key").trim().required(),
      name: yup.string().label("Name").trim().required(),
      countryCode: yup.string().label("Country Code").trim().required(),
      description: yup.string().label("Description").trim().optional(),
      questionDatas: yup
        .array()
        .of(
          yup.object({
            key: yup.string().label("Key").trim().required(),
            text: yup.string().label("Text").trim().required(),
            description: yup.string().label("Description").trim().required(),
            // isMultiAnswer: yup.bool().label("Is Multiple Answer").optional(),
            sequenceNo: yup.number().label("Sequence No").required(),
            responseDatas: yup.array().of(
              yup.object({
                text: yup.string().label("Text").trim().required(),
                value: yup.number().label("Value").required(),
                sequenceNo: yup.number().label("Sequence No").required(),
              })
            ),
          })
        )
        .label("Questions")
        .required(),
    }),
    onSubmit: async (_values) => {
      const values = { ..._values };
      try {
        const func = isEdit ? updateSurveyMutation : createSurveyMutation;
        const data = await func({
          id,
          ...removeEmptyProperties(values, { allowEmptyArray: false }),
        }).unwrap();
        enqueueSnackbar(
          data?.defaultUserMessage ||
            `Survey Successfully ${isEdit ? "Updated" : "Created"}`,
          { variant: "success" }
        );
        navigate(RouteEnum.SURVEYS);
      } catch (error) {
        enqueueSnackbar(
          error?.data?.[0]?.defaultUserMessage ||
            `Error ${isEdit ? "Updating" : "Creating"} Survey`,
          {
            variant: "error",
          }
        );
      }
    },
  });

  console.log(formik.errors);

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (isEdit) {
      const values = dataRef.current.formik.values;
      dataRef.current.formik.setValues({
        key: survey?.key || values.key,
        name: survey?.name || values.name,
        description: survey?.description || values.description,
        questionDatas: (survey?.questionDatas || values.questionDatas).map(
          (questionData) =>
            excludeProperties(questionData, ["isMultiAnswerInfo"])
        ),
        countryCode: survey?.countryCode || values.countryCode,
      });
    }
  }, [dataRef, isEdit, survey]);

  return (
    <>
      <PageHeader
        beforeTitle={<BackButton variant="text" />}
        title={`${isEdit ? "Update" : "Create"} Surveys`}
        breadcrumbs={[
          { name: "System", to: RouteEnum.SYSTEM },
          { name: "Manage Surveys", to: RouteEnum.SURVEYS },
          { name: isEdit ? "Update" : "Create" },
        ]}
      />
      <LoadingContent
        loading={surveyQueryResult.isLoading}
        error={surveyQueryResult.isError}
        onReload={surveyQueryResult.refetch}
      >
        {() => (
          <>
            <Paper className="p-4 mb-4">
              <Typography variant="h6" className="font-bold mb-4">
                Details
              </Typography>
              <div className="grid  gap-4" style={{ maxWidth: 400 }}>
                <TextField
                  fullWidth
                  required
                  label="Name"
                  {...getTextFieldFormikProps(formik, "name")}
                />
                {/* <TextField
                  fullWidth
                  required
                  label="Country Code"
                  {...formik.getFieldProps("countryCode")}
                /> */}
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  {...getTextFieldFormikProps(formik, "description")}
                />
              </div>
            </Paper>
            <Paper className="mt-3 py-5 px-5 rounded-md">
              <Typography variant="h6" className="font-bold mb-4">
                Questions
              </Typography>

              {formik.values.questionDatas.map((question, questionIndex) => {
                const questionKey = `questionDatas[${questionIndex}]`;
                return (
                  <div className="relative bg-gray-100 p-4 mb-4 rounded-md">
                    <Typography className="font-bold" gutterBottom>
                      Question: {question.sequenceNo}
                    </Typography>
                    <div className="grid gap-4 mb-4" style={{ maxWidth: 400 }}>
                      <TextField
                        fullWidth
                        required
                        label="Text"
                        {...getTextFieldFormikProps(
                          formik,
                          questionKey + ".text"
                        )}
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        {...getTextFieldFormikProps(
                          formik,
                          questionKey + ".description"
                        )}
                      />
                      <FormControl>
                        <FormLabel id="answerType">
                          Choose Answer Type
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="answerType"
                          {...getTextFieldFormikProps(
                            formik,
                            questionKey + ".isMultiAnswer"
                          )}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldValue(
                              questionKey + "responseDatas",
                              e.target.value == AnswerTypeEnum.TEXT
                                ? [...defaultResponseData]
                                : []
                            );
                          }}
                        >
                          {[
                            { label: "Free Text", value: AnswerTypeEnum.TEXT },
                            {
                              label: "Select Single",
                              value: AnswerTypeEnum.SINGLE,
                            },
                            {
                              label: "Select Multipe",
                              value: AnswerTypeEnum.MULTIPLE,
                            },
                          ].map(({ label, value }) => (
                            <FormControlLabel
                              key={value}
                              value={value}
                              control={<Radio />}
                              label={label}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      {/* <FormControlLabel
                        label="Select this if this question has multiple answers"
                        control={
                          <Checkbox
                            {...getCheckFieldFormikProps(
                              formik,
                              questionKey + ".isMultiAnswer"
                            )}
                          />
                        }
                      /> */}
                      <div className="absolute -right-4 -top-4">
                        <IconButton
                          onClick={() => {
                            const newQuestions = [
                              ...formik.values.questionDatas,
                            ];
                            newQuestions.splice(questionIndex, 1);
                            formik.setFieldValue("questionDatas", newQuestions);
                          }}
                        >
                          <Icon>cancel</Icon>
                        </IconButton>
                      </div>
                    </div>

                    {question.isMultiAnswer != AnswerTypeEnum.TEXT && (
                      <div style={{ maxWidth: 600 }}>
                        <Typography className="font-bold" gutterBottom>
                          Options
                        </Typography>
                        {question.responseDatas.map((option, optionIndex) => {
                          const optionKey =
                            questionKey + `.responseDatas[${optionIndex}]`;
                          return (
                            <div
                              key={optionIndex}
                              className="relative grid sm:grid-cols-2 gap-4 p-2 mb-2"
                            >
                              {/* <Typography>Option: {option.sequenceNo}</Typography> */}
                              <TextField
                                fullWidth
                                required
                                label="Text"
                                {...getTextFieldFormikProps(
                                  formik,
                                  optionKey + ".text"
                                )}
                              />
                              <TextField
                                fullWidth
                                required
                                type="number"
                                label="Value"
                                {...getTextFieldFormikProps(
                                  formik,
                                  optionKey + ".value"
                                )}
                              />
                              <div className="absolute -right-4 -top-4">
                                <IconButton
                                  onClick={() => {
                                    const newOptions = [
                                      ...question.responseDatas,
                                    ];
                                    newOptions.splice(optionIndex, 1);
                                    formik.setFieldValue(
                                      questionKey + ".responseDatas",
                                      newOptions
                                    );
                                  }}
                                >
                                  <Icon>cancel</Icon>
                                </IconButton>
                              </div>
                            </div>
                          );
                        })}
                        <div class="flex justify-center gap-4">
                          <Button
                            startIcon={<Icon>add</Icon>}
                            onClick={() => {
                              formik.setFieldValue(
                                questionKey + ".responseDatas",
                                [
                                  ...question.responseDatas,
                                  {
                                    text: "",
                                    value: "",
                                    sequenceNo:
                                      question.responseDatas.length + 1,
                                  },
                                ]
                              );
                            }}
                          >
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div class="flex justify-center gap-4">
                <Button
                  variant="outlined"
                  startIcon={<Icon>add</Icon>}
                  onClick={() => {
                    formik.setFieldValue("questionDatas", [
                      ...formik.values.questionDatas,
                      {
                        responseDatas: [...defaultResponseData],
                        key: generateUUIDV4().slice(24),
                        text: "",
                        description: "",
                        isMultiAnswer: AnswerTypeEnum.TEXT,
                        sequenceNo: formik.values.questionDatas.length + 1,
                      },
                    ]);
                  }}
                >
                  Add Question
                </Button>
                <LoadingButton
                  loadingPosition="end"
                  loading={
                    createSurveyMutationResult.isLoading ||
                    updateSurveyMutationResult.isLoading
                  }
                  disabled={
                    createSurveyMutationResult.isLoading ||
                    updateSurveyMutationResult.isLoading
                  }
                  endIcon={<></>}
                  onClick={formik.handleSubmit}
                >
                  {isEdit ? "Update Survey" : "Create Survey"}
                </LoadingButton>
              </div>
            </Paper>
          </>
        )}
      </LoadingContent>
    </>
  );
}

export default SystemSurveyCreateEdit;

const AnswerTypeEnum = {
  SINGLE: 0,
  MULTIPLE: 1,
  TEXT: 2,
};

const defaultResponseData = [
  {
    text: "just a free text",
    value: 0,
    sequenceNo: 1,
  },
];
