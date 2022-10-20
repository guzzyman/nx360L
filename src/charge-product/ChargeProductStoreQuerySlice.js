import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nimbleX360ChargeProductApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getChargeProducts: builder.query({
      query: (params) => ({ url: "/charges", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    getChargeProductById: builder.query({
      query: (id) => ({ url: "/charges/" + id }),
      providesTags: (data) => [
        { type: RtkqTagEnum.CHARGE_PRODUCT, id: data?.id },
      ],
    }),
    getChargeProductTemplate: builder.query({
      query: (params) => ({
        url: "/charges/template",
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    addChargeProduct: builder.mutation({
      query: (data) => ({ url: "/charges/", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CHARGE_PRODUCT }],
    }),
    updateChargeProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: "/charges/" + id,
        data,
        method: "put",
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RtkqTagEnum.CHARGE_PRODUCT, id },
      ],
    }),
  }),
});
