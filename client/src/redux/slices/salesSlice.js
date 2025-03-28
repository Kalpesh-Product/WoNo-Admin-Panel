import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leadsData: [],
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setLeadsData: (state, action) => {
      state.leadsData = action.payload;
    },
    clearLeadsData: (state) => {
      state.leadsData = [];
    },
  },
});

export const { setLeadsData, clearLeadsData } = salesSlice.actions;
export default salesSlice.reducer;
