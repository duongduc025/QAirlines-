import React from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { LOCAL_STORAGE_TOKEN_NAME, AIRCRAFT_API_END_POINT } from '@/utils/constraint';
import { setAllAirCraft } from '@/redux/airCraftSlice';

const logout = () => {
    
}

export default logout;
