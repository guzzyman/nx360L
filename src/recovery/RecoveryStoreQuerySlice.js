import { RtkqTagEnum } from "common/Constants";
import {
  nimbleX360Api,
  sequestApi,
  providesTags,
} from "common/StoreQuerySlice";
import { downloadFile } from "common/Utils";

export const nx360RecoveryApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getAllRecovery: builder.query({
      query: ({ productId, ...params }) => ({
        url: "/loans/collections",
        params: {
          orderBy: "id",
          sortOrder: "desc",
          isTeamLead: false,
          productId: productId,
          ...params,
        },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    ExportRecovery: builder.query({
      query: ({ productId, ...params }) => ({
        url: "/loans/collections/export",
        params: {
          orderBy: "id",
          sortOrder: "desc",
          isTeamLead: false,
          productId: productId,
          outputType: "csv",
          ...params,
          responseType: "blob",
        },
      }),
      onQueryStarted: async (params, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          downloadFile(data, params.fileName);
        } catch (error) {
          console.log(error);
        }
      },
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getProductList: builder.query({
      query: () => ({
        url: "/loanproducts",
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.LOAN_PRODUCTS),
    }),
    getMyTeamRecovery: builder.query({
      query: ({ productId, ...params }) => ({
        url: "/loans/collections",
        params: {
          orderBy: "id",
          sortOrder: "desc",
          isTeamLead: true,
          productId: productId,
          ...params,
        },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getMyRecovery: builder.query({
      query: ({ productId, authUser, ...params }) => ({
        url: "/loans/collections",
        params: {
          orderBy: "id",
          sortOrder: "desc",
          isTeamLead: false,
          productId: productId,
          collectionOfficerId:
            authUser?.staff?.collectionOfficerValue?.id === 2668
              ? authUser?.id
              : undefined,
          collectionOfficerTwoId:
            authUser?.staff?.collectionOfficerValue?.id === 2669
              ? authUser?.id
              : undefined,
          ...params,
        },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getAllRecoveryById: builder.query({
      query: (id) => ({ url: "/loans/collections/" + id }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getRequestStatusByTicketId: builder.query({
      query: (id) => ({
        url: "/RequestLog/getAvailableStatusByTicketId/" + id,
      }),
      providesTags: (data) => [{ type: RtkqTagEnum.SEQUEST, id: data?.id }],
    }),
    getUsers: builder.query({
      query: (...params) => ({
        url: "/users",
        params: {
          showOnlyStaff: true,
          ...params,
        },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    reassignCollectionOfficer: builder.mutation({
      query: ({ ...data }) => ({
        url: `/loans/collections/${data?.toLoanOfficerId}?command=assignStaff`,
        data,
        method: "post",
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    // exportRecovery: builder.query({
    //   query: ({ R_reportListing, ...params }) => ({
    //     url: `/runreports/${R_reportListing}`,//loans/1/collections?orderBy=displayName&sortOrder=DESC
    //     params,
    //     responseType: "blob",
    //   }),
    //   onQueryStarted: async (params, { queryFulfilled }) => {
    //     try {
    //       const { data } = await queryFulfilled;
    //       downloadFile(data, params.fileName);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   },
    // }),
  }),
});

export const sequestRecoveryApi = sequestApi.injectEndpoints({
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
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),

    getRequestByClientID: builder.query({
      query: (id) => ({ url: "/RequestLog/getRequestByClientId/" + id }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),

    getRequestDetails: builder.query({
      query: (id) => ({ url: "/RequestLog/getRequest/" + id }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getRequestStatus: builder.query({
      query: (params) => ({ url: "/RequestType/getrequestStatus/", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
    getRequestTypeByAffectedType: builder.query({
      query: (id) => ({ url: "/RequestType/getrequesttypes/" + id }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),

    getExceptionByUnitID: builder.query({
      query: (id) => ({ url: "/Category/getSubCategoryByCategory/" + id }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),

    getExceptionPendingOnMe: builder.query({
      query: (id) => ({ url: "/Exception/getExceptionPendingOnMe/" + id }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),

    getOutgoingExceptions: builder.query({
      query: (id) => ({ url: "/Exception/getOutgoingExceptions/" + id }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),

    getExceptionPendingOnUnit: builder.query({
      query: (id) => ({ url: "/Exception/getExceptionPendingOnUnit/" + id }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),

    getExceptionDetails: builder.query({
      query: (exceptionId) => ({
        url: "/Exception/getCommunicationOnException/" + exceptionId,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),

    getRequestStatusByActor: builder.query({
      query: (id) => ({ url: "/RequestType/getRequestStatusByActor/" + id }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
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

    getStatusGeneric: builder.query({
      query: (id, params) => ({
        url: `/RequestType/getStatusGeneric2/${id}`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.SEQUEST),
    }),
  }),
});
