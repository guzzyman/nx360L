import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";
// import { tr } from "date-fns/locale";

export const nimbleX360JournalEntriesApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getOffices: builder.query({
      query: (params) => ({ url: "/offices", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    getPaymentTypes: builder.query({
      query: (params) => ({ url: "/paymenttypes", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    getGlAccounts: builder.query({
      query: (params) => ({
        url: "glaccounts",
        params: {
          disabled: false,
          manualEntriesAllowed: true,
          usage: 1
        },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    getCurrencies: builder.query({
      query: (params) => ({
        url: "currencies",
        params: {
          fields: 'selectedCurrencyOptions',
        },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    searchJournalEntries: builder.query({
      query: (params) => ({
        url: `/journalentries`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    journalEntryDetail: builder.query({
      query: (id) => ({
        url: `/journalentries`,
        params: {
          transactionDetails: true,
          transactionId: `${id}`,
        },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    addJournalEntry: builder.mutation({
      query: (data) => ({ url: "/journalentries", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CHARGE_PRODUCT }],
    }),
    reverseJournalEntry: builder.mutation({
      query: ({id, ...data}) => ({
        url: `/journalentries/${id}`, data, method: `post`, params: {
          command: 'reverse',
        }
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CHARGE_PRODUCT }],
    }),
  }),
});
