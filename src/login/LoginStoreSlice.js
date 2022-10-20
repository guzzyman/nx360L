import { createSlice } from "@reduxjs/toolkit";

export const loginInitialState = {
  extendedAccessToken: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState: loginInitialState,
  reducers: {
    toggleExtendedAccessTokenAction: (state, { payload }) => {
      state.extendedAccessToken =
        payload !== undefined ? !!payload : !state.extendedAccessToken;
    },
  },
});

export const { toggleExtendedAccessTokenAction } = loginSlice.actions;

export default loginSlice;

export function getLoginSliceStorageState({ extendedAccessToken }) {
  return { extendedAccessToken };
}
