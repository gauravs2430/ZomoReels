import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const UserRegister = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const navigate = useNavigate() ;

        try{
            const response = await axios.post("http://localhost:3002/api/auth/user/register" , {
                fullname , 
                email ,
                password
            })

            console.log(response.data);


            setFullname("")
            setEmail("")
            setPassword("")
        }
        catch (err){
            // console.log( "Error" , err );

            setFullname("")
            setEmail("")
            setPassword("")
        }

        navigate("/");
        

    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="role-badge user">User</div>
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Sign up to start your food journey.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-input"
                            placeholder="Enter your full name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>

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
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-button">Sign Up</button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/user/login" className="auth-link">Login</Link>
                    <Link to="/foodpartner/register" className="switch-role-link">
                        Are you a restaurant partner? Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
