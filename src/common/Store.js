import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { deepMerge, throttle, isObjectEmpty } from "./Utils";
import { logoutAction } from "./StoreActions";
import globalSlice, {
  getGlobalSliceStorageState,
  globalInitialState,
} from "./StoreSlice";
import loginSlice, {
  getLoginSliceStorageState,
  loginInitialState,
} from "login/LoginStoreSlice";
import {
  creditDirectApi,
  nimbleX360Api,
  nimbleX360WrapperApi,
  sequestApi,
  publicApi,
  nimbleX360MambuApi,
} from "./StoreQuerySlice";

const store = configureStore({
  reducer: {
    [globalSlice.name]: globalSlice.reducer,
    [loginSlice.name]: loginSlice.reducer,
    [nimbleX360Api.reducerPath]: nimbleX360Api.reducer,
    [sequestApi.reducerPath]: sequestApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [creditDirectApi.reducerPath]: creditDirectApi.reducer,
    [nimbleX360WrapperApi.reducerPath]: nimbleX360WrapperApi.reducer,
    [nimbleX360MambuApi.reducerPath]: nimbleX360MambuApi.reducer,
  },
  preloadedState: loadState({
    [globalSlice.name]: globalInitialState,
    [loginSlice.name]: loginInitialState,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      nimbleX360Api.middleware,
      sequestApi.middleware,
      publicApi.middleware,
      creditDirectApi.middleware,
      nimbleX360MambuApi.middleware,
      rtkqOnResetMiddleware(
        nimbleX360Api,
        sequestApi,
        publicApi,
        creditDirectApi,
        nimbleX360MambuApi
      )
    ),
});

setupListeners(store.dispatch);

store.subscribe(
  throttle(() => {
    const state = store.getState();
    saveState({
      [globalSlice.name]: getGlobalSliceStorageState(state[globalSlice.name]),
      [loginSlice.name]: getLoginSliceStorageState(state[loginSlice.name]),
    });
  }, 1000)
);

export default store;

function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("@state", serializedState);
  } catch (error) {}
}

function loadState(initialState = {}) {
  try {
    const newState = Object.assign({}, initialState);
    const storageState = getLocalStorageState();
    if (storageState && !isObjectEmpty(storageState)) {
      Object.assign(newState, deepMerge(newState, storageState));
    }
    return newState;
  } catch (error) {}
  return undefined;
}

function getLocalStorageState() {
  const serializedState = localStorage.getItem("@state");
  if (serializedState) {
    return JSON.parse(serializedState);
  }
  return null;
}

export function rtkqOnResetMiddleware(...apis) {
  return (store) => (next) => (action) => {
    const result = next(action);
    if (logoutAction.match(action)) {
      for (const api of apis) {
        store.dispatch(api.util.resetApiState());
      }
      localStorage.clear();
    }
    return result;
  };
}
