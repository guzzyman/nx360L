import { RtkqTagEnum } from "common/Constants";
import {
  nimbleX360Api,
  sequestApi,
  providesTags,
} from "common/StoreQuerySlice";

export const nxRequestApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({}),
});

export const sequestRequestApi = sequestApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentRequests: builder.query({
      query: (params) => ({ url: "/RequestLog/getrecentRequest", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getUserTypes: builder.query({
      query: (params) => ({ url: "/RequestType/getaffectedtypes", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getUnits: builder.query({
      query: (params) => ({ url: "/Unit/getunits", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getRequestType: builder.query({
      query: (params) => ({ url: "/RequestType/getrequestypes", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getCategory: builder.query({
      query: (params) => ({ url: "/Category/getCategories", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getCategoryByUnitId: builder.query({
      query: (id) => ({ url: "/Category/getcategoryByUnitId/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getSubCategoryByCategoryID: builder.query({
      query: (id) => ({ url: "/Category/getSubCategoryByCategory/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getRequestTypeByAffectedType: builder.query({
      query: (id) => ({ url: "/RequestType/getrequesttypes/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getRequestByClientID: builder.query({
      query: (id) => ({ url: "/RequestLog/getRequestByClientId/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    addRequest: builder.mutation({
      query: (data) => ({
        url: "/RequestLog/raiseticket/",
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.SEQUEST }],
    }),
    getRequestDetails: builder.query({
      query: (id) => ({ url: "/RequestLog/getRequest/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getCategoriesByTypes: builder.query({
      query: ({requestTypeId, responsibleUnitId}) => ({ url: `/Category/getCategoriesByTypes/${requestTypeId}/${responsibleUnitId}/1` }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: null }],
    }),
    getChannels: builder.query({
      query: (params) => ({ url: "/Channels/getChannels", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),    

  }),
});
