import store from "common/Store";
import { logoutAction } from "common/StoreActions";
import { FineractHttp, SequestHttp } from "./Http";

FineractHttp.interceptors.request.use((config) => {
  const { base64EncodedAuthenticationKey, tfaToken } =
    store.getState().global.authUser || {};

  if (base64EncodedAuthenticationKey) {
    config.headers.Authorization = `Basic ${base64EncodedAuthenticationKey}`;

    if (tfaToken?.token) {
      config.headers["Fineract-Platform-TFA-Token"] = tfaToken.token;
    }
  }

  return config;
});

FineractHttp.interceptors.response.use(undefined, (error) => {
  console.log("FineractHttp", error?.message, error.toJSON());
  // if (error?.response?.status === 401 || error.message === "Network Error") {
  if (error?.response?.status === 401) {
    store.dispatch(logoutAction());
  }
  return Promise.reject(error);
});

SequestHttp.interceptors.request.use((config) => {
  const { sequest } = store.getState().global.authUser || {};

  if (sequest?.token) {
    config.headers.Authorization = `Bearer ${sequest?.token}`;
  }

  return config;
});

SequestHttp.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 401) {
    store.dispatch(logoutAction());
  }

  return Promise.reject(error);
});
