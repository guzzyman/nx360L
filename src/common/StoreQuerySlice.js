import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { RtkqTagEnum } from "./Constants";
import { FineractHttp, SequestHttp, PublicHttp } from "./Http";
import { logoutAction } from "./StoreActions";

export const creditDirectApi = createApi({
  reducerPath: "creditDirect",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://loansapibeta.creditdirect.ng/api/v1`,
  }),
  endpoints: (builder) => ({
    resolveBVNDetails: builder.query({
      query: (bvn) => ({ url: `/Validation/SendOtpForBvn/${bvn}/private` }),
    }),
    getValidateOtherBank: builder.query({
      query: ({ path }) => ({
        url: `/validation/validateaccountnumberv2/${path.AccountNumber}/${path.BankCode}`,
      }),
    }),
  }),
});

export const nimbleX360WrapperApi = createApi({
  reducerPath: "nimblex360wrapper",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_NX360_WRAPPER_API,
    prepareHeaders: (headers, { getState }) => {
      headers.set(
        "Authorization",
        `Bearer ${process.env.REACT_APP_NX360_WRAPPER_API_KEY}`
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getresolveBVNDetails: builder.query({
      query: (bvn) => ({ url: `/Verification/ValidateBvn/${bvn}` }),
    }),
    resolveBVNDetails: builder.mutation({
      query: ({ ...body }) => ({
        url: `/Verification/Kyc`,
        method: "POST",
        body: body,
      }),
    }),
    nameEnquiry: builder.mutation({
      query: ({ ...body }) => ({
        url: `/Verification/NameEnquiry`,
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const nimbleX360MambuApi = createApi({
  reducerPath: "nimblex360Mambu",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_NX360_MAMBU_API,
    prepareHeaders: (headers, { getState }) => {
      headers.set("XApiKey", process.env.REACT_APP_NX360_MAMBU_API_KEY);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMambuCustomerDetails: builder.query({
      query: (id) => ({ url: `/Mambu/get_customer_details_by_id/${id}` }),
    }),
    getMambuLoans: builder.query({
      query: (id) => ({ url: `/Mambu/get_loan_account_details/${id}` }),
    }),
    getMambuLoanTransactions: builder.query({
      query: (id) => ({ url: `/Mambu/get_loan_transaction_details/${id}` }),
    }),
    getMambuLoanComments: builder.query({
      query: (id) => ({ url: `/Mambu/get_loan_collection_comments/${id}` }),
    }),
    getMambuLoanActivities: builder.query({
      query: (id) => ({ url: `/Mambu/get_loan_collection_activity/${id}` }),
    }),

    getMosulendCustomerDetails: builder.query({
      query: (id) => ({
        url: `/Mosulend/get_customer_basic_details_by_customer_id/${id}`,
      }),
    }),
    getMosulendLoan: builder.query({
      query: (id) => ({
        url: `/Mosulend/get_customer_loan_details_by_customer_id/${id}`,
      }),
    }),
    getMosulendLoanProcess: builder.query({
      query: (id) => ({
        url: `/Mosulend/get_customer_loan_process_by_loan_id/${id}`,
      }),
    }),
    getMosulendLoanSettlement: builder.query({
      query: (id) => ({
        url: `/Mosulend/get_customer_loan_settlement_by_loan_id/${id}`,
      }),
    }),
    getUnsettledPendingLoans: builder.query({
      query: (id) => ({
        url: `/NX/get_customer_loan_details_by_loan_id/${id}`,
      }),
    }),
    getLoans: builder.query({
      query: (id) => ({
        url: `/NX/get_customer_loan_by_customer_id/${id}`,
      }),
    }),
  }),
});

export const nimbleX360Api = createApi({
  reducerPath: "ums",
  baseQuery: axiosBaseQuery({}, FineractHttp),
  endpoints: (builder) => ({
    getCodeValues: builder.query({
      query: (code) => ({ url: `/codes/${code}/codevalues` }),
    }),
    getStateLGA: builder.query({
      query: (stateId) => ({
        url: `/codes/27/codevalues/child/${stateId}`,
      }),
    }),
    resolveBVNDetails: builder.query({
      query: (bvn) => ({ url: `/fcmb/GetBvnDetails/${bvn}` }),
    }),
    getEmployers: builder.query({
      query: (params) => ({ url: `/employers`, params }),
    }),
    getBanks: builder.query({
      query: () => ({ url: `/banks` }),
    }),
    getValidateFCMBBank: builder.query({
      query: ({ path }) => ({
        url: `/fcmb/LocalNameEnquiry/${path.AccountNumber}`,
      }),
    }),
    getValidateOtherBank: builder.query({
      query: ({ path }) => ({
        url: `/Validation/ValidateAccountNumber/${path.AccountNumber}/${path.BankCode}`,
      }),
    }),
    getAuthUserProfile: builder.query({
      queryFn: (_, { getState }, ___, baseQuery) => {
        const { userId } = getState().global.authUser;
        return baseQuery({ url: `/users/${userId}` });
      },
    }),
    logout: builder.mutation({
      queryFn: (_, { getState }, ___, baseQuery) => {
        const { tfaToken } = getState().global.authUser || {};
        if (tfaToken) {
          return baseQuery({
            url: "/twofactor/invalidate",
            data: { token: tfaToken.token },
            method: "post",
          });
        }
        return { data: {} };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(logoutAction());
        } catch (error) {}
      },
    }),
    getWorkEmailOTP: builder.query({
      query: ({ clientId, workmail }) => ({
        url: `/clients/${clientId}/employers/otp/${workmail}`,
      }),
    }),
    validateWorkEmailOTP: builder.mutation({
      query: ({ clientId, ...body }) => ({
        url: `/clients/${clientId}/employers/otp/validate`,
        method: "POST",
        params: body,
      }),
    }),
  }),
});

export const sequestApi = createApi({
  reducerPath: "sequest",
  baseQuery: axiosBaseQuery({}, SequestHttp),
  endpoints: (builder) => ({}),
});

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: axiosBaseQuery({}, PublicHttp),
  endpoints: (builder) => ({}),
});

[
  nimbleX360Api,
  sequestApi,
  publicApi,
  nimbleX360MambuApi,
  creditDirectApi,
  nimbleX360WrapperApi,
].forEach((api) => {
  api.enhanceEndpoints({ addTagTypes: Object.values(RtkqTagEnum) });
});

/**
 *
 * @param {import("axios").AxiosRequestConfig} baseConfig
 */
export function axiosBaseQuery(baseConfig = {}, http = axios) {
  return request;

  /**
   *
   * @param {import("axios").AxiosRequestConfig} config
   */
  async function request(config = {}) {
    const url = config.url
      ? (baseConfig.url || "") + config.url
      : baseConfig.url;
    try {
      const response = await http.request({ ...baseConfig, ...config, url });

      return {
        ...response,
        data: response.data,
        message: response.data?.message || null,
        status: response.status || 200,
        meta: { request: response.request, response },
      };
    } catch (error) {
      // console.log("axiosBaseQuery-Error", error);
      return {
        error: error.response
          ? {
              defaultUserMessage: "",
              status: error.response.status,
              data: error.response.data,
            }
          : {
              defaultUserMessage: "Something went wrong",
              data: { defaultUserMessage: "Something went wrong" },
            },
      };
    }
  }
}

export function providesTags(resultsWithIds, tagType, options = {}) {
  const { selectId = ({ id }) => id } = options;
  const listTag = { type: tagType, id: "LIST" };
  const result = resultsWithIds
    ? [
        listTag,
        ...resultsWithIds.map((result) => ({
          type: tagType,
          id: selectId(result || {}) || "ITEM",
        })),
      ]
    : [listTag];

  return result;
}

export function invalidatesTags(tagType, options = {}) {
  const { ids = [] } = options;
  const result = [
    { type: tagType, id: "LIST" },
    ...ids.map((id) => ({ type: tagType, id })),
  ];

  return result;
}
