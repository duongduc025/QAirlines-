import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_USER_STATE } from "../utils/constraint";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user: INITIAL_USER_STATE
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        }
    }
});
export const {setLoading, setUser} = authSlice.actions;
export default authSlice.reducer;