// store/selectSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectState {
  eventType: string;
  eventCountryType: string;
  event_timezone: string;
  event_category: string;
  event_location: string;
}

const initialState: SelectState = {
  eventType: "",
  eventCountryType: "",
  event_timezone: "",
  event_category: "",
  event_location: "",
};

export const selectSlice = createSlice({
  name: "select",
  initialState,
  reducers: {
    setEventType: (state, action: PayloadAction<string>) => {
      state.eventType = action.payload;
    },
    setEventCountryType: (state, action: PayloadAction<string>) => {
      state.eventCountryType = action.payload;
    },
    setEvent_timezone: (state, action: PayloadAction<string>) => {
      state.event_timezone = action.payload;
    },
    setEvent_category: (state, action: PayloadAction<string>) => {
      state.event_category = action.payload;
    },
    setEvent_location: (state, action: PayloadAction<string>) => {
      state.event_location = action.payload;
    },
  },
});

export const {
  setEventType,
  setEventCountryType,
  setEvent_category,
  setEvent_location,
  setEvent_timezone,
} = selectSlice.actions;

export default selectSlice.reducer;
