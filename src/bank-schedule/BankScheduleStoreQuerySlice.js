import { RtkqTagEnum } from "common/Constants";
import { nimbleX360WrapperApi } from "common/StoreQuerySlice";
import { objectToFormData } from "common/Utils";

export const BankScheduleStoreQuerySlice = nimbleX360WrapperApi.injectEndpoints(
  {
    endpoints: (builder) => ({
      getBankSchedules: builder.query({
        query: (params) => ({
          url: "/BankSchedule/get",
          params,
        }),
        providesTags: () => [{ type: RtkqTagEnum.BANK_SCHEDULE }],
      }),
      downloadBankSchedules: builder.query({
        query: (id) => ({
          url: `/BankSchedule/DownloadSchedule/${id}`,
          responseHandler: async (response) =>
            window.location.assign(
              window.URL.createObjectURL(await response.blob())
            ),
        }),
      }),
      getBankSchedule: builder.query({
        query: ({ id, ...params }) => ({
          url: `/BankSchedule/Get/${id}`,
          params,
        }),
        providesTags: (data) => [
          { type: RtkqTagEnum.BANK_SCHEDULE, id: data?.id },
        ],
      }),
      uploadBankSchedule: builder.mutation({
        query: (data) => ({
          url: `/Channels/UploadBankSchedule`,
          method: "POST",
          body: objectToFormData(data),
        }),
        invalidatesTags: () => [{ type: RtkqTagEnum.BANK_SCHEDULE }],
      }),
      deleteBankSchedule: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/BankSchedule/Delete/${id}`,
          method: "POST",
          body,
        }),
        invalidatesTags: () => [{ type: RtkqTagEnum.BANK_SCHEDULE }],
      }),
      getUploadedFiles: builder.mutation({
        query: ({ ...body }) => ({
          url: `/Channels/GetUploadedFiles`,
          data: body,
          method: "POST",
        }),
      }),
      downloadDocumentSample: builder.query({
        query: () => ({
          url: `/Channels/DownloadSample`,
          responseHandler: async (response) =>
            window.location.assign(
              window.URL.createObjectURL(await response.blob())
            ),
        }),
      }),
    }),
  }
);
