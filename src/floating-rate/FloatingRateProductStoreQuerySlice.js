import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nimbleX360FloatingRateApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getFloatingRatess: builder.query({
      query: (params) => ({ url: "/floatingrates", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    getFloatingRatesById: builder.query({
      query: (id) => ({ url: "/floatingrates/" + id }),
      providesTags: (data) => [
        { type: RtkqTagEnum.CHARGE_PRODUCT, id: data?.id },
      ],
    }),
    getFloatingRatesTemplate: builder.query({
      query: (params) => ({
        url: "/floatingrates/template",
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    addFloatingRates: builder.mutation({
      query: (data) => ({ url: "/floatingrates/", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CHARGE_PRODUCT }],
    }),
    updateFloatingRates: builder.mutation({
      query: ({ id, ...data }) => ({
        url: "/floatingrates/" + id,
        data,
        method: "put",
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RtkqTagEnum.CHARGE_PRODUCT, id },
      ],
    }),
  }),
});
