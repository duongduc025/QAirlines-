import {createSlice} from '@reduxjs/toolkit';

const flightSlice = createSlice({
    name: 'flight',
    initialState: {
        allFlight: [],
        departureFlights: [],
        returnFlights: [],
        loading: false,
    },
    reducers: {
        setAllFlight: (state, action) => {
            state.allFlight = action.payload;
        },
        setDepartureFlights: (state, action) => {
            state.departureFlights = action.payload;
        },
        setReturnFlights: (state, action) => {
            state.returnFlights = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
});
export const { setAllFlight, setDepartureFlights, setReturnFlights, setLoading } = flightSlice.actions;
export default flightSlice.reducer;

