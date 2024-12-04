export const USER_API_END_POINT="http://localhost:3001/api/users";
export const FLIGHT_API_END_POINT="http://localhost:3001/api/flights";
export const BOOKING_API_END_POINT="http://localhost:3001/api/bookings";
export const LOCAL_STORAGE_TOKEN_NAME="jwtToken";
export const INITIAL_USER_STATE = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME) ? JSON.parse(atob(localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME).split('.')[1])) : null;