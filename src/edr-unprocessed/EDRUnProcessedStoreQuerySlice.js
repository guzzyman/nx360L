import { RtkqTagEnum } from "common/Constants";
import { providesTags } from "common/StoreQuerySlice";
import { nxEDRApi } from "edr/EDRStoreQuerySlice";

export const nxEDRUnProcessedApi = nxEDRApi.injectEndpoints({
  endpoints: (builder) => ({
    processEDRs: builder.mutation({
      queryFn: async ({ transId }, _, __, baseQuery) => {
        const processEmployerResult = await baseQuery({
          url: `/edr/${transId}/process`,
          params: { processEmployer: true },
          method: "POST",
          timeout: 1000 * 60,
          timeoutErrorMessage:
            "EDRs Processing in background notification will be sent across",
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
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
    rejectEDRs: builder.mutation({
      query: ({ uniqueId }) => ({
        url: `/edr/${uniqueId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.EDR_INFLOW },
        { type: RtkqTagEnum.EDR_NOTE },
      ],
    }),
  }),
});
