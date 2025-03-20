import { configureStore } from "@reduxjs/toolkit";
import meetingsReducer from '../slices/meetingSlice'

const store = configureStore({
    reducer : {
        meetings : meetingsReducer
    }
})

export default store