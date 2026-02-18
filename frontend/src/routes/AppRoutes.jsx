import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from '../pages/auth/UserLogin';
import UserRegister from '../pages/auth/UserRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import UserHome from "../pages/general/UserHome";
import FoodPartnerHome from "../pages/food-partner/FoodpartnerHome";
import { Navigate } from "react-router-dom" ;


const AppRoutes = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/user/login" />} />
                    <Route path="/user/register" element={<UserRegister />} />
                    <Route path="/user/login" element={<UserLogin />} />
                    <Route path="/foodpartner/register" element={<FoodPartnerRegister />} />
                    <Route path="/foodpartner/login" element={<FoodPartnerLogin />} />
                    <Route path="/user/Home" element={<UserHome />} />
                    <Route path ="/foodpartner/Home" element = {<FoodPartnerHome />} />
                    

                </Routes>
            </Router>

        </>
    )
};

export default AppRoutes;
