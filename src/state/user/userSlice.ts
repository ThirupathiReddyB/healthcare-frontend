import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  fullName: string;
  email: string;
  role: string;
  position: string;
}

const initialState: UserState = {
  fullName: "",
  email: "",
  role: "",
  position: "",
};

export const userSlice = createSlice({
  name: "userDataStore",
  initialState,
  reducers: {
    storeUserData: (state, action: PayloadAction<UserState>) => {
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.position = action.payload.position;
    },
    updateUserData: (state, action) => {
      state.fullName = action.payload.fullName;
      state.position = action.payload.position;
    },
    eraseUserData: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { storeUserData, eraseUserData, updateUserData } =
  userSlice.actions;

export default userSlice.reducer;
