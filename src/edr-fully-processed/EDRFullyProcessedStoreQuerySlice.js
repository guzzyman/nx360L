import { RtkqTagEnum } from "common/Constants";
import { providesTags } from "common/StoreQuerySlice";
import { nxEDRApi } from "edr/EDRStoreQuerySlice";

export const nxEDRFullyProcessedApi = nxEDRApi.injectEndpoints({
  endpoints: (builder) => ({
    getFullyEDRs: builder.query({
      // query: (params) => ({ url: "/edr/partially-processed", params }),
      query: (params) => ({
        url: "/edr/fully-and-partially-processed",
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.EDR_TRANSACTION),
    }),
  }),
});
