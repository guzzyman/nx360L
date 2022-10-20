import axios from "axios";

export const FineractHttp = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Fineract-Platform-TenantId": "default",
  },
});

export const SequestHttp = axios.create({
  baseURL: process.env.REACT_APP_CDL_SEQUEST_API_URL,
});

export const PublicHttp = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Authorization: "Basic ZXh0ZXJuYWxhcGk6ZXh0ZXJuYWxhcGk=",
    "Fineract-Platform-TenantId": "default",
  },
});

export default FineractHttp;
