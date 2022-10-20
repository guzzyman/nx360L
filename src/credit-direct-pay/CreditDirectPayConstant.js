export const CreditDirectPayTypeEnum = {
  TOKENIZATION: "t",
  REPAYMENT: "r",
  FUND_WALLET: "f",
  PREPAY: "p",
  FORECLOSURE: "c",
  DOWNPAYMENT: "d",
};

export const CreditDirectPayEventEnum = {
  OPENED: "OPENED",
  CLOSED: "CLOSED",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  LAF_LOADED: "LAF_LOADED",
  LAF_SIGNING_PROCESSING: "LAF_SIGNING_PROCESSING",
  LAF_SIGNING_FAILED: "LAF_SIGNING_FAILED",
  LAF_SIGNING_SUCCESSFUL: "LAF_SIGNING_SUCCESSFUL",
  PAYMENT_METHOD_SWITCHED: "PAYMENT_METHOD_SWITCHED",
  CARD_TOKENIZATION_PROCESSING: "CARD_TOKENIZATION_PROCESSING",
  CARD_TOKENIZATION_SUCCESSFUL: "CARD_TOKENIZATION_SUCCESSFUL",
  CARD_TOKENIZATION_FAILED: "CARD_TOKENIZATION_FAILED",
  DEDUCTION_FROM_SOURCE_PROCESSING: "DEDUCTION_FROM_SOURCE_PROCESSING",
  DEDUCTION_FROM_SOURCE_SUCCESSFUL: "DEDUCTION_FROM_SOURCE_SUCCESSFUL",
  DEDUCTION_FROM_SOURCE_FAILED: "DEDUCTION_FROM_SOURCE_FAILED",
  WALLET_FUNDING_PROCESSING: "WALLET_FUNDING_PROCESSING",
  WALLET_FUNDING_SUCCESSFUL: "WALLET_FUNDING_SUCCESSFUL",
  WALLET_FUNDING_FAILED: "WALLET_FUNDING_FAILED",
  LOAN_REPAYMENT_PROCESSING: "LOAN_REPAYMENT_PROCESSING",
  LOAN_REPAYMENT_SUCCESSFUL: "LOAN_REPAYMENT_SUCCESSFUL",
  LOAN_REPAYMENT_FAILED: "LOAN_REPAYMENT_FAILED",
  LOAN_PREPAY_PROCESSING: "LOAN_PREPAY_PROCESSING",
  LOAN_PREPAY_SUCCESSFUL: "LOAN_PREPAY_SUCCESSFUL",
  LOAN_PREPAY_FAILED: "LOAN_PREPAY_FAILED",
  LOAN_FORECLOSURE_PROCESSING: "LOAN_FORECLOSURE_PROCESSING",
  LOAN_FORECLOSURE_SUCCESSFUL: "LOAN_FORECLOSURE_SUCCESSFUL",
  LOAN_FORECLOSURE_FAILED: "LOAN_FORECLOSURE_FAILED",
  DOWNPAYMENT_PROCESSING: "DOWNPAYMENT_PROCESSING",
  DOWNPAYMENT_SUCCESSFUL: "DOWNPAYMENT_SUCCESSFUL",
  DOWNPAYMENT_FAILED: "DOWNPAYMENT_FAILED",
};

export const CreditDirectPayMethodIdEnum = {
  FLUTTERWAVE: 1,
  PAYSTACK: 2,
  REMITA: 4,
  SOURCE: 5,
};

export const CreditDirectPayMethodIndexEnum = {
  FLUTTERWAVE: 0,
  PAYSTACK: 1,
  REMITA: 2,
  SOURCE: 3,
};