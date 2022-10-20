import { RtkqTagEnum } from "common/Constants";
import {
  nimbleX360Api,
  providesTags,
} from "common/StoreQuerySlice";

const nimbleX360AdminProductMixApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductMix: builder.query({
      query: (params) => ({ url: "/loanproducts?associations=productMixes" }),
      providesTags: (data) =>
        providesTags(
          data?.pageItems,
          RtkqTagEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX
        ),
    }),
    getProducts: builder.query({
      query: (params) => ({
        url: "/loanproducts/template?isProductMixTemplate=true",
      }),
      providesTags: (data) =>
        providesTags(
          data?.pageItems,
          RtkqTagEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX_PRODUCTS
        ),
    }),
    getProductDetailsById: builder.query({
      query: (productId) => ({
        url: `loanproducts/${productId}/productmix?template=true`,
      }),
      providesTags: (data) => [
        {
          type: RtkqTagEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX_PRODUCTS,
          id: data?.id,
        },
      ],
    }),
    createProductMix: builder.mutation({
      query: (data) => ({
        url: `/loanproducts/${data.productId}/productmix`,
        data: { restrictedProducts: data.restrictedProducts },
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX }],
    }),
    editProductMix: builder.mutation({
      query: (data) => ({
        url: `/loanproducts/${data.productId}/productmix`,
        data: { restrictedProducts: data.restrictedProducts },
        method: "put",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.ADMINISTRATION_PRODUCTS_PRODUCT_MIX }],
    }),
  }),
});

export default nimbleX360AdminProductMixApi;
