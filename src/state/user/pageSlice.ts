import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PageState {
  pageNumber: number;
}

const initialState: PageState = {
  pageNumber: 1,
};

export const pageSlice = createSlice({
  name: "pageNumberStore",
  initialState,
  reducers: {
    storePageData: (state, action: PayloadAction<PageState>) => {
      state.pageNumber = action.payload.pageNumber;
    },
    erasePageData: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { storePageData, erasePageData } =
  pageSlice.actions;

export default pageSlice.reducer;
