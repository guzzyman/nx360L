import { useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  MenuItem,
  Typography,
  Switch,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PageHeader from "common/PageHeader";
import { useFormik } from "formik";
import * as yup from "yup";
import { nimbleX360ChartOfAccountApi } from "./ChartOfAccountStoreQuerySlice";
import { useSnackbar } from "notistack";
import { useNavigate, useParams, useMatch } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import useDataRef from "hooks/useDataRef";
import LoadingContent from "common/LoadingContent";
import { getTruthyValue } from "common/Utils";

function CreateGLAccount(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { id } = useParams();

  const isUpdateGLAccount = !!useMatch(RouteEnum.CHARTOFACCOUNTS_EDIT);
  const isAddSubLedgerGLAccount = !!useMatch(
    RouteEnum.CHARTOFACCOUNTS_ADD_SUBLEDGER
  );

  const isEdit = isUpdateGLAccount || isAddSubLedgerGLAccount;

  const [addGLAccountMutation, addGLAccountMutationResult] =
    nimbleX360ChartOfAccountApi.useAddGLAccountMutation();

  const [updateGLAccountMutation, updateGLAccountMutationResult] =
    nimbleX360ChartOfAccountApi.useUpdateGLAccountMutation();

  const glAccountTemplatesQueryResult =
    nimbleX360ChartOfAccountApi.useGetGLAccountTemplatesQuery();

  const glAccountQueryResult = nimbleX360ChartOfAccountApi.useGetGLAccountQuery(
    id,
    { skip: !isEdit }
  );

  const glAccount = glAccountQueryResult.data;

  const options = glAccountTemplatesQueryResult.data;
  const usageOptions = options?.usageOptions || [];
  const accountTypeOptions = options?.accountTypeOptions || [];

  const formik = useFormik({
    initialValues: {
      name: "",
      glCode: "",
      manualEntriesAllowed: false,
      type: "",
      tagId: "",
      parentId: "",
      usage: "",
      description: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      name: yup.string().trim().required(),
      glCode: yup.string().trim().required(),
      type: yup.string().trim().required(),
      tagId: yup.string().trim().optional(),
      parentId: yup.string().trim().optional(),
      manualEntriesAllowed: yup.boolean().required(),
      usage: yup.mixed().required(),
    }),
    onSubmit: async (values) => {
      try {
        const func = isUpdateGLAccount
          ? updateGLAccountMutation
          : addGLAccountMutation;
        await func({ id, ...values }).unwrap();
        enqueueSnackbar(
          isUpdateGLAccount ? "GL Account Updated" : "GL Account Created",
          { variant: "success" }
        );
        navigate(-1);
      } catch (error) {
        enqueueSnackbar(
          error?.data?.errors?.length ? (
            <div>
              {error?.data?.errors?.map((error, key) => (
                <Typography key={key}>{error?.defaultUserMessage}</Typography>
              ))}
            </div>
          ) : isUpdateGLAccount ? (
            "Error Updating GL Account"
          ) : (
            "Error Creating GL Account"
          ),
          { variant: "error" }
        );
      }
    },
  });

  const dataRef = useDataRef({ formik });

  useEffect(() => {
    if (isEdit) {
      dataRef.current.formik.setValues({
        name: isAddSubLedgerGLAccount ? "" : glAccount?.name || "",
        glCode: isAddSubLedgerGLAccount ? "" : glAccount?.glCode || "",
        manualEntriesAllowed: isAddSubLedgerGLAccount
          ? false
          : glAccount?.manualEntriesAllowed || false,
        type: getTruthyValue([glAccount?.type?.id, ""], {
          truthyValues: [0, ""],
        }),
        tagId: isAddSubLedgerGLAccount
          ? ""
          : getTruthyValue([glAccount?.tagId?.id, ""], {
              truthyValues: [0, ""],
            }),
        parentId: isAddSubLedgerGLAccount
          ? getTruthyValue([glAccount?.id, ""], {
              truthyValues: [0, ""],
            })
          : glAccount?.parentId || "",
        usage: isAddSubLedgerGLAccount
          ? ""
          : getTruthyValue([glAccount?.usage?.id, ""], {
              truthyValues: [0, ""],
            }),
        description: isAddSubLedgerGLAccount
          ? ""
          : glAccount?.description || "",
      });
    }
  }, [dataRef, glAccount, isAddSubLedgerGLAccount, isEdit]);

  const parentOptions =
    options?.[
      AccountTypeParent_TagOptionsMapping?.[formik.values.type]?.parent
    ] || [];

  const tagOptions =
    options?.[AccountTypeParent_TagOptionsMapping?.[formik.values.type]?.tag] ||
    [];

  return (
    <>
      <PageHeader
        title="Create GL Account"
        breadcrumbs={[
          { name: "Home", to: RouteEnum.DASHBOARD },
          { name: "Accounting", to: RouteEnum.ACCOUNTING },
          {
            name: "Create GL Account",
          },
        ]}
      />

      <LoadingContent
        loading={glAccountQueryResult.isLoading}
        error={glAccountQueryResult.isError}
        onReload={glAccountQueryResult.refetch}
      >
        {() => (
          <form
            className="w-full flex justify-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="max-w-3xl w-full">
              <Paper className="p-4 md:p-8 mb-4">
                <Typography variant="h6" className="font-bold">
                  {isUpdateGLAccount
                    ? "Update GL Account"
                    : isAddSubLedgerGLAccount
                    ? "Create GL Account (Subledger)"
                    : "Create GL Account"}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="max-w-sm mb-4"
                >
                  Ensure you enter correct information.
                </Typography>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                  <TextField
                    fullWidth
                    label="Account Name"
                    {...formik.getFieldProps("name")}
                    error={!!formik.touched.name && formik.errors.name}
                    helperText={!!formik.touched.name && formik.errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Account Type"
                    disabled={isAddSubLedgerGLAccount}
                    select
                    {...formik.getFieldProps("type")}
                    error={!!formik.touched.type && formik.errors.type}
                    helperText={!!formik.touched.type && formik.errors.type}
                  >
                    {accountTypeOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="GL Code"
                    {...formik.getFieldProps("glCode")}
                    error={!!formik.touched.glCode && formik.errors.glCode}
                    helperText={!!formik.touched.glCode && formik.errors.glCode}
                  />
                  <TextField
                    fullWidth
                    label="Account Usage"
                    select
                    {...formik.getFieldProps("usage")}
                    error={!!formik.touched.usage && formik.errors.usage}
                    helperText={!!formik.touched.usage && formik.errors.usage}
                  >
                    {usageOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Parent"
                    disabled={isAddSubLedgerGLAccount}
                    select
                    {...formik.getFieldProps("parentId")}
                    error={!!formik.touched.parentId && formik.errors.parentId}
                    helperText={
                      !!formik.touched.parentId && formik.errors.parentId
                    }
                  >
                    {parentOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Tag"
                    select
                    {...formik.getFieldProps("tagId")}
                    error={!!formik.touched.tagId && formik.errors.tagId}
                    helperText={!!formik.touched.tagId && formik.errors.tagId}
                  >
                    {tagOptions?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  label="Description"
                  {...formik.getFieldProps("description")}
                  error={
                    !!formik.touched.description && formik.errors.description
                  }
                  helperText={
                    !!formik.touched.description && formik.errors.description
                  }
                  className="mb-4"
                />
                <div className="flex items-center gap-12">
                  <Typography>Manual Entries Allowed</Typography>
                  <div className="flex items-center text-text-secondary">
                    <Typography>No</Typography>
                    <Switch
                      checked={formik.values.manualEntriesAllowed}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "manualEntriesAllowed",
                          e.target.checked
                        )
                      }
                    />
                    <Typography>Yes</Typography>
                  </div>
                </div>
              </Paper>
              <div className="flex items-center justify-end gap-4">
                <Button color="error" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  disabled={
                    addGLAccountMutationResult.isLoading ||
                    updateGLAccountMutationResult.isLoading
                  }
                  loading={
                    addGLAccountMutationResult.isLoading ||
                    updateGLAccountMutationResult.isLoading
                  }
                  loadingPosition="end"
                  endIcon={<></>}
                >
                  {isUpdateGLAccount ? "Update" : "Submit"}
                </LoadingButton>
              </div>
            </div>
          </form>
        )}
      </LoadingContent>
    </>
  );
}

export default CreateGLAccount;

const AccountTypeParent_TagOptionsMapping = {
  1: {
    parent: "assetHeaderAccountOptions",
    tag: "allowedAssetsTagOptions",
  },
  2: {
    parent: "liabilityHeaderAccountOptions",
    tag: "allowedLiabilitiesTagOptions",
  },
  3: {
    parent: "equityHeaderAccountOptions",
    tag: "allowedEquityTagOptions",
  },
  4: {
    parent: "incomeHeaderAccountOptions",
    tag: "allowedIncomeTagOptions",
  },
  5: {
    parent: "expenseHeaderAccountOptions",
    tag: "allowedExpensesTagOptions",
  },
};
