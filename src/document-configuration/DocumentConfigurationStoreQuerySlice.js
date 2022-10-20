import {
  invalidatesTags,
  nimbleX360Api,
  providesTags,
} from "common/StoreQuerySlice";
import { RtkqTagEnum } from "common/Constants";

export const nxDocumentConfigurationApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentConfigurations: builder.query({
      query: (params) => ({
        url: "/cdl/configuration",
        params: { entityEnum: 1, ...params },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.DOCUMENT_CONFIGURATION),
    }),
    getDocumentConfiguration: builder.query({
      query: (cdlConfigurationId) => ({
        url: "/cdl/configuration/" + cdlConfigurationId,
        params: { cdlConfigurationId },
      }),
      providesTags: (data) =>
        providesTags([data], RtkqTagEnum.DOCUMENT_CONFIGURATION),
    }),
    addDocumentConfiguration: builder.mutation({
      query: (data) => ({
        url: "/cdl/configuration",
        data,
        method: "post",
      }),
      invalidatesTags: () =>
        invalidatesTags(RtkqTagEnum.DOCUMENT_CONFIGURATION),
    }),
    updateDocumentConfiguration: builder.mutation({
      query: ({ id: cdlConfigurationId, ...data }) => ({
        url: "/cdl/configuration/" + cdlConfigurationId,
        data,
        params: { cdlConfigurationId },
        method: "put",
      }),
      invalidatesTags: (data) =>
        invalidatesTags(RtkqTagEnum.DOCUMENT_CONFIGURATION),
    }),
    enableXdisableDocumentConfiguration: builder.mutation({
      query: ({ id: cdlConfigurationId, command }) => ({
        url: "/cdl/configuration",
        params: { cdlConfigurationId, command },
        method: "put",
      }),
      invalidatesTags: (data) =>
        invalidatesTags(RtkqTagEnum.DOCUMENT_CONFIGURATION),
    }),
    getDocumentConfigurationSettings: builder.query({
      query: (cdlConfigurationId) => ({
        url: "/cdl/configuration/" + cdlConfigurationId + "/codes",
        params: { cdlConfigurationId },
      }),
      providesTags: (data) =>
        providesTags(
          data?.codeData,
          RtkqTagEnum.DOCUMENT_CONFIGURATION_SETTINGS,
          { selectId: ({ name }) => name }
        ),
    }),
    updateDocumentConfigurationSettings: builder.mutation({
      query: ({ id: cdlConfigurationId, ...data }) => ({
        url: "/cdl/configuration/" + cdlConfigurationId + "/codes",
        data,
        params: { cdlConfigurationId },
        method: "put",
      }),
      invalidatesTags: (data) =>
        invalidatesTags(RtkqTagEnum.DOCUMENT_CONFIGURATION_SETTINGS),
    }),
  }),
});
