import { BOOKING_API_ENDPOINT } from '@/utils/constraint';
import React from 'react'
import axios from 'axios'
import { setAllBooking } from '@/redux/bookingSlice'
import { toast } from 'sonner'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllBooking = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllBooking = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`,{withCredentials:true});
                console.log("Response:", response.data); // Log the response
                if (response.data === "Success") {
                   dispatch(setAllBooking(response.data));
                } 
            } catch (error) {
                console.error("Error during booking:", error);
                toast.error("An error occurred during booking.");
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchAllBooking();
    }
    )};
