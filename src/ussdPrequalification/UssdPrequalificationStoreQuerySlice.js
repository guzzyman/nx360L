import { RtkqTagEnum } from "common/Constants";
import { nimbleX360WrapperApi } from "common/StoreQuerySlice";

export const ussdPrequalificationQuerySlice =
  nimbleX360WrapperApi.injectEndpoints({
    endpoints: (builder) => ({
      getUSSDPrequalifications: builder.query({
        query: (params) => ({
          url: `/UssdPrequalification/GetProducts`,
          params,
        }),
        providesTags: () => [{ type: RtkqTagEnum.USSD_PREQUALIFICATION }],
      }),
      getUSSDPrequalification: builder.query({
        query: ({ id, ...params }) => ({
          url: `/UssdPrequalification/GetProduct/${id}`,
          params,
        }),
        providesTags: (data) => [
          { type: RtkqTagEnum.USSD_PREQUALIFICATION, id: data?.id },
        ],
      }),
      editUSSDPrequalification: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/UssdPrequalification/UpdateProduct/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: () => [{ type: RtkqTagEnum.USSD_PREQUALIFICATION }],
      }),
      addUSSDPrequalification: builder.mutation({
        query: ({ ...body }) => ({
          url: `/UssdPrequalification/AddProduct`,
          method: "POST",
          body,
        }),
        invalidatesTags: () => [{ type: RtkqTagEnum.USSD_PREQUALIFICATION }],
      }),
    }),
  });
