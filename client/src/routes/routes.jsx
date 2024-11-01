import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../page/home';
import Signup from '../page/Signup';
import Login from '../page/Login';


const Routes_ = () => {
    return (
        <Routes>
            <Route path="/register" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}
export default Routes_;