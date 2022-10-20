import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";
import { RtkqTagEnum } from "common/Constants";
import { downloadFile, objectToFormData } from "common/Utils";

export const nxEDRTransactionApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    clientSearchEDRTransaction: builder.query({
      query: (params) => ({
        url: "/clients",
        params: { fields: "id,displayName,accountNo", ...params },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_CLIENT),
    }),
    getClientsEDR: builder.query({
      query: (params) => ({ url: "/clients", params }),
    }),
    getClientLoansEDR: builder.query({
      query: (params) => ({ url: "/loans", params }),
    }),
    getEDRTransactionJournalEntries: builder.query({
      query: (params) => ({
        url: "/journalentries",
        params: { typeEnum: 1, ...params },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.EDR_TRANSACTION),
    }),
    getEDRTransactionJournalEntry: builder.query({
      query: ({ journalEntryId, ...params }) => ({
        url: "/journalentries/" + journalEntryId,
        params: { typeEnum: 1, ...params },
      }),
      providesTags: (data) => {
        return providesTags([data], RtkqTagEnum.EDR_TRANSACTION);
      },
    }),
    getEDRTransactions: builder.query({
      query: (params) => ({ url: "/edr", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.EDR_TRANSACTION),
    }),
    getEDRTransaction: builder.query({
      query: ({ edrId, ...params }) => ({ url: "/edr/" + edrId, params }),
      providesTags: (data) => providesTags([data], RtkqTagEnum.EDR_TRANSACTION),
    }),
    updateEDRTransaction: builder.mutation({
      query: ({ edrId, ...data }) => ({
        url: "/edr/" + edrId,
        data,
        method: "PUT",
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_TRANSACTION },
        { type: RtkqTagEnum.EDR_TRANSACTION_NOTE },
      ],
    }),
    getEDRTransactionNotes: builder.query({
      query: ({ edrId, ...params }) => ({ url: `/edr/${edrId}/notes`, params }),
      providesTags: (data) =>
        providesTags(data, RtkqTagEnum.EDR_TRANSACTION_NOTE),
    }),
    downloadEDRTransactionTemplate: builder.mutation({
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
    uploadEDRTransactions: builder.mutation({
      // query: (data) => ({
      //   url: "/edr/uploadtemplate",
      //   method: "POST",
      //   data: objectToFormData(data),
      // }),
      queryFn: async (data, _, __, baseQuery) => {
        const uploadResult = await baseQuery({
          url: "/edr/uploadtemplate",
          method: "POST",
          data: objectToFormData(data),
        });

        if (uploadResult.error) {
          return uploadResult;
        }

        async function uploadCheck(importId) {
          const checkResult = await baseQuery({
            url: "/imports/" + importId,
            params: { entityType: "edr" },
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
      invalidatesTags: () => [{ type: RtkqTagEnum.EDR_TRANSACTION }],
    }),
    getUploadedEDRTransactions: builder.query({
      query: (params) => ({
        url: `/edr/${params.transId}/group`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.EDR_TRANSACTION),
    }),
    checkEDRTransactionUploadStatus: builder.mutation({
      query: (params) => ({
        url: "/imports/" + params?.importId,
        params: { entityType: "edr" },
      }),
    }),
    processEDRTransactions: builder.mutation({
      queryFn: async ({ transId }, _, __, baseQuery) => {
        const processEmployerResult = await baseQuery({
          url: `/edr/${transId}/process`,
          params: { processEmployer: true },
          method: "POST",
        });

        if (
          processEmployerResult.error ||
          processEmployerResult.data?.httpStatusCode >= 300
        ) {
          return processEmployerResult;
        }

        const processEmployeeResult = await baseQuery({
          url: `/edr/${transId}/process`,
          params: { processEmployer: false },
          method: "POST",
        });

        return processEmployeeResult;
      },
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_TRANSACTION },
        { type: RtkqTagEnum.EDR_TRANSACTION_NOTE },
      ],
    }),
    processEDRTransaction: builder.mutation({
      query: ({ transId, edrId }) => ({
        url: `/edr/${transId}/process/${edrId}`,
        method: "POST",
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_TRANSACTION },
        { type: RtkqTagEnum.EDR_TRANSACTION_NOTE },
      ],
    }),
    rejectEDRTransactions: builder.mutation({
      query: ({ uniqueId }) => ({
        url: `/edr/${uniqueId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_TRANSACTION },
        { type: RtkqTagEnum.EDR_TRANSACTION_NOTE },
      ],
    }),
    createEDR: builder.mutation({
      query: (data) => ({ url: "/edr", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.EDR_TRANSACTION }],
    }),
  }),
});
