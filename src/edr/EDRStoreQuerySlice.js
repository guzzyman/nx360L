import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";
import { downloadFile } from "common/Utils";

export const nxEDRApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getEDRInflows: builder.query({
      query: (params) => ({
        url: "/fcmb",
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.EDR_INFLOW),
    }),
    getEDRInflow: builder.query({
      query: ({ fcmbId, ...params }) => ({
        url: "/fcmb/" + fcmbId,
        params,
      }),
      providesTags: (data) => {
        return providesTags([data], RtkqTagEnum.EDR_INFLOW);
      },
    }),
    getInflowNotes: builder.query({
      query: ({ fcmbId, ...params }) => ({
        url: `/fcmb/${fcmbId}/notes`,
        params,
      }),
      providesTags: (data) => providesTags(data, RtkqTagEnum.EDR_NOTE),
    }),
    downloadEDRInflowTemplate: builder.mutation({
      query: (params) => ({
        url: "/edr/downloadtemplate",
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
    getUploadedEDRsTemplate: builder.query({
      query: (params) => ({
        url: `/edr/${params.transId}/group`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.EDR_INFLOW),
    }),
    getEDRs: builder.query({
      query: (params) => ({ url: "/edr", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.EDR_TRANSACTION),
    }),
    getEDR: builder.query({
      query: ({ edrId, ...params }) => ({ url: "/edr/" + edrId, params }),
      providesTags: (data) => providesTags([data], RtkqTagEnum.EDR_TRANSACTION),
    }),
    getEDRNotes: builder.query({
      query: ({ edrId, ...params }) => ({ url: `/edr/${edrId}/notes`, params }),
      providesTags: (data) => providesTags(data, RtkqTagEnum.EDR_NOTE),
    }),
    getEDRClients: builder.query({
      query: (params) => ({ url: "/clients", params }),
    }),
    getEDRClientLoans: builder.query({
      query: (params) => ({ url: "/loans", params }),
    }),
    getEDRClientSavingsAccounts: builder.query({
      query: (params) => ({ url: "/savingsaccounts", params }),
    }),
    getEDRFundVendor: builder.query({
      query: (params) => ({ url: "/vendor/accounts/awaiting/transfer", params }),
    }),
  }),
});
