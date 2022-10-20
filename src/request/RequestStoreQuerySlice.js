import { RtkqTagEnum } from "common/Constants";
import {
  nimbleX360Api,
  sequestApi,
  providesTags,
} from "common/StoreQuerySlice";

export const nx360RequestApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getEDRClients: builder.query({
      query: (params) => ({ url: "/clients", params }),
    }),
    updateCRMClient: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/clients/${id}`,
        data,
        method: "put",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_CLIENT }],
    }),
  }),
});

export const sequestRequestApi = sequestApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentRequest: builder.query({
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
    getSubCategoryByCategoryID: builder.query({
      query: (id) => ({ url: "/Category/getSubCategoryByCategory/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getRequestByClientID: builder.query({
      query: (id) => ({ url: "/RequestLog/getRequestByClientId/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    addTicketReply: builder.mutation({
      query: (data) => ({
        url: "/RequestLog/replyticket/",
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.SEQUEST }],
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
    getRequestStatus: builder.query({
      query: (params) => ({ url: "/RequestType/getrequestStatus/", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getRequestStatusByActor: builder.query({
      query: (id) => ({ url: "/RequestType/getRequestStatusByActor/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getRequestStatusByTicketId: builder.query({
      query: (id) => ({
        url: "/RequestLog/getAvailableStatusByTicketId/" + id,
      }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getRequestPendingOnUnit: builder.query({
      query: ({unitId, ...params}) => ({
        url: "/RequestLog/getRequestPendingOnUnit/" + unitId,
        params
      }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.unitId }],
    }),
    getOutgoingRequest: builder.query({
      query: ({staffId, ...params}) => ({
        url: "/RequestLog/getOutgoingRequest/" + staffId,
        params
      }),
      providesTags: (data) => [
        { type: RtkqTagEnum.SEQUEST, id: data?.staffId },
      ],
    }),
    updateNewCustomerClientId: builder.mutation({
      query: ({ customerEmail, customerId, staffId }) => ({
        url: `/RequestLog/updateNewCustomerClientId/${customerEmail}/${customerId}/${staffId}`,
        method: "put",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.SEQUEST }],
    }),
    getRequestTypeByAffectedType: builder.query({
      query: (id) => ({ url: "/RequestType/getrequesttypes/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getCategoryByUnitId: builder.query({
      query: (id) => ({ url: "/Category/getcategoryByUnitId/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getCategoriesByTypes: builder.query({
      query: ({ responsibleUnitId }) => ({
        url: `/Category/getCategoriesByTypes/2/${responsibleUnitId}/1`,
      }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: null }],
    }),
    updateTicketCategory: builder.mutation({
      query: ({ ticketId, categoryId, subCategoryId }) => ({
        url: `/RequestLog/recategorizeTicket/${ticketId}/${categoryId}/${subCategoryId}`,
        method: "put",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.SEQUEST }],
    }),
    getRecentRequestPendingOnUnit: builder.query({
      query: ({organizationUnitId, ...params}) => ({ url: "/RequestLog/getRequestPendingOnUnit/" + organizationUnitId, params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),    
  }),
});
