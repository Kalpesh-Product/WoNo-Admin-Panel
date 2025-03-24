import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "../slices/clientSlice";
import meetingsReducer from "../slices/meetingSlice";

const store = configureStore({
  reducer: {
    meetings: meetingsReducer,
    client: clientReducer,
  },
});

export default store;
