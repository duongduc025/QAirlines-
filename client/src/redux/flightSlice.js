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
    }
});
export const { setAllFlight } = flightSlice.actions;
export default flightSlice.reducer;

