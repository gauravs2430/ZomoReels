import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="role-badge user">User</div>
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Login to continue ordering delicious food.</p>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-button">Login</button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/user/register" className="auth-link">Sign up</Link>
                    <Link to="/foodpartner/register" className="switch-role-link">
                        Are you a restaurant partner? Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
