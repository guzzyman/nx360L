import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nimbleX360AdminSystemSurveyApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getAllSurveys: builder.query({
      query: () => ({ url: "/surveys" }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SURVEY),
    }),
    getSurvey: builder.query({
      query: (id) => ({ url: "/surveys/" + id }),
      providesTags: (_, __, id) => [{ type: RtkqTagEnum.SURVEY, id }],
    }),
    createSurvey: builder.mutation({
      query: (data) => ({
        url: `/surveys`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.SURVEY }],
    }),
    updateSurvey: builder.mutation({
      query: (data) => ({
        url: `/surveys/${data?.id}`,
        data,
        method: "put",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.SURVEY }],
    }),
    updateSurveyStatus: builder.mutation({
      query: (params) => ({
        url: `/surveys/${params?.id}`,
        params,
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.SURVEY }],
    }),
  }),
});

export default nimbleX360AdminSystemSurveyApi;
