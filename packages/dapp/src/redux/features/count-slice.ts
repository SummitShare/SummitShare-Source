import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Props {
   value: number;
}

const initialState: Props = {
   value: 0,
};

export const count = createSlice({
   name: 'count',
   initialState,
   reducers: {
      increment: (state) => {
         state.value += 1;
      },
      decrement: (state, actions: PayloadAction<number>) => {
         state.value -= actions.payload;
      },
   },
});

export const { increment, decrement } = count.actions;

export default count.reducer;
