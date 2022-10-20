import { RtkqTagEnum } from "common/Constants";
import {
  nimbleX360Api,
  providesTags,
  invalidatesTags,
} from "common/StoreQuerySlice";

export const nimbleX360CRMLoanProductApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getLoanProductTemplate: builder.query({
      query: (params) => ({ url: "/loanproducts/template", params }),
    }),
    getLoanProducts: builder.query({
      query: (params) => ({ url: "/loanproducts", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.LOAN_PRODUCTS),
    }),
    getLoanProduct: builder.query({
      query: (productId) => ({
        url: "/loanproducts/" + productId,
        params: { template: true },
      }),
      providesTags: (data) => [
        { type: RtkqTagEnum.LOAN_PRODUCTS, id: data?.id },
      ],
    }),
    createLoanProduct: builder.mutation({
      query: (data) => ({ url: "/loanproducts", data, method: "post" }),
      invalidatesTags: [{ type: RtkqTagEnum.LOAN_PRODUCTS }],
    }),
    updateLoanProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: "/loanproducts/" + id,
        data,
        method: "put",
      }),
      invalidatesTags: (_, __, data) =>
        invalidatesTags(RtkqTagEnum.LOAN_PRODUCTS, { ids: [data.id] }),
    }),
  }),
});
