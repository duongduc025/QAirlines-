import { BOOKING_API_END_POINT } from '@/utils/constraint';
import React from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setAllBooking } from '@/redux/bookingSlice';
import { LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint';

const useGetAllBooking = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    useEffect(()=>{
        const fetchAllBookings = async () => {
            try {
                console.log(user);
                const res = await axios.get(`${BOOKING_API_END_POINT}/users/${user?._id}/bookings`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
                    },
                    withCredentials: true,
                });
                console.log(`${BOOKING_API_END_POINT}/users/${user?._id}/bookings`);
                console.log(localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME));
                console.log(res.data);
                if(res.data.success){
                    dispatch(setAllBooking(res.data.bookings));
                    console.log(res.data.bookings);
                }
                else
                    toast.error("Error during fetching booking");
            } catch (error) {
                console.log(error);
                toast.error("Error during fetching booking");
            }
        }
        fetchAllBookings();
    },[user, dispatch])
}

export default useGetAllBooking;