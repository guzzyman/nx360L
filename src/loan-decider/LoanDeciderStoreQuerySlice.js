import { RtkqTagEnum } from "common/Constants";
import { nimbleX360WrapperApi } from "common/StoreQuerySlice";

export const LoanDeciderStoreQuerySlice = nimbleX360WrapperApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminLoanDeciders: builder.query({
      query: (params) => ({
        url: "/ProductSetup/GetProducts",
        params,
      }),
      providesTags: () => [{ type: RtkqTagEnum.LOAN_DECIDER }],
    }),
    getAdminLoanDecider: builder.query({
      query: (id) => ({
        url: `/ProductSetup/GetProduct/${id}`,
      }),
      providesTags: () => [{ type: RtkqTagEnum.LOAN_DECIDER }],
    }),
    addAdminLoanDecider: builder.mutation({
      query: (data) => ({
        url: `/ProductSetup/AddProduct`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.LOAN_DECIDER }],
    }),
    editAdminLoanDecider: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/ProductSetup/Updateproduct/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.LOAN_DECIDER }],
    }),
  }),
});
