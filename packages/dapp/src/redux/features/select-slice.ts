// store/selectSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectState {
   eventType: string;
   eventCountryType: string;
   event_timezone: string;
   event_category: string;
   event_location: string;
   event_type: string;
}

const initialState: SelectState = {
   eventType: '',
   eventCountryType: '',
   event_timezone: '',
   event_category: '',
   event_location: '',
   event_type: '',
};

export const selectSlice = createSlice({
   name: 'select',
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
      setEvent_Type: (state, action: PayloadAction<string>) => {
         state.event_type = action.payload;
      },
   },
});

export const {
   setEventType,
   setEventCountryType,
   setEvent_category,
   setEvent_location,
   setEvent_timezone,
   setEvent_Type,
} = selectSlice.actions;

export default selectSlice.reducer;
