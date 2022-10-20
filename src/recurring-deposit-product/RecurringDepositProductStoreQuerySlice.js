import { RtkqTagEnum } from "common/Constants";
import {
  nimbleX360Api,
  providesTags,
  invalidatesTags,
} from "common/StoreQuerySlice";

export const nxRecurringDepositProductApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getRecurringDepositProductTemplate: builder.query({
      query: (params) => ({
        url: "/recurringdepositproducts/template",
        params,
      }),
    }),
    getRecurringDepositProducts: builder.query({
      query: (params) => ({ url: "/recurringdepositproducts", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.FIXED_DEPOSIT_PRODUCT),
    }),
    getRecurringDepositProduct: builder.query({
      query: (productId) => ({
        url: "/recurringdepositproducts/" + productId,
        params: { productId },
      }),
      providesTags: (data) => [
        { type: RtkqTagEnum.FIXED_DEPOSIT_PRODUCT, id: data?.id },
      ],
    }),
    createRecurringDepositProduct: builder.mutation({
      query: (data) => ({
        url: "/recurringdepositproducts",
        data,
        method: "post",
      }),
      invalidatesTags: [{ type: RtkqTagEnum.FIXED_DEPOSIT_PRODUCT }],
    }),
    updateRecurringDepositProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: "/recurringdepositproducts/" + id,
        data,
        method: "put",
      }),
      invalidatesTags: (_, __, data) =>
        invalidatesTags(RtkqTagEnum.FIXED_DEPOSIT_PRODUCT, { ids: [data.id] }),
    }),
  }),
});
