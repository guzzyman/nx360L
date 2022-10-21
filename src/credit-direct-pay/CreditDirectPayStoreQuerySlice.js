import { RtkqTagEnum } from "common/Constants";
import { publicApi } from "common/StoreQuerySlice";
import { CreditDirectPayTypeEnum } from "./CreditDirectPayConstant";

export const cdlPayPublicApi = publicApi.injectEndpoints({
  endpoints: (builder) => ({
    getCdlPayDetails: builder.query({
      query: (payRef) => {
        const payTypeIndex = payRef?.length - 1;
        // const accountId = payRef?.slice(0, payTypeIndex);
        const payType = payRef?.[payTypeIndex];

        const isFundWallet = payType === CreditDirectPayTypeEnum.FUND_WALLET;
        // const isDownPayment = payType === CreditDirectPayTypeEnum.DOWNPAYMENT;
        return {
          url: isFundWallet
            ? `/savingsaccounts/credit-direct/${payRef}/info`
            : // ? `/savingsaccounts/${accountId}`
              `/loans/credit-direct/${payRef}/info`,
          params: isFundWallet
            ? {}
            : { associations: "all", exclude: "guarantors,futureSchedule" },
        };
      },
      providesTags: () => [{ type: RtkqTagEnum.CDL_PAY_DETAILS }],
    }),
    cdlPayAcceptLAFDocument: builder.mutation({
      query: ({ loanId, token, ...body }) => ({
        url: `/loans/${loanId}/laf/otp/${token}/accept`,
        method: "POST",
        data: body,
        params: { sendLink: false },
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CDL_PAY_DETAILS }],
    }),
    resendCdlPayLAFDocumentToken: builder.mutation({
      query: ({ loanId, mode }) => ({
        url: `/loans/${loanId}/laf/otp/${mode}`,
        params: { sendLink: false },
      }),
    }),
    cdlPayTokenizeCard: builder.mutation({
      query: ({ payRef, command, ...data }) => {
        const payTypeIndex = payRef?.length - 1;
        const accountId = payRef?.slice(0, payTypeIndex);
        const payType = payRef?.[payTypeIndex];

        const isFundWallet = payType === CreditDirectPayTypeEnum.FUND_WALLET;
        // const isDownPayment = payType === CreditDirectPayTypeEnum.DOWNPAYMENT;

        return {
          url: isFundWallet
            ? `/savingsaccounts/tokenize/${accountId}`
            : `/loans/credit-direct/pay/${payRef}`,
          data,
          method: "post",
          params: {
            command,
          },
        };
      },
    }),
    generateCdlPayLink: builder.mutation({
      query: ({ loanId, ...params }) => ({
        url: `/loans/credit-direct/${loanId}`,
        params,
      }),
      invalidatesTags: (_, error) =>
        error ? [] : [{ type: RtkqTagEnum.CDL_PAY_DETAILS }],
    }),
  }),
});
