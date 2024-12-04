import {createSlice} from '@reduxjs/toolkit';

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        allBooking: [],
    },
    reducers: {
        setAllBooking: (state, action) => {
            state.allBooking = action.payload;
        },
    }
});
export const { setAllBooking } = bookingSlice.actions;
export default bookingSlice.reducer;

