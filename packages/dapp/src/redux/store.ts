import { configureStore } from '@reduxjs/toolkit';
import increment from './features/count-slice';
import selectSlice from './features/select-slice';

export const store = configureStore({
   reducer: {
      select: selectSlice,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
