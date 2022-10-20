import { useEffect, useMemo } from "react";
import {
  Button,
  ButtonBase,
  Dialog,
  DialogContent,
  Icon,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import cdlBlueImage from "assets/images/cdl-logo-blue.png";
import paystackImage from "assets/images/paystack.png";
import flutterwaveImage from "assets/images/flutterwave.png";
import remitaImage from "assets/images/remita.png";
import clsx from "clsx";
import { useFormik } from "formik";
import * as yup from "yup";
import CurrencyTypography from "common/CurrencyTypography";
import CurrencyTextField from "common/CurrencyTextField";
import { formatCurrencyToNumber, getTextFieldFormikProps } from "common/Utils";
import { nanoid } from "@reduxjs/toolkit";
import useAsyncUI from "hooks/useAsyncUI";
import CreditDirectPayStepPaper from "./CreditDirectPayStepPaper";
import {
  CreditDirectPayEventEnum,
  CreditDirectPayTypeEnum,
} from "./CreditDirectPayConstant";
import LoadingContent from "common/LoadingContent";
import { generatePath, useNavigate } from "react-router-dom";
import { RouteEnum } from "common/Constants";
import currencyjs from "currency.js";

function CreditDirectPayTokenization({
  sendEvent,
  data,
  payRef,
  payType,
  stepper,
  cdlPayTokenizeCardMutationResult,
  cdlPayTokenizeCardMutation,
  generateCdlPayLinkMuation,
  generateCdlPayLinkMuationResult,
  cdlPayLoanDecideMutation,
  cdlPayLoanDecideMutationResult,
  config,
  state,
  setState,
  isTokenization,
  isRepayment,
  isFundWallet,
  isDownPayment,
  isDeductionAtSourceOnRepaymentMethods,
}) {
  const navigate = useNavigate();
  const otpAsyncUI = useAsyncUI();

  const normalizedRepaymentMethods = useMemo(() => {
    if (isFundWallet || isDownPayment) {
      return {
        [PaymentMethodIdEnum.PAYSTACK]: {
          id: PaymentMethodIdEnum.PAYSTACK,
          name: "Paystack",
        },
      };
    }

    return (
      data?.loanInfo?.loanInfo?.repaymentMethod?.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {}) || {}
    );
  }, [data?.loanInfo?.loanInfo?.repaymentMethod, isDownPayment, isFundWallet]);

  const isRemitaMandateOk = useMemo(() => {
    const dateArr = data?.loanInfo?.loanInfo?.expectedFirstRepaymentOnDate;
    if (dateArr?.length) {
      const today = new Date();
      const mandate = new Date();
      mandate.setFullYear(dateArr[0], dateArr[1] - 1, dateArr[2]);
      return mandate.getTime() >= today.getTime();
    }
    return false;
  }, [data?.loanInfo?.loanInfo?.expectedFirstRepaymentOnDate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      amount: config?.transactionAmount || 0,
      selectedMethod: isDeductionAtSourceOnRepaymentMethods ? 3 : -1,
    },
    validationSchema: yup.object({
      email: config.email
        ? yup.string().label("Email").optional()
        : yup.string().label("Email").email().required(),
      amount: yup
        .string()
        .label("Amount")
        .required()
        .test("IsPaymentAmount", "${path} is not valid", (value) => {
          const amount = parseFloat(formatCurrencyToNumber(value));

          if (isFundWallet) {
            return amount >= 50;
          }

          if (isDownPayment) {
            return amount == config?.transactionAmount;
          }

          return (
            isTokenization ||
            (amount > data?.transactionAmount &&
              amount < data?.settlementAmount)
          );
        }),
      selectedMethod: yup
        .number()
        .label("Payment Method")
        .test("IsPaymentMethod", "${path} is not valid", (value) => {
          // if (isFundWallet) {
          //   return true;
          // }
          return value >= 0 && value <= 3;
        })
        .required(),
    }),
    onSubmit: async (values) => {
      try {
        if (values.selectedMethod > -1) {
          const transactionRef = nanoid();
          const paymentTypeId =
            PAYMENT_METHOD_INDEX_TO_ID[values.selectedMethod];
          const amount = parseFloat(
            values.selectedMethod === PaymentMethodIndexEnum.REMITA
              ? config.remitaAmount
              : formatCurrencyToNumber(values.amount)
          );

          let event;

          const params = {
            title: config.title,
            description: config.title,
            firstName: config.firstname,
            lastName: config.lastname,
            email: values.email || config.email,
            currency: config.currency,
            amount,
            transactionRef,
            transactionId: state?.transactionId,
            transactionType: state?.transactionType,
            logo: cdlBlueImage,
            metadata: {},
            channels: [
              "card",
              ...(isDownPayment
                ? ["bank", "ussd", "qr", "mobile_money", "bank_transfer"]
                : []),
            ],
            onPaymentSuccess: async ({ valueRef } = {}) => {
              try {
                const tokenizationParams = {
                  payRef,
                  paymentTypeId,
                  valueRef,
                  amount,
                  locale: "en",
                  command: isFundWallet
                    ? CreditDirectPayTypeEnum.FUND_WALLET
                    : isDownPayment
                    ? CreditDirectPayTypeEnum.DOWNPAYMENT
                    : isTokenization
                    ? CreditDirectPayTypeEnum.TOKENIZATION
                    : amount > data?.transactionAmount &&
                      amount < data?.settlementAmount
                    ? CreditDirectPayTypeEnum.PREPAY
                    : amount == data?.settlementAmount
                    ? CreditDirectPayTypeEnum.FORECLOSURE
                    : CreditDirectPayTypeEnum.REPAYMENT,
                };

                event = isDeductionAtSourceOnRepaymentMethods
                  ? {
                      processing:
                        CreditDirectPayEventEnum.DEDUCTION_FROM_SOURCE_PROCESSING,
                      success:
                        CreditDirectPayEventEnum.DEDUCTION_FROM_SOURCE_SUCCESSFUL,
                      failed:
                        CreditDirectPayEventEnum.DEDUCTION_FROM_SOURCE_FAILED,
                    }
                  : {
                      [CreditDirectPayTypeEnum.FUND_WALLET]: {
                        processing:
                          CreditDirectPayEventEnum.WALLET_FUNDING_PROCESSING,
                        success:
                          CreditDirectPayEventEnum.WALLET_FUNDING_SUCCESSFUL,
                        failed: CreditDirectPayEventEnum.WALLET_FUNDING_FAILED,
                      },
                      [CreditDirectPayTypeEnum.DOWNPAYMENT]: {
                        processing:
                          CreditDirectPayEventEnum.DOWNPAYMENT_PROCESSING,
                        success:
                          CreditDirectPayEventEnum.DOWNPAYMENT_SUCCESSFUL,
                        failed: CreditDirectPayEventEnum.DOWNPAYMENT_FAILED,
                      },
                      [CreditDirectPayTypeEnum.TOKENIZATION]: {
                        processing:
                          CreditDirectPayEventEnum.CARD_TOKENIZATION_PROCESSING,
                        success:
                          CreditDirectPayEventEnum.CARD_TOKENIZATION_SUCCESSFUL,
                        failed:
                          CreditDirectPayEventEnum.CARD_TOKENIZATION_FAILED,
                      },
                      [CreditDirectPayTypeEnum.PREPAY]: {
                        processing:
                          CreditDirectPayEventEnum.LOAN_PREPAY_PROCESSING,
                        success:
                          CreditDirectPayEventEnum.LOAN_PREPAY_SUCCESSFUL,
                        failed: CreditDirectPayEventEnum.LOAN_PREPAY_FAILED,
                      },
                      [CreditDirectPayTypeEnum.FORECLOSURE]: {
                        processing:
                          CreditDirectPayEventEnum.LOAN_FORECLOSURE_PROCESSING,
                        success:
                          CreditDirectPayEventEnum.LOAN_FORECLOSURE_SUCCESSFUL,
                        failed:
                          CreditDirectPayEventEnum.LOAN_FORECLOSURE_FAILED,
                      },
                      [CreditDirectPayTypeEnum.REPAYMENT]: {
                        processing:
                          CreditDirectPayEventEnum.LOAN_REPAYMENT_PROCESSING,
                        success:
                          CreditDirectPayEventEnum.LOAN_REPAYMENT_SUCCESSFUL,
                        failed: CreditDirectPayEventEnum.LOAN_REPAYMENT_FAILED,
                      },
                    }[tokenizationParams.command];

                sendEvent(event.processing, {});

                let resData;

                resData = await cdlPayTokenizeCardMutation(
                  tokenizationParams
                ).unwrap();

                if (
                  values.selectedMethod === PaymentMethodIndexEnum.REMITA &&
                  resData?.httpStatusCode === 201
                ) {
                  const token = await otpAsyncUI.open({
                    context: { title: resData?.defaultUserMessage },
                  });
                  resData = await cdlPayTokenizeCardMutation({
                    ...tokenizationParams,
                    token,
                    valueRef: resData?.changes?.mandateId,
                    transRef: resData?.changes?.transRef,
                  }).unwrap();
                }

                if (isTokenization && config?.isMakeDownPayment) {
                  const downPaymentLinkResData =
                    await generateCdlPayLinkMuation({
                      command: "down_payment",
                      // mode: config?.mobileNo ? "mobile" : "email",
                      mode: "both",
                      loanId: config?.loanId,
                    }).unwrap();
                  // sendEvent(event.success);
                  window.location = `${window.location.origin}${generatePath(
                    RouteEnum.CREDIT_DIRECT_PAY,
                    {
                      payRef: downPaymentLinkResData?.transactionId,
                    }
                  )}`;
                  // navigate(
                  //   generatePath(RouteEnum.CREDIT_DIRECT_PAY, {
                  //     payRef: downPaymentLinkResData?.transactionId,
                  //   })
                  // );
                } else {
                  let decideData;
                  if (
                    (isTokenization || isDownPayment) &&
                    !config.isLoanActive
                  ) {
                    decideData = await cdlPayLoanDecideMutation({
                      loanId: config?.loanId,
                      takenDownPaymentWithCharges: config?.isExternalService
                        ? true //acceptDisbursementServiceFeeFromExternal
                        : false,
                      note: "send approval form Nx360 Lite (Ltrack)",
                    }).unwrap();
                  }
                  setState((s) => ({
                    ...s,
                    gateway: Object.keys(PaymentMethodIndexEnum)[
                      values.selectedMethod
                    ],
                    transactionRef: valueRef || resData?.changes?.mandateId,
                    message:
                      config.isExternalService && decideData
                        ? decideData?.changes?.status?.id == 300
                          ? "We have received your down payment and loan has been approved."
                          : "Your loan is currently in review, a loan officer will attend to you shortly."
                        : undefined,
                  }));
                  stepper.nextStep();
                  sendEvent(event.success);
                }
              } catch (error) {
                sendEvent(event.processing, {});
              }
            },
            onPaymentError: async () => {},
          };
          paymentMethods[values.selectedMethod].makePayment(params)();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <CreditDirectPayStepPaper>
        <Typography
          variant="h6"
          className="font-bold text-center text-primary-dark mb-3 mt-4 md:mt-0"
        >
          {data?.title || config?.title}
        </Typography>
        <Typography variant="body2" className="text-center text-primary-dark">
          {isTokenization && !isDeductionAtSourceOnRepaymentMethods && (
            <>
              Kindly link a valid debit/credit card associated with the bank
              account provided earlier. Your monthly repayments will be deducted
              from this card for the duration of your loan tenor.
            </>
          )}
          {isRepayment && <>Kindly provide</>}
          {isFundWallet && <>Enter Amount to Fund your Wallet</>}
          {isDownPayment && <>Make down payment</>}
        </Typography>
        {cdlPayTokenizeCardMutationResult?.error?.data?.defaultUserMessage &&
          !cdlPayTokenizeCardMutationResult?.isLoading && (
            <Typography
              // variant="body2"
              className="text-center text-error-main mt-4"
            >
              {
                cdlPayTokenizeCardMutationResult?.error?.data?.errors?.[0]
                  ?.defaultUserMessage
              }
            </Typography>
          )}
        {isDeductionAtSourceOnRepaymentMethods ? (
          <LoadingContent
            loading={
              cdlPayTokenizeCardMutationResult.isLoading ||
              cdlPayLoanDecideMutationResult?.isLoading
            }
            error={
              cdlPayTokenizeCardMutationResult.isError ||
              cdlPayLoanDecideMutationResult?.isError
            }
            onMount={formik.handleSubmit}
            onReload={formik.handleSubmit}
            loadingContent={(defaultLoadingContent) => (
              <div className="flex flex-col items-center justify-center">
                <Typography variant="h6" className="text-center font-bold mb-4">
                  Processing...
                </Typography>
                {defaultLoadingContent}
              </div>
            )}
          >
            {() => (
              <div className="flex items-center justify-center">
                {/* <Icon
              className="text-secondary-light"
              style={{ fontSize: "100px" }}
            >
              sentiment_satisfied
            </Icon> */}
              </div>
            )}
          </LoadingContent>
        ) : (
          <>
            <div className="flex flex-wrap sm:flex-nowrap justify-center gap-4 my-6">
              {paymentMethods.map((method, index) =>
                method.comingSoon ||
                // (index === PaymentMethodIndexEnum.REMITA && isTokenization) ||
                !normalizedRepaymentMethods?.[
                  PAYMENT_METHOD_INDEX_TO_ID[index]
                ] ? null : (
                  <Paper
                    key={index}
                    variant="outlined"
                    component={ButtonBase}
                    className={clsx(
                      "p-2 h-16 flex-1 relative max-w-xs",
                      formik.values.selectedMethod === index &&
                        "border-primary-light"
                    )}
                    onClick={() => {
                      formik.setFieldValue("selectedMethod", index);
                      sendEvent(
                        CreditDirectPayEventEnum.PAYMENT_METHOD_SWITCHED,
                        normalizedRepaymentMethods?.[
                          PAYMENT_METHOD_INDEX_TO_ID[index]
                        ]
                      );
                    }}
                  >
                    {formik.values.selectedMethod === index && (
                      <div className="absolute right-2 top-2 text-primary-main">
                        <Icon>
                          {formik.values.selectedMethod === index
                            ? "check_circle"
                            : "circle"}
                        </Icon>
                      </div>
                    )}
                    {method.image ? (
                      <img src={method.image} alt="img" className="h-6" />
                    ) : (
                      <Typography className="font-bold">
                        {method.name}
                      </Typography>
                    )}
                  </Paper>
                )
              )}
            </div>
            {!isTokenization && (
              <div className="mb-6 max-w-xs mx-auto">
                {isDownPayment ? (
                  <CurrencyTypography
                    variant="h5"
                    className="text-center font-bold"
                  >
                    {formik.values?.amount}
                  </CurrencyTypography>
                ) : formik.values.selectedMethod > -1 ? (
                  <CurrencyTextField
                    fullWidth
                    required
                    margin="normal"
                    label="Enter Amount"
                    {...getTextFieldFormikProps(formik, "amount")}
                  />
                ) : null}
                {!config.email && (
                  <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Enter Email"
                    {...getTextFieldFormikProps(formik, "email")}
                  />
                )}
              </div>
            )}
            {(formik.values.selectedMethod === PaymentMethodIndexEnum.REMITA ||
              formik.values.selectedMethod ===
                PaymentMethodIndexEnum.SOURCE) && (
              <div className="mb-4">
                <Typography className="font-bold text-center text-primary-dark mb-3 mt-4 md:mt-0">
                  Repayment Amount (
                  <CurrencyTypography component="span">
                    {config.remitaAmount}
                  </CurrencyTypography>
                  )
                </Typography>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "First Name",
                      value: config?.firstname,
                    },
                    {
                      label: "Last Name",
                      value: config?.lastname,
                    },
                    {
                      label: "Email",
                      value: config?.email,
                    },
                    ...(formik.values.selectedMethod ===
                    PaymentMethodIndexEnum.SOURCE
                      ? []
                      : [
                          // { label: "Bank", value: config?.bank?.name },
                          // {
                          //   label: "Account Name",
                          //   value: config?.bank?.accountname,
                          // },
                          // {
                          //   label: "Account Number",
                          //   value: config?.bank?.accountnumber,
                          // },
                        ]),
                    {
                      label: "First Repayment Date",
                      value:
                        data?.loanInfo?.loanInfo?.expectedFirstRepaymentOnDate?.join(
                          "-"
                        ),
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="">
                      <Typography
                        variant="body2"
                        className="text-text-secondary"
                      >
                        {label}
                      </Typography>
                      {typeof value === "object" ? (
                        value
                      ) : (
                        <Typography>
                          {value !== undefined && value !== null && value !== ""
                            ? value
                            : "-"}
                        </Typography>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {formik.values.selectedMethod !== -1 ? (
              formik.values.selectedMethod === PaymentMethodIndexEnum.REMITA &&
              !isRemitaMandateOk ? (
                <Typography
                  color="error"
                  className="text-center font-bold uppercase"
                >
                  Mandate Outdated
                </Typography>
              ) : (
                <div className="flex items-center justify-center">
                  <LoadingButton
                    disabled={!formik.isValid}
                    loading={
                      cdlPayTokenizeCardMutationResult.isLoading ||
                      generateCdlPayLinkMuationResult.isLoading
                    }
                    loadingPosition="end"
                    endIcon={<></>}
                    onClick={formik.handleSubmit}
                    fullWidth
                    className="max-w-xs"
                  >
                    {formik.values.selectedMethod ===
                      PaymentMethodIndexEnum.REMITA ||
                    formik.values.selectedMethod ===
                      PaymentMethodIndexEnum.SOURCE ? (
                      "Proceed"
                    ) : (
                      <>
                        {cdlPayTokenizeCardMutationResult.isLoading ||
                        cdlPayLoanDecideMutationResult?.isLoading ? (
                          isTokenization ? (
                            "Tokenizing Card"
                          ) : (
                            "Processing Payment"
                          )
                        ) : (
                          <>
                            {isFundWallet ? "Fund" : "Pay"}&nbsp;&nbsp;
                            <CurrencyTypography component="span">
                              {formik.values.amount}
                            </CurrencyTypography>
                          </>
                        )}
                      </>
                    )}
                  </LoadingButton>
                </div>
              )
            ) : null}
          </>
        )}
      </CreditDirectPayStepPaper>
      {otpAsyncUI.render(({ context, setContext, resolve }) => (
        <Dialog open fullWidth maxWidth="xs">
          <DialogContent>
            <Typography className="font-bold text-center text-primary-dark mb-4">
              {context?.title}
            </Typography>
            <div className="max-w-xs mx-auto">
              <TextField
                margin="normal"
                fullWidth
                label="Enter OTP"
                value={context?.otp || ""}
                onChange={(e) =>
                  setContext({ ...context, otp: e.target.value })
                }
              />
              <div className="flex items-center justify-center">
                <Button
                  disabled={!context?.otp}
                  onClick={() => resolve(context?.otp)}
                >
                  Verify
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}

export default CreditDirectPayTokenization;

const paymentMethods = [
  {
    comingSoon: true,
    image: flutterwaveImage,
    makePayment: (params) => () => {
      if (window.FlutterwaveCheckout) {
        const flutterwaveCheckout = window.FlutterwaveCheckout({
          public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
          tx_ref: params.transactionRef,
          currency: params.currency,
          amount: params?.amount,
          customer: {
            email: params.email,
            name: params.name,
          },
          customizations: {
            title: params.title,
            description: params.descritpion,
            logo: params.logo,
          },
          callback: () => {},
          onclose: () => {},
        });
        return;
      }
    },
  },
  {
    image: paystackImage,
    makePayment: (params) => () => {
      if (window.PaystackPop) {
        const paystackPop = window.PaystackPop.setup({
          key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
          ref: params.transactionRef,
          email: params.email,
          currency: params.currency,
          amount: currencyjs(params?.amount).multiply(100).value,
          channels: params?.channels,
          metadata: params?.metadata,
          callback: ({ reference }) =>
            params.onPaymentSuccess({ valueRef: reference }),
        });
        paystackPop.openIframe();
        return;
      }
    },
  },
  {
    // comingSoon: true,
    image: remitaImage,
    makePayment: (params) => () => {
      params.onPaymentSuccess();
      // if (window.RmPaymentEngine) {
      //   const rmPaymentEngine = window.RmPaymentEngine.init({
      //     key: process.env.REACT_APP_REMITA_PUBLIC_KEY,
      //     transactionId: params.transactionRef,
      //     firstName: params.firstName,
      //     lastName: params.lastName,
      //     customerId: params.email,
      //     email: params.email,
      //     currency: params.currency,
      //     amount: params?.amount,
      //     narration: params.description,
      //     onSuccess: function (response) {
      //       console.log("callback Successful Response", response);
      //     },
      //     onError: function (response) {
      //       console.log("callback Error Response", response);
      //     },
      //     onClose: function () {
      //       console.log("closed");
      //     },
      //   });
      //   rmPaymentEngine.showPaymentWidget();
      //   return;
      // }
    },
  },
  {
    comingSoon: true,
    name: "Deduction At Source",
    makePayment: (params) => () => {
      params.onPaymentSuccess();
    },
  },
];

const PAYMENT_METHOD_INDEX_TO_ID = [1, 2, 4, 5];

const PaymentMethodIdEnum = {
  FLUTTERWAVE: 1,
  PAYSTACK: 2,
  REMITA: 4,
  SOURCE: 5,
};

const PaymentMethodIndexEnum = {
  FLUTTERWAVE: 0,
  PAYSTACK: 1,
  REMITA: 2,
  SOURCE: 3,
};
