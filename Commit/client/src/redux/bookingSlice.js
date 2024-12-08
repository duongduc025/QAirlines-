import {createSlice} from '@reduxjs/toolkit';

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        allBooking: [],
        singleBooking: null,
    },
    reducers: {
        setAllBooking: (state, action) => {
            state.allBooking = action.payload;
        },
        setSingleBooking: (state, action) => {
            state.singleBooking = action.payload;
        },

    }
});
export const { 
    setAllBooking,
    setSingleBooking,
 } = bookingSlice.actions;
export default bookingSlice.reducer;

