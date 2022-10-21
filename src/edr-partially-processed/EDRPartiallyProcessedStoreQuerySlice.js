import { RtkqTagEnum } from "common/Constants";
import { nxEDRApi } from "edr/EDRStoreQuerySlice";

export const nxEDRPartiallyProcessedApi = nxEDRApi.injectEndpoints({
  endpoints: (builder) => ({
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
