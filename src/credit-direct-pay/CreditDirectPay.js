import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Container, Icon, IconButton, Typography } from "@mui/material";
import CreditDirectPayLAFDocument from "./CreditDirectPayLAFDocument";
import CreditDirectPayTokenization from "./CreditDirectPayTokenization";
import { cdlPayPublicApi } from "./CreditDirectPayStoreQuerySlice";
import LoadingContent from "common/LoadingContent";
import { useParams } from "react-router-dom";
import useStepper from "hooks/useStepper";
import useDataRef from "hooks/useDataRef";
import CreditDirectPayEnd from "./CreditDirectPayEnd";
import { urlSearchParamsExtractor } from "common/Utils";
import {
  CreditDirectPayTypeEnum,
  CreditDirectPayEventEnum,
  CreditDirectPayMethodIdEnum,
} from "./CreditDirectPayConstant";
import CreditDirectPayFooter from "./CreditDirectPayFooter";
import CreditDirectPayStepPaper from "./CreditDirectPayStepPaper";
import CreditDirectPayRedirectButtons from "./CreditDirectPayRedirectButtons";
import currencyjs from "currency.js";

function CreditDirectPay(props) {
  const { payRef } = useParams();

  const isInline = window.self !== window.top;

  const urlQueryParams = useMemo(
    () =>
      urlSearchParamsExtractor(new URLSearchParams(window.location.search), {
        redirectUrl: "",
        hideAcceptButton: 0,
        email: "",
        amount: 0,
        timeout: 10,
      }),
    []
  );

  const payType = payRef?.[payRef?.length - 1];
  const isTokenization = payType === CreditDirectPayTypeEnum.TOKENIZATION;
  const isRepayment = payType === CreditDirectPayTypeEnum.REPAYMENT;
  const isFundWallet = payType === CreditDirectPayTypeEnum.FUND_WALLET;
  const isDownPayment = payType === CreditDirectPayTypeEnum.DOWNPAYMENT;

  const stepper = useStepper(0);

  const [state, setState] = useState({});

  const [cdlPayTokenizeCardMutation, cdlPayTokenizeCardMutationResult] =
    cdlPayPublicApi.useCdlPayTokenizeCardMutation();

  const [generateCdlPayLinkMuation, generateCdlPayLinkMuationResult] =
    cdlPayPublicApi.useGenerateCdlPayLinkMutation();

  const cdlPayDetailsQueryResult = cdlPayPublicApi.useGetCdlPayDetailsQuery(
    payRef,
    {
      skip: !payRef,
    }
  );

  const { data, isLoading, isError, refetch, error } = cdlPayDetailsQueryResult;

  const fundWalletCustomerInfo = data?.customerInfo;

  const config = isFundWallet
    ? {
        title: "Fund Wallet",
        description: "Fund Wallet",
        firstname: fundWalletCustomerInfo?.firstname,
        lastname: fundWalletCustomerInfo?.lastname,
        email: data?.customerInfo?.emailAddress,
        currency: "NGN",
        transactionAmount: currencyjs(data?.transactionAmount).value,
        // transactionId: data?.transactionId,
        transactionType: "Down Payment",
      }
    : {
        title: data?.title,
        description: data?.title,
        firstname: data?.loanInfo?.customerInfo?.clients?.firstname,
        lastname: data?.loanInfo?.customerInfo?.clients?.lastname,
        mobileNo: data?.loanInfo?.customerInfo?.clients?.mobileNo,
        email: data?.loanInfo?.customerInfo?.clients?.emailAddress,
        currency: "NGN",
        transactionAmount: currencyjs(data?.transactionAmount).value,
        transactionId: data?.transactionId,
        transactionType: data?.transactionType,
        bank: data?.loanInfo?.customerInfo?.clientBanks?.[0],
        remitaAmount: currencyjs(
          data?.loanInfo?.loanInfo?.repaymentSchedule?.periods?.[1]
            ?.totalDueForPeriod
        ).value,
        isMakeDownPayment:
          data?.loanInfo?.loanInfo?.isExternalService &&
          !data?.loanInfo?.loanInfo?.externalDownPaymentDate &&
          !data?.loanInfo?.loanInfo?.externalDownPaymentUserId,
        loanId: data?.loanInfo?.loanInfo?.id,
      };

  const isDeductionAtSourceOnRepaymentMethods = useMemo(() => {
    // !!data?.loanInfo?.loanInfo?.repaymentMethod?.find(
    //   (method) => method?.id == 5
    // )
    return (
      data?.loanInfo?.loanInfo?.repaymentMethod?.length === 1 &&
      data?.loanInfo?.loanInfo?.repaymentMethod?.[0]?.id ==
        CreditDirectPayMethodIdEnum.SOURCE
    );
  }, [data?.loanInfo?.loanInfo?.repaymentMethod]);

  console.log(isDeductionAtSourceOnRepaymentMethods);

  const initialStep =
    isLoading ||
    (payType === CreditDirectPayTypeEnum.TOKENIZATION &&
      data?.transactionType === "loans" &&
      !data?.loanInfo?.loanInfo?.isLafSigned)
      ? 0
      : 1;

  function sendEvent(type, payload, targetOrigin = "*", transfer) {
    window.parent.postMessage({ type, payload }, targetOrigin, transfer);
  }

  const dataRef = useDataRef({
    sendEvent,
    payType,
    payRef,
    data,
    stepper,
    urlQueryParams,
    cdlPayTokenizeCardMutationResult,
    cdlPayTokenizeCardMutation,
    generateCdlPayLinkMuation,
    generateCdlPayLinkMuationResult,
    config,
    state,
    setState,
    cdlPayDetailsQueryResult,
    isInline,
    isDeductionAtSourceOnRepaymentMethods,
    isTokenization,
    isRepayment,
    isFundWallet,
    isDownPayment,
  });

  const contentProps = { dataRef, ...dataRef.current };

  useLayoutEffect(() => {
    dataRef.current.stepper.reset(initialStep);
  }, [dataRef, initialStep]);

  return (
    <Container
      maxWidth="xl"
      className="h-full max-w-2xl flex justify-center items-center"
    >
      <div
        className="bg-white p-4 sm:p-6 rounded w-full overflow-y-auto min-h-0 relative flex flex-col"
        style={{ maxHeight: "calc(100% - 72px)" }}
      >
        <LoadingContent
          loading={isLoading}
          error={isError}
          onReload={refetch}
          errorContent={(defaultErrorContent) => (
            <div>
              <CreditDirectPayStepPaper>
                <div className="flex flex-col items-center text-error-main mb-4">
                  <Icon style={{ fontSize: 48, marginBottom: 4 }}>cancel</Icon>
                  <Typography className="text-center font-bold mb-4">
                    {error?.data?.errors?.[0]?.defaultUserMessage ||
                      error?.data?.defaultUserMessage}
                  </Typography>
                  {/* {defaultErrorContent} */}
                </div>
                <CreditDirectPayRedirectButtons {...contentProps} />
              </CreditDirectPayStepPaper>
              <CreditDirectPayFooter />
            </div>
          )}
        >
          {() => (
            <>
              {
                [
                  <CreditDirectPayLAFDocument {...contentProps} />,
                  <CreditDirectPayTokenization {...contentProps} />,
                  <CreditDirectPayEnd {...contentProps} />,
                ][stepper.step]
              }
              <CreditDirectPayFooter />
            </>
          )}
        </LoadingContent>
        {isInline && stepper.step !== 2 && (
          <div className="absolute right-2 top-2">
            <IconButton
              size="small"
              className="bg-primary-main text-primary-contrastText"
              onClick={() => {
                sendEvent(CreditDirectPayEventEnum.CLOSED, {
                  reason: "USER_CLICK",
                });
              }}
            >
              <Icon>close</Icon>
            </IconButton>
          </div>
        )}
      </div>
    </Container>
  );
}

export default CreditDirectPay;
