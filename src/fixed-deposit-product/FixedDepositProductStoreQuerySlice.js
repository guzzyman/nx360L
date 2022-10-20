import { RtkqTagEnum } from "common/Constants";
import {
  nimbleX360Api,
  providesTags,
  invalidatesTags,
} from "common/StoreQuerySlice";

export const nxFixedDepositProductApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getFixedDepositProductTemplate: builder.query({
      query: (params) => ({ url: "/fixeddepositproducts/template", params }),
    }),
    getFixedDepositProducts: builder.query({
      query: (params) => ({ url: "/fixeddepositproducts", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.FIXED_DEPOSIT_PRODUCT),
    }),
    getFixedDepositProduct: builder.query({
      query: (productId) => ({
        url: "/fixeddepositproducts/" + productId,
        params: { productId },
      }),
      providesTags: (data) => [
        { type: RtkqTagEnum.FIXED_DEPOSIT_PRODUCT, id: data?.id },
      ],
    }),
    createFixedDepositProduct: builder.mutation({
      query: (data) => ({
        url: "/fixeddepositproducts",
        data,
        method: "post",
      }),
      invalidatesTags: [{ type: RtkqTagEnum.FIXED_DEPOSIT_PRODUCT }],
    }),
    updateFixedDepositProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: "/fixeddepositproducts/" + id,
        data,
        method: "put",
      }),
      invalidatesTags: (_, __, data) =>
        invalidatesTags(RtkqTagEnum.FIXED_DEPOSIT_PRODUCT, { ids: [data.id] }),
    }),
  }),
});
