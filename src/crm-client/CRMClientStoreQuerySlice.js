import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";
import { objectToFormData } from "common/Utils";

export const nimbleX360CRMClientApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getCRMClients: builder.query({
      query: (params) => ({ url: "/clients", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_CLIENT),
    }),
    getCRMClient: builder.query({
      query: ({ id, ...params }) => ({ url: "/clients/" + id, params }),
      providesTags: (data) => [{ type: RtkqTagEnum.CRM_CLIENT, id: data?.id }],
    }),
    getCRMClientSearch: builder.query({
      query: ({ ...params }) => ({ url: "/search", params }),
      providesTags: (data) => [{ type: RtkqTagEnum.CRM_CLIENT, id: data?.id }],
    }),
    getCRMCDLClient: builder.query({
      query: (id) => ({ url: "/clients/cdl/" + id }),
      providesTags: (data) => [
        { type: RtkqTagEnum.CRM_CLIENT, id: data?.clients.id },
      ],
    }),

    getCRMClientCreditReport: builder.query({
      query: (loanId) => ({ url: "/creditreport?loanId=" + loanId }),
      providesTags: (data) => [{ type: RtkqTagEnum.CRM_CLIENT, id: data?.id }],
    }),

    getCRMClientLoanAnalysis: builder.query({
      query: (id) => ({ url: "/loans/" + id + "/analysis" }),
      providesTags: (data) => [{ type: RtkqTagEnum.CRM_CLIENT, id: data?.id }],
    }),
    //loans/{clientId}/analysis

    addCRMClient: builder.mutation({
      query: (data) => ({ url: "/clients/cdl", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_CLIENT }],
    }),
    updateCRMClient: builder.mutation({
      query: (data) => ({ url: "/clients/cdl", data, method: "put" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_CLIENT }],
    }),
    getCRMClientImage: builder.query({
      query: (id) => ({ url: `/clients/${id}/images` }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_CLIENT, id }],
    }),
    getCRMClientLoans: builder.query({
      query: ({ ...params }) => ({
        url: `/loans`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_LOAN, id }],
    }),
    getClientLoans: builder.query({
      query: (id) => ({ url: `/clients/${id}/accounts?fields=loanAccounts` }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_LOAN, id }],
    }),
    getClientAccount: builder.query({
      query: ({ id, ...params }) => ({
        url: `/clients/${id}/accounts`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_WALLET }],
    }),
    getClientLoadDetails: builder.query({
      query: ({ loanId, ...params }) => ({
        url: `/loans/${loanId}`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_LOAN, id }],
    }),
    addCRMClientLoan: builder.mutation({
      query: (data) => ({ url: "/loans/cdl", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_LOAN }],
    }),

    addClientLoan: builder.mutation({
      query: ({ params, ...data }) => ({
        url: "/loans",
        params,
        data,
        method: "post",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_LOAN }],
    }),
    putCRMClientLoan: builder.mutation({
      query: ({ loanId, ...params }) => ({
        url: `/loans/${loanId}`,
        method: "PUT",
        data: params,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_LOAN }],
    }),
    getCRMClientsLoanTemplate: builder.query({
      query: (params) => ({
        url: "/loans/template",
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TEMPLATE),
    }),
    getCRMClientsLoanTransactionTemplate: builder.query({
      query: ({ loanId, ...params }) => ({
        url: `/loans/${loanId}/transactions/template`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TRANSACTION_TEMPLATE),
    }),
    addCRMClientLoanNote: builder.mutation({
      query: ({ loanId, ...params }) => ({
        url: `/loans/${loanId}/notes`,
        method: "POST",
        data: params,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_NOTE }],
    }),
    updateCRMClientLoanNote: builder.mutation({
      query: ({ loanId, noteId, ...params }) => ({
        url: `/loans/${loanId}/notes/${noteId}`,
        method: "PUT",
        data: params,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_NOTE }],
    }),
    deleteCRMClientLoanNote: builder.mutation({
      query: ({ loanId, noteId }) => ({
        url: `/loans/${loanId}/notes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_NOTE }],
    }),
    getCRMClientsLoanNotes: builder.query({
      query: (loanId) => ({
        url: `/loans/${loanId}/notes`,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_NOTE),
    }),
    getCRMClientsLoanNote: builder.query({
      query: ({ loanId, noteId }) => ({
        url: `/loans/${loanId}/notes/${noteId}`,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_NOTE),
    }),
    getCRMClientsLoanDocuments: builder.query({
      query: (loanId) => ({
        url: `/loans/${loanId}/documents`,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_LOAN_DOCUMENT),
    }),
    addCRMClientLoanDocument: builder.mutation({
      query: ({ loanId, ...params }) => ({
        url: `/loans/${loanId}/documents`,
        method: "POST",
        data: objectToFormData(params),
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.CRM_LOAN_DOCUMENT },
        { type: RtkqTagEnum.CRM_LOAN },
      ],
    }),
    deleteCRMClientLoanDocument: builder.mutation({
      query: ({ loanId, noteId }) => ({
        url: `/loans/${loanId}/documents/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.CRM_LOAN_DOCUMENT },
        { type: RtkqTagEnum.CRM_LOAN },
      ],
    }),
    previewCRMClientLoanDocument: builder.query({
      query: ({ loanId, documentId }) => ({
        url: `loans/${loanId}/documents/${documentId}/attachment?tenantIdentifier=default `,
      }),
    }),
    addCRMClientLoanPrepayLoan: builder.mutation({
      query: ({ loanId, params, ...body }) => ({
        url: `/loans/${loanId}/transactions`,
        params,
        method: "POST",
        data: body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_LOAN }],
    }),
    addCRMClientRescheduleLoan: builder.mutation({
      query: ({ params, ...body }) => ({
        url: `/rescheduleloans`,
        params,
        method: "POST",
        data: body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_LOAN }],
    }),
    getCRMClientsLoanRescheduleTemplate: builder.query({
      query: (params) => ({
        url: "/rescheduleloans/template",
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TEMPLATE),
    }),
    getCRMClientRescheduleLoan: builder.query({
      query: (params) => ({
        url: "/rescheduleloans",
        params,
      }),
      providesTags: [RtkqTagEnum.RESCHEDULE_LOAN],
    }),
    getCRMClientRescheduleLoanDetails: builder.query({
      query: ({ id, ...params }) => ({
        url: `/rescheduleloans/${id}`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TEMPLATE),
    }),
    postCRMClientRescheduleLoan: builder.mutation({
      query: ({ id, params, ...body }) => ({
        url: `/rescheduleloans/${id}`,
        params,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [RtkqTagEnum.RESCHEDULE_LOAN],
    }),
    getCRMClientAttachment: builder.query({
      query: (clientId) => ({
        url: `/clients/${clientId}/identifiers/attachment`,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_DOCUMENT }],
    }),
    addCRMClientLoanAssignLoan: builder.mutation({
      query: ({ loanId, params, ...body }) => ({
        url: `/loans/${loanId}`,
        params,
        method: "POST",
        data: body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_LOAN }],
    }),
    addCRMClientActions: builder.mutation({
      query: ({ clientId, params, ...body }) => ({
        url: `/clients/${clientId}`,
        params,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (data) => [
        { type: RtkqTagEnum.CRM_CLIENT, id: data?.id },
      ],
    }),
    addCRMClientCommandActions: builder.mutation({
      query: ({ clientId, command, ...body }) => ({
        url: `/clients/${clientId}?command=${command}`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (data) => [
        { type: RtkqTagEnum.CRM_CLIENT, id: data?.id },
        { type: RtkqTagEnum.CRM_LEAD },
      ],
    }),
    addCRMClientLoanDocumentInitial: builder.mutation({
      query: ({ loanId, ...params }) => ({
        url: `/loans/${loanId}/documents/bulkbase64`,
        method: "POST",
        data: params?.value,
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.CRM_LOAN_DOCUMENT },
        { type: RtkqTagEnum.CRM_LOAN },
      ],
    }),
    getCRMClientsSummary: builder.query({
      query: ({ clientId, ...params }) => ({
        url: `/clients/${clientId}/accounts/summary`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_CLIENT_SUMMARY),
    }),
    getCRMClientsLoanActivationTemplate: builder.query({
      query: ({ loanId, ...params }) => ({
        url: `/loans/${loanId}/template`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TRANSACTION_TEMPLATE),
    }),
    getCRMClientsTemplate: builder.query({
      query: ({ ...params }) => ({
        url: `/clients/template`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TRANSACTION_TEMPLATE),
    }),
    getCRMClientLoansUnderWriter: builder.query({
      query: ({ ...params }) => ({
        url: `/loans/underwriter`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_LOAN, id }],
    }),
    getCRMClientLoansApproval: builder.query({
      query: ({ ...params }) => ({
        url: `/loans/approval`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_LOAN, id }],
    }),
    getCRMClientLoansApprovalDetails: builder.query({
      query: (id) => ({
        url: `/loans/approval/${id}`,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_LOAN, id }],
    }),
    getCRMClientFixedDepositTemplate: builder.query({
      query: ({ ...params }) => ({
        url: `/fixeddepositaccounts/template`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TEMPLATE),
    }),
    addCRMClientFixedDeposit: builder.mutation({
      query: ({ params, ...body }) => ({
        url: `/fixeddepositaccounts`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_WALLET }],
    }),
    putCRMClientFixedDeposit: builder.mutation({
      query: ({ depositId, ...body }) => ({
        url: `/fixeddepositaccounts/${depositId}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_WALLET }],
    }),
    getCRMClientFixedDeposit: builder.query({
      query: ({ ...params }) => ({
        url: `/fixeddepositaccounts/template`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TEMPLATE),
    }),
    addCRMClientLoanDSR: builder.mutation({
      query: (data) => ({ url: "/loans/cdl/dsr", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_LOAN }],
    }),
    getClientSavingsAccountDetails: builder.query({
      query: ({ walletId, ...params }) => ({
        url: `/savingsaccounts/${walletId}`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_WALLET, id }],
    }),
    getClientdataTables: builder.query({
      query: ({ ...params }) => ({
        url: `/datatables`,
        params,
      }),
    }),
    getClientSavingsAccountTransactionDetails: builder.query({
      query: ({ walletId, transactionId, ...params }) => ({
        url: `/savingsaccounts/${walletId}/transactions/${transactionId}`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_WALLET, id }],
    }),
    getClientFixedDepositAccountDetails: builder.query({
      query: ({ fixedDepositId, ...params }) => ({
        url: `/fixeddepositaccounts/${fixedDepositId}`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.FIXED_DEPOSIT }],
    }),
    getClientStadingInstructions: builder.query({
      query: ({ ...params }) => ({
        url: `/standinginstructions`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.STANDING_INSTRUCTIONS, id }],
    }),

    // wallet actions slice
    getCRMClientsSavingAccountTransactionTemplate: builder.query({
      query: ({ walletId, ...params }) => ({
        url: `/savingsaccounts/${walletId}/transactions/template`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TRANSACTION_TEMPLATE),
    }),
    getCRMClientsSavingAccountAccountTransferTemplate: builder.query({
      query: ({ ...params }) => ({
        url: `/accounttransfers/template`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TRANSACTION_TEMPLATE),
    }),
    addCRMClientSavingsAccountTransactionAction: builder.mutation({
      query: ({ walletId, params, ...body }) => ({
        url: `/savingsaccounts/${walletId}/transactions`,
        params,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (data) => [
        { type: RtkqTagEnum.CRM_WALLET, id: data?.id },
      ],
    }),
    addCRMClientSavingsAccountDetailsAction: builder.mutation({
      query: ({ walletId, params, ...body }) => ({
        url: `/savingsaccounts/${walletId}`,
        params,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (data) => [
        { type: RtkqTagEnum.CRM_WALLET, id: data?.id },
      ],
    }),
    putCRMClientSavingsAccountDetailsAction: builder.mutation({
      query: ({ walletId, params, ...body }) => ({
        url: `/savingsaccounts/${walletId}`,
        params,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (data) => [
        { type: RtkqTagEnum.CRM_WALLET, id: data?.id },
        { type: RtkqTagEnum.FIXED_DEPOSIT },
      ],
    }),
    addCRMClientSavingsAccountAccountTransfer: builder.mutation({
      query: ({ ...body }) => ({
        url: `/accounttransfers`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (data) => [
        { type: RtkqTagEnum.CRM_WALLET, id: data?.id },
        { type: RtkqTagEnum.CRM_LOAN },
      ],
    }),

    // fixed deposit actions slice
    addCRMClientFixedDepositDetailsAction: builder.mutation({
      query: ({ fixedDepositId, params, ...body }) => ({
        url: `/fixeddepositaccounts/${fixedDepositId}`,
        params,
        method: "POST",
        data: body,
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.FIXED_DEPOSIT },
        { type: RtkqTagEnum.CRM_WALLET },
      ],
    }),
    getCRMClientsChargesDetail: builder.query({
      query: ({ id, ...params }) => ({
        url: `/charges/${id}`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.FIXED_DEPOSIT),
    }),
    getCRMClientsChargesDetailList: builder.query({
      query: ({ fixedDepositId, ...params }) => ({
        url: `/savingsaccounts/${fixedDepositId}/charges/template`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.FIXED_DEPOSIT),
    }),
    addCRMClientCharges: builder.mutation({
      query: ({ fixedDepositId, ...body }) => ({
        url: `/savingsaccounts/${fixedDepositId}/charges`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.FIXED_DEPOSIT }],
    }),
    getClientTracking: builder.query({
      query: ({ accountNumber, ...params }) => ({
        url: `/clients/${accountNumber}/tracking`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_TRACKING }],
    }),
    getCRMEmployerSummary: builder.query({
      query: ({ clientId, businessId, ...params }) => ({
        url: `/employers/${clientId}/accounts/${businessId}/summary`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_CLIENT_SUMMARY),
    }),
    getClientActivities: builder.query({
      query: ({ accountNumber, ...params }) => ({
        url: `/channels/${accountNumber}/client`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_ACTIVITIES }],
    }),
    getCRMClientConfiguration: builder.query({
      query: ({ ...params }) => ({
        url: `/cdl/configuration`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_CLIENT_CONFIGURATION),
    }),
    getCRMClientConfigurationCodes: builder.query({
      query: ({ cdlConfigurationId, ...params }) => ({
        url: `/cdl/configuration/${cdlConfigurationId}/codes`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_CLIENT_CONFIGURATION),
    }),
    getCRMClientLoanLAF: builder.query({
      query: ({ loanId, ...params }) => ({
        url: `/loans/${loanId}/laf`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.LOAN_AGREEMENT_FORM }],
    }),
    getCRMClientIndebtedness: builder.query({
      query: (clientId) => ({
        url: `/clients/${clientId}/loan/letter/email`,
      }),
    }),
    getCRMClientFixedDepositCertificate: builder.query({
      query: (fixedDepositId) => ({
        url: `/savingsaccounts/${fixedDepositId}/letter/email`,
      }),
    }),
    getCRMClientBank: builder.query({
      query: (clientId) => ({
        url: `/clients/${clientId}/banks`,
      }),
    }),
    putCRMClientBank: builder.mutation({
      query: ({ clientId, bankId, ...body }) => ({
        url: `/clients/${clientId}/banks/${bankId}`,
        method: "PUT",
        data: body,
        invalidatesTags: () => [{ type: RtkqTagEnum.CRM_CLIENT }],
      }),
    }),
    acceptCRMClientLAFToken: builder.mutation({
      query: ({ loanId, token, ...body }) => ({
        url: `/loans/${loanId}/laf/otp/${token}/accept`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.LOAN_AGREEMENT_FORM }],
    }),
    getCRMClientLAFToken: builder.mutation({
      query: ({ loanId, mode }) => ({
        url: `/loans/${loanId}/laf/otp/${mode}`,
      }),
    }),
    getClientLoanTransactionDetails: builder.query({
      query: ({ loanId, transactionId, ...params }) => ({
        url: `/loans/${loanId}/transactions/${transactionId}`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_LOAN, id }],
    }),
    postClientLoanTransactionDetails: builder.mutation({
      query: ({ loanId, transactionId, params, ...body }) => ({
        url: `/loans/${loanId}/transactions/${transactionId}`,
        method: "POST",
        params,
        data: body,
      }),
      invalidatesTags: (id) => [{ type: RtkqTagEnum.CRM_LOAN, id }],
    }),

    getCRMClientReoccurringFixedDepositTemplate: builder.query({
      query: ({ ...params }) => ({
        url: `/recurringdepositaccounts/template`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TEMPLATE),
    }),
    getClientReoccurringFixedDepositAccountDetails: builder.query({
      query: ({ fixedDepositId, ...params }) => ({
        url: `/recurringdepositaccounts/${fixedDepositId}`,
        params,
      }),
      providesTags: (id) => [{ type: RtkqTagEnum.FIXED_DEPOSIT }],
    }),
    addCRMClientReoccurringFixedDeposit: builder.mutation({
      query: ({ params, ...body }) => ({
        url: `/recurringdepositaccounts`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_WALLET }],
    }),
    putCRMClientReoccurringFixedDeposit: builder.mutation({
      query: ({ depositId, ...body }) => ({
        url: `/recurringdepositaccounts/${depositId}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_WALLET }],
    }),
    addCRMClientReoccurringFixedDepositDetailsAction: builder.mutation({
      query: ({ fixedDepositId, params, ...body }) => ({
        url: `/recurringdepositaccounts/${fixedDepositId}`,
        params,
        method: "POST",
        data: body,
      }),
      invalidatesTags: () => [
        { type: RtkqTagEnum.FIXED_DEPOSIT },
        { type: RtkqTagEnum.CRM_WALLET },
      ],
    }),
    postCRMClientReoccurringFixedDepositTransactionDetails: builder.mutation({
      query: ({ depositId, params, ...body }) => ({
        url: `/recurringdepositaccounts/${depositId}/transactions`,
        method: "POST",
        params,
        data: body,
      }),
      invalidatesTags: (id) => [
        { type: RtkqTagEnum.FIXED_DEPOSIT },
        { type: RtkqTagEnum.CRM_WALLET },
      ],
    }),
    getCRMClientsReoccurringFixedDepositTransactionTemplate: builder.query({
      query: ({ fixedDepositId, ...params }) => ({
        url: `/recurringdepositaccounts/${fixedDepositId}/transactions/template`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TRANSACTION_TEMPLATE),
    }),
    getCRMClientVendorLoan: builder.query({
      query: ({ ...params }) => ({
        url: `/vendor/loan`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_TEMPLATE),
    }),
    getUsers: builder.query({
      query: ({ ...params }) => ({
        url: "/users",
        params,
      }),
    }),
    assignLoanUnderwriterOfficer: builder.mutation({
      query: ({ loanId, params, ...body }) => ({
        url: `/loans/approval/${loanId}`,
        method: "POST",
        params,
        data: body,
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_LOAN }],
    }),
  }),
});
