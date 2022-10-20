import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api } from "common/StoreQuerySlice";

export const nxClientDetailsLoanApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    generateClientDetailsLoanLink: builder.mutation({
      query: ({ loanId, ...params }) => ({
        url: `/loans/credit-direct/${loanId}`,
        params,
      }),
      invalidatesTags: (_, error) =>
        error
          ? []
          : [
              { type: RtkqTagEnum.CRM_CLIENT_LOAN_EDR },
              { type: RtkqTagEnum.CRM_LOAN },
              { type: RtkqTagEnum.CRM_CLIENT },
            ],
    }),
  }),
});
