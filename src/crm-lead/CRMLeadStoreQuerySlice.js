import { RtkqTagEnum } from "common/Constants";
import { nimbleX360Api, providesTags } from "common/StoreQuerySlice";
import { downloadFile, objectToFormData } from "common/Utils";

export const nimbleX360CRMLeadApi = nimbleX360Api.injectEndpoints({
  endpoints: (builder) => ({
    getCRMLeads: builder.query({
      query: (params) => ({ url: "/leads", params }),
      providesTags: (data) =>
        providesTags(data?.pageItems, RtkqTagEnum.CRM_LEAD),
    }),
    getCRMLead: builder.query({
      query: (id) => ({ url: "/leads/" + id }),
      providesTags: (data) => [{ type: RtkqTagEnum.CRM_LEAD, id: data?.id }],
    }),
    addCRMLead: builder.mutation({
      query: (data) => ({ url: "/leads", data, method: "post" }),
      invalidatesTags: () => [{ type: RtkqTagEnum.CRM_LEAD }],
    }),
    getCRMLeadImage: builder.query({
      query: (id) => ({ url: `/leads/${id}/images` }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_LEAD, id }],
    }),
    getProductSummary: builder.query({
      query: (id) => ({ url: `/summary/products` }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_LEAD, id }],
    }),
    getImportedDocumentList: builder.query({
      query: (id) => ({ url: `/imports?entityType=client` }),
      providesTags: (id) => [{ type: RtkqTagEnum.CRM_LEAD, id }],
    }),
    uploadtemplate: builder.mutation({
      query: (data) => ({
        url: "/clients/uploadtemplate?legalFormType=CLIENTS_ENTTTY",
        method: "POST",
        data: objectToFormData(data),
      }),
      invalidatesTags: () => [{ type: RtkqTagEnum.EDR_TRANSACTION }],
    }),
    downloadLeadTemplate: builder.mutation({
      query: (params) => ({
        url: "/clients/downloadtemplate",
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
