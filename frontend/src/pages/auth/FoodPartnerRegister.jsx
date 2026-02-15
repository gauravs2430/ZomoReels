import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

const FoodPartnerRegister = () => {
    const [restaurantName, setRestaurantName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log('Restaurant Name:', restaurantName);
        // console.log('Email:', email);
        // console.log('Password:', password);

         

    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="role-badge partner">Partner</div>
                <h2 className="auth-title">Partner Registration</h2>
                <p className="auth-subtitle">Grow your business with us.</p>

                <form
                
                className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="restaurantName">Restaurant Name</label>
                        <input
                            type="text"
                            id="restaurantName"
                            className="form-input"
                            placeholder="Enter restaurant name"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                        />
                    </div>

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
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-button">Register Restaurant</button>
                </form>

                <div className="auth-footer">
                    Already a partner? <Link to="/foodpartner/login" className="auth-link">Login</Link>
                    <Link to="/user/register" className="switch-role-link">
                        Looking to order food? Register as User
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FoodPartnerRegister;
