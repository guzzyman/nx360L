import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nxClientDetailsLoanEdrApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getClientDetailsLoanEDR: builder.query({
      query: (params) => ({ url: `/edr`, params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_CLIENT_LOAN_EDR),
    }),
    getClientsDetailsLoanTransactionTemplate: builder.query({
      query: ({ loanId, ...params }) => ({
        url: `/loans/${loanId}/transactions/template`,
        params,
      }),
    }),
    submitClientsDetailsLoanRepayment: builder.mutation({
      query: ({ uniqueId, edrId, loanClientId, command, ...data }) => ({
        url: `/edr/${uniqueId}/repayment/${edrId}/${loanClientId}`,
        data,
        params: { command },
        method: "post",
      }),
      invalidatesTags: (_, error) =>
        error ? [] : [{ type: RtkqTagEnum.CRM_CLIENT_LOAN_EDR }],
    }),
  }),
});
