import {createSlice} from '@reduxjs/toolkit';

const flightSlice = createSlice({
    name: 'flight',
    initialState: {
        allFlight: [],
    },
    reducers: {
        setAllFlight: (state, action) => {
            state.allFlight = action.payload;
        },
        updateFlightList: (state, action) => {
            state.allFlight = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
});
export const { setAllFlight, updateFlightList } = flightSlice.actions;
export default flightSlice.reducer;

