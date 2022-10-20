import { RtkqTagEnum } from "common/Constants";
import { providesTags } from "common/StoreQuerySlice";
import { objectToFormData } from "common/Utils";
import { nxEDRApi } from "edr/EDRStoreQuerySlice";

export const nxEDRInflowApi = nxEDRApi.injectEndpoints({
  endpoints: (builder) => ({
    createEDRInflow: builder.mutation({
      query: (data) => ({ url: "/fcmb", data, method: "post" }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
    updateEDRInflow: builder.mutation({
      query: ({ fcmbId, ...data }) => ({
        url: "/fcmb/" + fcmbId,
        data,
        method: "put",
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
    spoolEDRInflow: builder.mutation({
      query: (params) => ({
        url: "/fcmb/inflow",
        params,
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
    getEDRGLAccounts: builder.query({
      query: () => ({
        url: "/glaccounts",
        params: {
          type: 1,
          usage: 1,
          manualEntriesAllowed: true,
          disabled: false,
        },
      }),
    }),
    uploadEDRs: builder.mutation({
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
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
    createEDR: builder.mutation({
      query: (data) => ({ url: "/edr", data, method: "post" }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
    updateEDR: builder.mutation({
      query: ({ edrId, ...data }) => ({
        url: "/edr/" + edrId,
        data,
        method: "put",
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
    fundEmployerFromEDR: builder.mutation({
      query: (data) => ({
        url: "/fcmb/fund",
        data,
        method: "post",
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
    getEDREmployers: builder.query({
      query: (params) => ({ url: "/employers", params }),
    }),
  }),
});
