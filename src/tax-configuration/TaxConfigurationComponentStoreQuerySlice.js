import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nimbleX360TaxComponentApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getTaxComponents: builder.query({
      query: (params) => ({ url: "/taxes/component", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    getTaxComponentById: builder.query({
      query: (id) => ({ url: "/taxes/component/" + id }),
      providesTags: (data) => [
        { type: RtkqTagEnum.CHARGE_PRODUCT, id: data?.id },
      ],
    }),
    getTaxComponentTemplate: builder.query({
      query: (params) => ({
        url: "/taxes/component/template",
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    addTaxComponent: builder.mutation({
      query: (data) => ({ url: "/taxes/component", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CHARGE_PRODUCT }],
    }),
    updateTaxComponent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: "/taxes/component/" + id,
        data,
        method: "put",
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RtkqTagEnum.CHARGE_PRODUCT, id },
      ],
    }),
  }),
});
