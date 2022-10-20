import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";
import { downloadFile } from "common/Utils";
// import { tr } from "date-fns/locale";

export const nimbleX360ReportApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: ({ R_reportCategory, ...params }) => ({
        url:
          R_reportCategory === "All"
            ? "/runreports/FullReportList"
            : "/runreports/reportCategoryList",
        params: {
          R_reportCategory:
            R_reportCategory === "All" ? undefined : R_reportCategory,
          genericResultSet: false,
          parameterType: true,
          ...params,
        },
      }),
      transformResponse: (data) => {
        return Object.values(
          data?.reduce((acc, curr) => {
            acc[curr.report_name] = curr;
            return acc;
          }, {}) || {}
        );
      },
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),

    getReportsById: builder.query({
      query: ({ R_reportListing, ...params }) => ({
        url: "/runreports/FullParameterList",
        params: {
          R_reportListing: R_reportListing,
          parameterType: true,
          ...params,
        },
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),

    getReportSelectOptions: builder.query({
      query: ({ pathVarable, ...params }) => ({
        url: `/runreports/${pathVarable}?parameterType=true`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),

    runReport: builder.mutation({
      query: ({ R_reportListing, ...params }) => ({
        url: `/runreports/${R_reportListing}`,
        params,
      }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CHARGE_PRODUCT),
    }),
    
    exportReport: builder.mutation({
      query: ({ R_reportListing, ...params }) => ({
        url: `/runreports/${R_reportListing}`,
        params,
        responseType: "blob",
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
  }),
});
