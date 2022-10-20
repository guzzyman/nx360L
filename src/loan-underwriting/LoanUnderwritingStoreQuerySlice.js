import {RtkqTagEnum} from 'common/Constants';
import {nimbleX360Api} from 'common/StoreQuerySlice';

export const nxUnderwritingApi = nimbleX360Api.injectEndpoints ({
  endpoints: builder => ({
    getUnderwritingLoanApprovals: builder.query ({
      query: ({...params}) => ({
        url: `/loans/approval`,
        params,
      }),
      providesTags: id => [{type: RtkqTagEnum.CRM_LOAN, id}],
    }),
    getUnderwritingLoanApprovalDetails: builder.query ({
      query: id => ({
        url: `/loans/approval/${id}`,
      }),
      providesTags: id => [{type: RtkqTagEnum.CRM_LOAN, id}],
    }),
    getUnderwritingLoans: builder.query ({
      query: ({...params}) => ({
        url: `/loans`,
        params,
      }),
      providesTags: id => [{type: RtkqTagEnum.CRM_LOAN, id}],
    }),
    getUnderwritingLoanUnderWriter: builder.query ({
      query: ({...params}) => ({
        url: `/loans/underwriter`,
        params,
      }),
      providesTags: id => [{type: RtkqTagEnum.CRM_LOAN, id}],
    }),
    getUnderwritingMySalesLoans: builder.query ({
      query: ({...params}) => ({
        url: `/loans/approval/sales`,
        params,
      }),
      providesTags: id => [{type: RtkqTagEnum.CRM_LOAN, id}],
    }),
    getUnderwritingSalesLoans: builder.query ({
      query: ({...params}) => ({
        url: `/loans/approval/team/lead/sales`,
        params,
      }),
      providesTags: id => [{type: RtkqTagEnum.CRM_LOAN, id}],
    }),
    getUnderwritingL1Loans: builder.query ({
      query: ({...params}) => ({
        url: `/loans/approval/team/lead/underwriter/one`,
        params,
      }),
      providesTags: id => [{type: RtkqTagEnum.CRM_LOAN, id}],
    }),
    getUnderwritingL2Loans: builder.query ({
      query: ({...params}) => ({
        url: `/loans/approval/team/lead/underwriter/two`,
        params,
      }),
      providesTags: id => [{type: RtkqTagEnum.CRM_LOAN, id}],
    }),
  }),
});
