import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../page/home';

const Routes_ = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}
export default Routes_;