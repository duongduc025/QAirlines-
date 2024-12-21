import { BOOKING_API_END_POINT } from '@/utils/constraint';
import React from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setAllBooking } from '@/redux/bookingSlice';
import { LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint';

const useGetAllBookingsAdmin = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    useEffect(()=>{
        const fetchAllBookings = async () => {
            try {
                const res = await axios.get(`${BOOKING_API_END_POINT}/bookingslist`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
                    },
                });
               
                if(res.data.success){
                    dispatch(setAllBooking(res.data.bookings));
                    console.log("BookingAdmin: Success");
                }
                
            } catch (error) {
                console.log(error);
            
            }
        }
        fetchAllBookings();
    },[user, dispatch]);

}

export default useGetAllBookingsAdmin;