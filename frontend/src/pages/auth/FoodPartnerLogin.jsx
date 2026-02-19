import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const FoodPartnerLogin = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();



        try {
            const response = await axios.post("http://localhost:3002/api/auth/foodpartner/login", {
                email,
                password
            }, {
                withCredentials: true
            });

            console.log("Login Response:", response.data);

            setEmail("");
            setPassword("");

            navigate('/foodpartner/Home');

        } catch (error) {
            console.log("Error", error.response.data);
        };

    }

    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="role-badge partner">Partner</div>
                <h2 className="auth-title">Partner Login</h2>
                <p className="auth-subtitle">Manage your restaurant and orders.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Business Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="Enter business email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-button">Login to Dashboard</button>
                </form>

                <div className="auth-footer">
                    New partner? <Link to="/foodpartner/register" className="auth-link">Register your restaurant</Link>
                    <Link to="/user/register" className="switch-role-link">
                        Looking to order food? Register as User
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FoodPartnerLogin;
