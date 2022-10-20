import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nxClientXLeadXEDRLoanApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getClientXLeadXEDRLoan: builder.query({
      query: (params) => ({ url: `/edr`, params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_CLIENT_LOAN_EDR),
    }),
    getClientXLeadXEDRLoanTransactionTemplate: builder.query({
      query: ({ loanId, savingsAccountId, ...params }) => ({
        url: savingsAccountId
          ? `/savingsaccounts/${savingsAccountId}/transactions/template`
          : `/loans/${loanId}/transactions/template`,
        params,
      }),
    }),
    submitClientXLeadXEDRLoanRepayment: builder.mutation({
      query: ({ uniqueId, edrId, loanClientId, command, ...data }) => ({
        url: `/edr/${uniqueId}/repayment/${edrId}/${loanClientId}`,
        data,
        params: { command },
        method: "post",
      }),
      invalidatesTags: (_, error) =>
        error
          ? []
          : [
              { type: RtkqTagEnum.CRM_CLIENT_LOAN_EDR },
              { type: RtkqTagEnum.EDR_INFLOW },
              { type: RtkqTagEnum.EDR_TRANSACTION },
            ],
    }),
    rejectClientXLeadXEDRLoanRepayment: builder.mutation({
      query: ({ uniqueId, ...data }) => ({
        url: `/edr/${uniqueId}`,
        data,
        method: "delete",
      }),
      invalidatesTags: (_, error) =>
        error
          ? []
          : [
              { type: RtkqTagEnum.CRM_CLIENT_LOAN_EDR },
              { type: RtkqTagEnum.EDR_INFLOW },
              { type: RtkqTagEnum.EDR_TRANSACTION },
            ],
    }),
  }),
});
