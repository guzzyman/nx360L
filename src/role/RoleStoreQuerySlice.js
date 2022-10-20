import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nimbleX360RoleApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: (params) => ({ url: "/roles", params }),
      providesTags: (data) => providesTags(data?.pageItems, RtkqTagEnum.ROLE),
    }),
    getStaff: builder.query({
      query: (params) => ({ url: "/staff", params }),
      providesTags: (data) => providesTags(data?.pageItems, RtkqTagEnum.ROLE),
    }),
    getCodeValues: builder.query({
      query: (codeId) => ({ url: "/codes/" + codeId + "/codevalues/" }),
      // providesTags: (data) => [
      //   {
      //     type: RtkqTagEnum.ROLE,
      //   },
      // ],
    }),
    getPermissionList: builder.query({
      query: (roleId) => ({ url: "/roles/all/" + roleId + "/permissions" }),
      providesTags: (data) => [
        {
          type: RtkqTagEnum.ROLE,
        },
      ],
    }),
    getRolesById: builder.query({
      query: (roleId) => ({ url: "/roles/" + roleId }),
      providesTags: (id) => [{ type: RtkqTagEnum.ROLE }],
    }),
    getRolesTemplate: builder.query({
      query: (params) => ({
        url: "/roles/template",
        params,
      }),
      providesTags: (data) => providesTags(data?.pageItems, RtkqTagEnum.ROLE),
    }),
    addRole: builder.mutation({
      query: (data) => ({ url: "/roles/", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.ROLE }],
    }),
    updateRole: builder.mutation({
      query: (data) => ({ url: "/roles/" + data.id, data, method: "put" }),
      invalidatesTags: (_, __, { id }) => [{ type: RtkqTagEnum.ROLE }],
    }),
    updateRolePermissions: builder.mutation({
      query: (data) => ({
        url: "/roles/all/" + data.id + "/permissions",
        data,
        method: "put",
      }),
      invalidatesTags: (_, __, { id }) => [{ type: RtkqTagEnum.ROLE }],
    }),
    enableDisableRole: builder.mutation({
      query: (data) => ({ url: "/roles/" + data.id, data, method: "put" }),
      invalidatesTags: (_, __, { id }) => [{ type: RtkqTagEnum.ROLE }],
    }),
  }),
});
