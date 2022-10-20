import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nimbleX360ChartOfAccountApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getGLAccounts: builder.query({
      query: () => ({ url: "/glaccounts" }),
      providesTags: (data) => providesTags(data, RtkqTagEnum.CHARTOFACCOUNTS),
    }),
    getGLAccount: builder.query({
      query: (id) => ({ url: "/glaccounts/" + id }),
      providesTags: (data) => [
        { type: RtkqTagEnum.CHARTOFACCOUNTS, id: data?.id },
      ],
    }),
    addGLAccount: builder.mutation({
      query: (data) => ({ url: "/glaccounts/", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CHARTOFACCOUNTS }],
    }),
    updateGLAccount: builder.mutation({
      query: (data) => ({ url: "/glaccounts/" + data.id, data, method: "put" }),
      invalidatesTags: (_, __, { id }) => [
        { type: RtkqTagEnum.CHARTOFACCOUNTS, id },
      ],
    }),
    getGLAccountTemplates: builder.query({
      query: () => ({ url: "/glaccounts/template" }),
    }),
    deleteGLAccount: builder.mutation({
      query: (id) => ({
        url: `/glaccounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CHARTOFACCOUNTS }],
    }),
  }),
});
