import {
  invalidatesTags,
  nimbleX360Api,
  providesTags,
} from "common/StoreQuerySlice";
import { downloadFile, objectToFormData } from "common/Utils";
import { RtkqTagEnum } from "common/Constants";

const RECONCILIATION_BASE_URL = "/reconciliation";

export const ReconciliationApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getReconciliationDisbursementBankStatementSummary: builder.query({
      query: (config) => ({
        url: `${RECONCILIATION_BASE_URL}/disbursement-bank-statement-summary`,
        ...config,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.RECONCILIATION_DISBURSEMENT),
    }),
    getReconciliationDisbursementBankStatement: builder.query({
      query: (config) => ({
        url: `${RECONCILIATION_BASE_URL}/disbursement-bank-statement`,
        ...config,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.RECONCILIATION_DISBURSEMENT),
    }),
    getReconciliationDisbursements: builder.query({
      query: (config) => ({
        url: `${RECONCILIATION_BASE_URL}/disbursement-reconciliation`,
        ...config,
      }),
      providesTags: (data) =>
        providesTags(data, RtkqTagEnum.RECONCILIATION_DISBURSEMENT),
    }),
    createReconciliationDisbursement: builder.mutation({
      query: ({ path, ...config }) => ({
        url: `${RECONCILIATION_BASE_URL}/disbursement`,
        method: "post",
        ...config,
      }),
      invalidatesTags: (_, error) =>
        invalidatesTags(RtkqTagEnum.RECONCILIATION_DISBURSEMENT),
    }),
    updateReconciliationDisbursement: builder.query({
      query: ({ path, ...config }) => ({
        url: `${RECONCILIATION_BASE_URL}/disbursement/${path.id}`,
        method: "put",
        ...config,
      }),
      invalidatesTags: (_, error, { path }) =>
        invalidatesTags(RtkqTagEnum.RECONCILIATION_DISBURSEMENT, [path.id]),
    }),
    getReconciliationLoanDisbursements: builder.query({
      query: (config) => ({
        url: `${RECONCILIATION_BASE_URL}/loan-disbursements`,
        ...config,
      }),
      providesTags: (data) =>
        providesTags(data, RtkqTagEnum.LOAN_RECONCILIATION_DISBURSEMENT),
    }),
    downloadReconciliationDisbursementTemplate: builder.mutation({
      query: (config) => ({
        url: `${RECONCILIATION_BASE_URL}/downloaddisbursementtemplate`,
        responseType: "blob",
        ...config,
      }),
      //   providesTags: () => providesTags()
      onQueryStarted: async (config, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          downloadFile(data, config?.data?.fileName);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    uploadReconciliationDisbursement: builder.mutation({
      query: (config) => ({
        url: `${RECONCILIATION_BASE_URL}/upload/disbursement-template`,
        method: "post",
        ...config,
        data: objectToFormData(config.data),
      }),
      invalidatesTags: (_, error) =>
        invalidatesTags(RtkqTagEnum.RECONCILIATION_DISBURSEMENT),
    }),
  }),
});
