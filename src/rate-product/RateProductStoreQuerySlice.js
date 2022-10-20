import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nimbleX360RateProductApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getRateProducts: builder.query({
      query: (params) => ({ url: "/rates", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.RATE_PRODUCT),
    }),
    getRateProductById: builder.query({
      query: (id) => ({ url: "/rates/" + id }),
      providesTags: (data) => [
        { type: RtkqTagEnum.RATE_PRODUCT, id: data?.id },
      ],
    }),
    getRateProductTemplate: builder.query({
      query: (params) => ({
        url: "/charges/template",
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.RATE_PRODUCT),
    }),
    addRateProduct: builder.mutation({
      query: (data) => ({ url: "/rates/", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.RATE_PRODUCT }],
    }),
    updateRateProduct: builder.mutation({
      query: (data) => ({ url: "/rates/" + data.id, data, method: "put" }),
      invalidatesTags: (_, __, { id }) => [
        { type: RtkqTagEnum.RATE_PRODUCT, id },
      ],
    }),
  }),
});
