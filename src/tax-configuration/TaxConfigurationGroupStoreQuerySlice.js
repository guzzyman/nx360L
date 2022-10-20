import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nimbleX360TaxGroupApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getTaxGroups: builder.query({
      query: (params) => ({ url: "/taxes/group", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    getTaxGroupById: builder.query({
      query: (id) => ({ url: "/taxes/group/" + id }),
      providesTags: (data) => [
        { type: RtkqTagEnum.CHARGE_PRODUCT, id: data?.id },
      ],
    }),
    getTaxGroupTemplate: builder.query({
      query: (params) => ({
        url: "/taxes/group/template",
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    addTaxGroup: builder.mutation({
      query: (data) => ({ url: "/taxes/group", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CHARGE_PRODUCT }],
    }),
    updateTaxGroup: builder.mutation({
      query: ({ id, ...data }) => ({
        url: "/taxes/group/" + id,
        data,
        method: "put",
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RtkqTagEnum.CHARGE_PRODUCT, id },
      ],
    }),
  }),
});
