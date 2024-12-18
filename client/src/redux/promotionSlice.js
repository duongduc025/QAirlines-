import { createSlice } from '@reduxjs/toolkit';

const promotionSlice = createSlice({
    name: 'promotion',
    initialState: {
        allPromotions: [],
        singlePromotion: null,
    },
    reducers: {
        setAllPromotions: (state, action) => {
            state.allPromotions = action.payload;
        },
        setSinglePromotion: (state, action) => {
            state.singlePromotion = action.payload;
        },
    }
});

export const { 
    setAllPromotions,
    setSinglePromotion,
} = promotionSlice.actions;
export default promotionSlice.reducer;
