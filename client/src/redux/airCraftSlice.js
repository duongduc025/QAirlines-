import {createSlice} from '@reduxjs/toolkit';

const airCraftSlice = createSlice({
    name: 'airCraft',
    initialState: {
        allAirCraft: [],
    },
    reducers: {
        setAllAirCraft: (state, action) => {
            state.allAirCraft = action.payload;
        },
    }
});
export const { 
    setAllAirCraft,
 } = airCraftSlice.actions;
export default airCraftSlice.reducer;

