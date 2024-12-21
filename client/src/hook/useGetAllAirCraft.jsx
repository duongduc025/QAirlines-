import React from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { LOCAL_STORAGE_TOKEN_NAME, AIRCRAFT_API_END_POINT } from '@/utils/constraint';
import { setAllAirCraft } from '@/redux/airCraftSlice';

const useGetAllAirCraft = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    useEffect(()=>{
        const fetchAllAircraft = async () => {
            try {
                const res = await axios.get(`${AIRCRAFT_API_END_POINT}/showAll`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
                    },
                });
                
                if(res.data){
                    dispatch(setAllAirCraft(res.data));
                    console.log("Aircraft: Success");
                }
                
            } catch (error) {
                console.log(error);
            
            }
        }
        fetchAllAircraft();
    },[user, dispatch])
}

export default useGetAllAirCraft;
