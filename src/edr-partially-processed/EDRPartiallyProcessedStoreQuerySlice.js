import { RtkqTagEnum } from "common/Constants";
import { providesTags } from "common/StoreQuerySlice";
import { nxEDRApi } from "edr/EDRStoreQuerySlice";

export const nxEDRPartiallyProcessedApi = nxEDRApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartialEDRs: builder.query({
      // query: (params) => ({ url: "/edr/partially-processed", params }),
      query: (params) => ({
        url: "/edr/fully-and-partially-processed",
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.EDR_TRANSACTION),
    }),
    processEDR: builder.mutation({
      query: ({ transId, edrId }) => ({
        url: `/edr/${transId}/process/${edrId}`,
        method: "POST",
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_TRANSACTION },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
    updateEDR: builder.mutation({
      query: ({ edrId, ...data }) => ({
        url: "/edr/" + edrId,
        data,
        method: "PUT",
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_TRANSACTION },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
  }),
});
