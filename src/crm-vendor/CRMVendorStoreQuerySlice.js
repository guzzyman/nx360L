import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nimbleX360CRMVendorApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getCRMVendors: builder.query({
      query: (params) => ({ url: "/vendor", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_VENDOR),
    }),
    getCRMVendor: builder.query({
      query: (id) => ({ url: "/vendor/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.CRM_VENDOR, id: data?.id }],
    }),
    addCRMVendor: builder.mutation({
      query: (data) => ({ url: "/vendor", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_VENDOR }],
    }),
    updateCRMVendor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/vendor/${id}`,
        data,
        method: "put",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_VENDOR }],
    }),
    getVendorWallet: builder.query({
      query: ({ id, ...params }) => ({
        url: `/vendor/${id}/accounts`,
        params,
      }),
      providesTags: () => [{ type: RtkqTagEnum.CRM_VENDOR_ACCOUNT }],
    }),
    getCRMVendorsAddress: builder.query({
      query: ({ id, ...params }) => ({
        url: `/client/${id}/addresses`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_VENDOR_ADDRESS),
    }),
    addCRMVendorAddress: builder.mutation({
      query: ({ id, params, ...data }) => ({
        url: `/client/${id}/addresses`,
        data,
        params,
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_VENDOR_ADDRESS }],
    }),
    updateCRMVendorAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/client/${id}/addresses`,
        data,
        method: "put",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_VENDOR_ADDRESS }],
    }),

    getCRMVendorsBank: builder.query({
      query: ({ id, ...params }) => ({
        url: `/clients/${id}/banks`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_VENDOR_BANK),
    }),
    addCRMVendorBank: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/clients/${id}/banks`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_VENDOR_BANK }],
    }),
    updateCRMVendorBank: builder.mutation({
      query: ({ vendorId, bankRouteId, ...data }) => ({
        url: `/clients/${vendorId}/banks/${bankRouteId}`,
        data,
        method: "put",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_VENDOR_BANK }],
    }),
    getCRMVendorsSummary: builder.query({
      query: ({ id, ...params }) => ({
        url: `/vendor/${id}/accounts/summary`,
        params,
      }),
      providesTags: () => [{ type: RtkqTagEnum.CRM_VENDOR_SUMMARY }],
    }),
    getCRMVendorsOffices: builder.query({
      query: (params) => ({ url: "/offices", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_OFFICES),
    }),
    getVendorLoanProductOverrides: builder.query({
      query: (id) => ({
        url: `/vendor/${id}/loanproducts`,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.EMPLOYER_PRODUCTS }],
    }),
    getVendorLoanProductOverrideTemplate: builder.query({
      query: (id) => ({
        url: `/vendor/${id}/loanproducts/template`,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.EMPLOYER_PRODUCTS }],
    }),
    addVendorLoanProductOverride: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/vendor/${id}/loanproducts`,
        data,
        method: "POST",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.EMPLOYER_PRODUCTS }],
    }),
    updateVendorLoanProductOverride: builder.mutation({
      query: ({ id, productId, ...data }) => ({
        url: `/vendor/${id}/loanproducts/${productId}`,
        data,
        method: "PUT",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.EMPLOYER_PRODUCTS }],
    }),
    getVendorLoanProductOverrideDetails: builder.query({
      query: ({ id, loanProductId }) => ({
        url: `/vendor/${id}/loanproducts/${loanProductId}/info`,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.EMPLOYER_PRODUCTS }],
    }),
  }),
});
