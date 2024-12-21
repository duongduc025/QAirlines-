import React from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint';
import { FLIGHT_API_END_POINT } from '@/utils/constraint';
import { setAllFlight } from '@/redux/flightSlice';

const useGetAllFlight = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    useEffect(()=>{
        const fetchAllFlights = async () => {
            try {
                const res = await axios.get(`${FLIGHT_API_END_POINT}/allFlights`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
                    },
                });
                
                if(res.data){
                    dispatch(setAllFlight(res.data));
                    console.log("Flight: Success");
                }
                
            } catch (error) {
                console.log(error);
            
            }
        }
        fetchAllFlights();
    },[user, dispatch])
}

export default useGetAllFlight;