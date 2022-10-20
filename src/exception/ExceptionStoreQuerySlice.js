import { RtkqTagEnum } from "common/Constants";
import {
  nimbleX360Api,
  sequestApi,
  providesTags,
} from "common/StoreQuerySlice";

export const nx360RequestApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (...params) => ({
        url: "/users",
        params: {
          showOnlyStaff: true,
          ...params,
        },
      })
    }),
    getUserById: builder.query({
      query: (id) => ({ url: "/users/" + id }),
      providesTags: (data) => [
        {
          type: RtkqTagEnum.CHARGE_PRODUCT,
        },
      ],
    }),    
  }),
});

export const sequestExceptionApi = sequestApi.injectEndpoints({
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
      query: (params) => ({ url: "/Category/GetExceptionCategories", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getSubCategoryByCategoryID: builder.query({
      query: (id) => ({ url: "/Category/getSubCategoryByCategory/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getRequestByClientID: builder.query({
      query: (id) => ({ url: "/RequestLog/getRequestByClientId/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),

    getRequestDetails: builder.query({
      query: (id) => ({ url: "/RequestLog/getRequest/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getRequestStatus: builder.query({
      query: (params) => ({ url: "/RequestType/getrequestStatus/", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getRequestTypeByAffectedType: builder.query({
      query: (id) => ({ url: "/RequestType/getrequesttypes/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),  
    
    // Exception APIs
    getExceptionByUnitID: builder.query({
      query: (id) => ({ url: "/Category/getSubCategoryByCategory/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),

    // /api/Exception/getExceptionPendingOnMe/{staffId}
    getExceptionPendingOnMe: builder.query({
      query: (id) => ({ url: "/Exception/getExceptionPendingOnMe/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),    

    // /api/Exception/getOutgoingExceptions/{staffId}
    getOutgoingExceptions: builder.query({
      query: (id) => ({ url: "/Exception/getOutgoingExceptions/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),    
    
    // /api/Exception/getExceptionPendingOnUnit/{unitId}
    getExceptionPendingOnUnit: builder.query({
      query: (id) => ({ url: "/Exception/getExceptionPendingOnUnit/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),   
    
    getExceptionDetails: builder.query({
      query: (id) => ({ url: "/Exception/getCommunicationOnException/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    
    getRequestStatusByActor: builder.query({
      query: (id) => ({ url: "/RequestType/getRequestStatusByActor/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }), 

    addExceptionReply: builder.mutation({
      query: (data) => ({
        url: "/Exception/replyException/",
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.SEQUEST }],
    }),    
    addException: builder.mutation({
      query: (data) => ({
        url: "/Exception/raiseException/",
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.SEQUEST }],
    }),
    getExceptionCategory: builder.query({
      query: (params) => ({ url: "/Category/GetExceptionCategories", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getRequestStatusByTicketId: builder.query({
      query: (id) => ({
        url: "/RequestLog/getAvailableStatusByTicketId/" + id,
      }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
  }),
});
