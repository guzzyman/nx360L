import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";
import { downloadFile } from "common/Utils";

export const nxEmployerDetailDeductionReportApi = nimbleX360Api.injectEndpoints(
  {
    endpoints: (builder) => ({
      generateEmployerDeduction: builder.query({
        query: (params) => ({ url: `/edr/generate`, params }),
        providesTags: (data) =>
          providesTags(data?.pageItems, RtkqTagEnum.EDR_REPORT),
      }),
      downloadEmployerDeduction: builder.mutation({
        query: ({ fileName: _, ...params }) => ({
          url: `/edr/generate/xls`,
          responseType: "blob",
          params,
        }),
        onQueryStarted: async (params, { queryFulfilled }) => {
          try {
            const { data } = await queryFulfilled;
            downloadFile(data, params.fileName);
          } catch (error) {
            console.log(error);
          }
        },
      }),
      getEmployerEDRLoanProducts: builder.query({
        query: (params) => ({ url: "/loanproducts?fields=id,name", params }),
        providesTags: (data) =>
          providesTags(data?.pageItems, RtkqTagEnum.LOAN_PRODUCTS),
      }),
    }),
  }
);
