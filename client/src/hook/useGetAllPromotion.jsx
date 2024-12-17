import React from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { PROMOTION_API_END_POINT } from '@/utils/constraint';
import { setAllPromotions } from '@/redux/promotionSlice';


const useGetAllPromotion = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPromotion = async () => {
            try {
                const res = await axios.get(`${PROMOTION_API_END_POINT}/showAllPromotions`);
                if(res.data){
                    dispatch(setAllPromotions(res.data));
                    console.log("Promotion: Success");
                }
                
            } catch (error) {
                console.log(error);
            
            }
        }
        fetchAllPromotion();
    },[dispatch])
}

export default useGetAllPromotion;
