import {createSlice} from '@reduxjs/toolkit';

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        allBooking: [],
        singleBooking: null,
        loading: false,
    },
    reducers: {
        setAllBooking: (state, action) => {
            state.allBooking = action.payload;
        },
        setSingleBooking: (state, action) => {
            state.singleBooking = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
});
export const { 
    setAllBooking,
    setSingleBooking,
    setLoading,
 } = bookingSlice.actions;
export default bookingSlice.reducer;

