import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags, publicApi } from "common/StoreQuerySlice";

export const nxClientSurveyApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getClientSurveys: builder.query({
      query: (id) => ({ url: "/surveys/scorecards/clients/" + id }),
      providesTags: (data) => providesTags(data, RtkqTagEnum.CLIENT_SURVEY),
    }),
    getClientSurvey: builder.query({
      query: ({ clientId, surveyId }) => ({
        url: `/surveys/scorecards/${surveyId}/clients/${clientId}`,
      }),
      providesTags: (data) => providesTags(data, RtkqTagEnum.CLIENT_SURVEY),
    }),
    getClientSurveyTemplates: builder.query({
      query: () => ({ url: "/surveys?isActive=true" }),
      providesTags: (data) => providesTags(data, RtkqTagEnum.SURVEYS),
    }),
    submitClientSurvey: builder.mutation({
      query: (data) => ({
        url: "/surveys/scorecards/" + data.surveyId,
        data,
        method: "post",
      }),
      invalidatesTags: [{ type: RtkqTagEnum.CLIENT_SURVEY }],
    }),
  }),
});

export const nxClientSurveyPublicApi = publicApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientSurveyTemplates: builder.query({
      query: () => ({ url: "/surveys?isActive=true" }),
      providesTags: (data) => providesTags(data, RtkqTagEnum.SURVEYS),
    }),
  }),
});
