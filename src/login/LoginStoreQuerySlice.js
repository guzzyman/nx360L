import { nimbleX360Api, sequestApi } from "common/StoreQuerySlice";

export const nimblex360LoginApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `/authentication${
          process.env.REACT_APP_AUTHENTICATION_URL_SUFFIX || ""
        }`,
        data,
        method: "post",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          await dispatch(
            sequestLoginApi.endpoints.login.initiate({}, { track: false })
          ).unwrap();
        } catch (error) {}
      },
      // queryFn: async (data, _, __, baseQuery) => {
      //   const nxQueryResult = await baseQuery({
      //     url: "/authentication",
      //     data,
      //     method: "POST",
      //   });
      //   if (!nxQueryResult.error) {
      //     const sequestQueryResult = await baseQuery({
      //       url: "/Auth/login",
      //       data: { username: "testUser1", password: "Test1@123" },
      //       method: "POST",
      //     });
      //     if (!sequestQueryResult.error) {
      //       nxQueryResult.data.sequest = sequestQueryResult.data;
      //     }
      //   }
      //   return nxQueryResult;
      // },
    }),
    getLoginOTPDeliveryMethods: builder.query({
      query: () => ({ url: "/twofactor" }),
    }),
    requestLoginOTP: builder.query({
      query: (params) => ({
        url: "/twofactor",
        data: {},
        params,
        method: "post",
      }),
    }),
    resendLoginOTP: builder.mutation({
      query: (params) => ({
        url: "/twofactor",
        data: {},
        params,
        method: "post",
      }),
    }),
    validateLoginOTP: builder.mutation({
      query: (params) => ({
        url: "/twofactor/validate",
        data: {},
        params,
        method: "post",
      }),
    }),
    sendLoginIssue: builder.mutation({
      query: (data) => ({ url: "/authentication/send/email", data, method: "post" }),
    }),
  }),
});

export const sequestLoginApi = sequestApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/Auth/login",
        data: { username: "testUser1", password: "Test1@123" },
        method: "post",
      }),
    }),
  }),
});
