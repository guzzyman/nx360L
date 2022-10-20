import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";
import { downloadFile, objectToFormData } from "common/Utils";

export const nimbleX360CRMEmployerApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getCRMEmployers: builder.query({
      query: (params) => ({ url: "/employers", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_EMPLOYER),
    }),
    getCRMEmployer: builder.query({
      query: (id) => ({ url: "/employers/" + id }),
      providesTags: (data) => [
        { type: RtkqTagEnum.CRM_EMPLOYER, id: data?.id },
      ],
    }),
    addCRMEmployer: builder.mutation({
      query: (data) => ({ url: "/employers", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_EMPLOYER }],
    }),
    updateCRMEmployer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employers/${id}`,
        data,
        method: "put",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_EMPLOYER }],
    }),
    getEmployerWallet: builder.query({
      query: (id) => ({
        url: `/clients/${id}/accounts?fields=savingsAccounts`,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_WALLET, id }],
    }),
    getEmployerLoanProducts: builder.query({
      query: (id) => ({
        url: `/employers/${id}/loanproducts`,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.EMPLOYER_PRODUCTS }],
    }),
    getEmployerLoanProductsTemplate: builder.query({
      query: (id) => ({
        url: `/employers/${id}/loanproducts/template`,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.EMPLOYER_PRODUCTS }],
    }),
    addEmployerLoanProducts: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employers/${id}/loanproducts`,
        data,
        method: "POST",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.EMPLOYER_PRODUCTS }],
    }),
    putEmployerLoanProducts: builder.mutation({
      query: ({ id, productId, ...data }) => ({
        url: `/employers/${id}/loanproducts/${productId}`,
        data,
        method: "PUT",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.EMPLOYER_PRODUCTS }],
    }),
    getEmployerLoanProductsDetails: builder.query({
      query: ({ id, loanProductId }) => ({
        url: `/employers/${id}/loanproducts/${loanProductId}`,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.EMPLOYER_PRODUCTS }],
    }),
    getEmployerBranches: builder.query({
      query: ({ id, ...params }) => ({
        url: `/employers/parent/${id}`,
        params,
      }),
    }),
    downloadEmployerEDRTemplate: builder.mutation({
      query: ({ fileName, ...params }) => ({
        url: `/employers/downloadtemplate/edr`,
        params,
        responseType: "blob",
      }),
      onQueryStarted: async (params, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          downloadFile(data, params.fileName);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    uploadEmployerEDR: builder.mutation({
      // query: (data) => ({
      //   url: "/edr/uploadtemplate",
      //   method: "POST",
      //   data: objectToFormData(data),
      // }),
      queryFn: async (data, _, __, baseQuery) => {
        const uploadResult = await baseQuery({
          url: "/employers/uploadtemplate/edr",
          method: "POST",
          data: objectToFormData(data),
        });

        if (uploadResult.error) {
          return uploadResult;
        }

        async function uploadCheck(importId) {
          const checkResult = await baseQuery({
            url: "/imports/" + importId,
            params: { entityType: "edr_employer" },
          });
          if (checkResult.error) {
            return checkResult;
          }
          if (!checkResult.data.completed) {
            return await uploadCheck(importId);
          }
          return checkResult;
        }

        const uploadCheckResult = await uploadCheck(uploadResult.data);
        return uploadCheckResult;
      },
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
    getEmployerDSRConfigs: builder.query({
      query: ({ businessId, ...params }) => ({
        url: `/datatables/DSR_CONFIG/${businessId}`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.DSR_CONFIG }],
    }),
    getEmployerDSRConfig: builder.query({
      query: ({ businessId, id, ...params }) => ({
        url: `/datatables/DSR_CONFIG/${businessId}/${id}`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.DSR_CONFIG }],
    }),
    addEmployerDSRConfig: builder.mutation({
      query: ({ businessId, params, ...data }) => ({
        url: `/datatables/DSR_CONFIG/${businessId}`,
        data,
        params: params,
        method: "POST",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.DSR_CONFIG }],
    }),
    editEmployerDSRConfig: builder.mutation({
      query: ({ businessId, id, params, ...data }) => ({
        url: `/datatables/DSR_CONFIG/${businessId}/${id}`,
        data,
        params: params,
        method: "PUT",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.DSR_CONFIG }],
    }),
    deleteEmployerDSRConfig: builder.mutation({
      query: ({ businessId, id, params, ...data }) => ({
        url: `/datatables/DSR_CONFIG/${businessId}/${id}`,
        data,
        params: params,
        method: "DELETE",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.DSR_CONFIG }],
    }),
  }),
});
