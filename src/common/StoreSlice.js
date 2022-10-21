import { createSlice } from "@reduxjs/toolkit";
import { logoutAction } from "./StoreActions";
import {
  nimblex360LoginApi,
  sequestLoginApi,
} from "login/LoginStoreQuerySlice";

export const globalInitialState = {
  isSideMenu: false,
  isDocumentPreviewSideMenu: false,
  isSideMenuTemporary: false,
  isLoadingModal: false,
  authUser: null,
};

const slice = createSlice({
  name: "global",
  initialState: globalInitialState,
  reducers: {
    toggleSideMenuAction: (state, { payload }) => {
      state.isSideMenu = payload !== undefined ? !!payload : !state.isSideMenu;
    },
    toggleDocumentPreviewSideMenuAction: (state, { payload }) => {
      state.isDocumentPreviewSideMenu =
        payload !== undefined ? !!payload : !state.isDocumentPreviewSideMenu;
    },
    toggleSideMenuTemporaryAction: (state, { payload }) => {
      state.isSideMenuTemporary =
        payload !== undefined ? !!payload : !state.isSideMenuTemporary;
    },
    toggleLoadingModalAction: (state, { payload }) => {
      state.isLoadingModal =
        payload !== undefined ? !!payload : !state.isLoadingModal;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(logoutAction, () => ({ ...globalInitialState }))
      .addMatcher(
        nimblex360LoginApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.authUser = payload;
        }
      )
      .addMatcher(
        sequestLoginApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.authUser.sequest = payload;
        }
      )
      .addMatcher(
        nimblex360LoginApi.endpoints.getLoginOTPDeliveryMethods.matchFulfilled,
        (state, { payload }) => {
          state.authUser.otpDeliveryMethods = payload;
          state.authUser.normalizedOtpDeliveryMethods = payload.reduce(
            (acc, curr) => {
              acc[curr.name] = curr;
              return acc;
            },
            {}
          );
        }
      )
      .addMatcher(
        nimblex360LoginApi.endpoints.requestLoginOTP.matchFulfilled,
        (state, { payload }) => {
          state.authUser.otpRequest = payload;
        }
      )
      .addMatcher(
        nimblex360LoginApi.endpoints.resendLoginOTP.matchFulfilled,
        (state, { payload }) => {
          state.authUser.otpRequest = payload;
        }
      )
      .addMatcher(
        nimblex360LoginApi.endpoints.validateLoginOTP.matchFulfilled,
        (state, { payload }) => {
          state.authUser.tfaToken = payload;
        }
      )
      .addMatcher(
        nimblex360LoginApi.endpoints.getAuthUserProfile.matchFulfilled,
        (state, { payload }) => {
          Object.assign(state.authUser, payload, {
            fullname: `${payload?.firstname} ${payload?.lastname}`,
          });
        }
      ),
});

export const {
  toggleSideMenuAction,
  toggleLoadingModalAction,
  toggleSideMenuTemporaryAction,
  toggleDocumentPreviewSideMenuAction,
} = slice.actions;

export default slice;

export function getGlobalSliceStorageState({ authUser }) {
  return { authUser };
}
