import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";

export const nimbleX360UserManagementApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: (params) => ({ url: "/roles", params }),
      providesTags: (data) => providesTags(data?.pageItems, RtkqTagEnum.ROLE),
    }),
    getRolesById: builder.query({
      query: (roleId) => ({ url: "/roles/" + roleId }),
      providesTags: (roleId) => [
        {
          type: RtkqTagEnum.ROLE,
          id: roleId,
        },
      ],
    }),
    updateUserRoles: builder.mutation({
      query: ({ userId, staffId, ...data }) => ({
        url: `/staff/${userId}/cdl/${staffId}`,
        data,
        method: "put",
      }),
      invalidatesTags: (data) => [
        { type: RtkqTagEnum.USER_MANAGEMENT },
        { type: RtkqTagEnum.ROLE, id: data?.roles?.[0] },
      ],
    }),
    getUsers: builder.query({
      query: ({ ...params }) => ({
        url: "/users",
        params: {
          showOnlyStaff: true,
          ...params,
        },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.USER_MANAGEMENT),
    }),
    getStaffs: builder.query({
      query: (params) => ({ url: "/staff", params }),
      providesTags: (data) => providesTags(data?.pageItems, RtkqTagEnum.STAFF),
    }),
    getStaffById: builder.query({
      query: (id) => ({ url: "/staff/" + id }),
      providesTags: (data) => [
        {
          type: RtkqTagEnum.STAFF,
          // id: data?.id
        },
      ],
    }),
    updateUserSupervisor: builder.mutation({
      query: ({ staffId, ...data }) => ({
        url: `/staff/${staffId}`,
        data,
        method: "put",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.USER_MANAGEMENT }],
    }),
    getOffices: builder.query({
      query: (params) => ({ url: "/offices", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_OFFICES),
    }),
    getCodeValues: builder.query({
      query: (codeId) => ({ url: "/codes/" + codeId + "/codevalues/" }),
    }),
    getUserById: builder.query({
      query: (id) => ({ url: "/users/" + id }),
      providesTags: (data) => [
        { type: RtkqTagEnum.USER_MANAGEMENT, id: data?.id },
      ],
    }),
    addUser: builder.mutation({
      query: (data) => ({ url: "/staff/cdl/", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.USER_MANAGEMENT }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: "/staff/" + id,
        data,
        method: "put",
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RtkqTagEnum.USER_MANAGEMENT, id },
      ],
    }),
    updateStaff: builder.mutation({
      query: ({ id, availability, ...data }) => ({
        url: `/staff/${id}/availability?command=${availability}`,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.STAFF }],
    }),
  }),
});
