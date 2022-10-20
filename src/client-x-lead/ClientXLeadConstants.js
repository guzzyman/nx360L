export const ClientXLeadStatusColorEnum = {
  50: 'info',
  100: 'warning',
  300: 'success',
  600: 'error',
};

export const ClientXLeadStatusNameColorEnum = {
  INVALID: 'error',
  INACTIVE: 'error',
  INCOMPLETE: 'info',
  PENDING: 'warning',
  ACTIVE: 'success',
  TRANSFER_IN_PROGRESS: 'warning',
  TRANSFER_ON_HOLD: 'warning',
  CLOSED: 'error',
};

export const ClientXLeadStatusEnum = {
  INVALID: 'Invalid',
  INCOMPLETE: 'InComplete',
  PENDING: 'Pending',
  ACTIVE: 'Active',
  TRANSFER_IN_PROGRESS: 'TransferInProgress',
  TRANSFER_ON_HOLD: 'TransferOnHold',
  CLOSED: 'Closed',
};

export const ClientXLeadSavingsDepositTypeDeEnum = {
  SAVING: 100,
  FIXED_DEPOSIT: 200,
  RECURRING_FIXED_DEPOSIT: 300,
};

export const ClientXLeadLoanStatusColorEnum = {
  50: 'info',
  100: 'warning',
  300: 'success',
  600: 'error',
  true: 'success',
  false: 'status-deleted',
  Active: 'success',
  'charges.StatusType.active.true': 'success',
  'loanStatusType.submitted.and.pending.approval': 'warning',
  'loanStatusType.approved': 'info',
  'loanStatusType.active': 'success',
  'loanStatusType.overpaid': 'info',
  'savingsAccountStatusType.submitted.and.pending.approval': 'warning',
  'savingsAccountStatusType.approved': 'info',
  'savingsAccountStatusType.active': 'success',
  'savingsAccountStatusType.activeInactive': 'success',
  'savingsAccountStatusType.activeDormant': 'success',
  'savingsAccountStatusType.matured': 'warning',
  'shareAccountStatusType.submitted.and.pending.approval': 'warning',
  'shareAccountStatusType.approved': 'info',
  'shareAccountStatusType.active': 'success',
  'shareAccountStatusType.rejected': 'status-rejected',
  'loanProduct.active': 'success',
  'loanProduct.inActive': 'error',
  'clientStatusType.pending': 'warning',
  'clientStatusType.closed': 'status-closed',
  'clientStatusType.rejected': 'status-rejected', // write
  'clientStatusType.withdraw': 'status-withdraw', // write
  'clientStatusType.active': 'success',
  'clientStatusType.submitted.and.pending.approval': 'warning',
  'clientStatusTYpe.approved': 'info',
  'clientStatusType.transfer.in.progress': 'warning', // write
  'clientStatusType.transfer.on.hold': 'warning', // write
  'groupingStatusType.active': 'success',
  'groupingStatusType.pending': 'warning',
  'groupingStatusType.submitted.and.pending.approval': 'warning',
  'groupingStatusType.approved': 'info',
  'smsCampaignStatus.active': 'success',
  'smsCampaignStatus.pending': 'warning',
  'smsCampaignStatus.closed': 'status-closed',
  'purchasedSharesStatusType.applied': 'warning',
  'loanStatusType.sales.submitted.and.pending.approval': 'secondary',
};

export const LagacySystemsEnum = {
  MUSELEND: 'muselend',
  MAMBU: 'mambu',
};
