import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';


const FoodPartnerRegister = () => {

    const navigate = useNavigate();


    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactName, setContactName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Read directly from the form — state setters are async and
        // won't update the local variable until the next render,
        // so using state here would send the previous (often empty) values.
        const fullname = e.target.fullname.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const contactName = e.target.contactName.value;
        const phone = e.target.phone.value;
        const address = e.target.address.value;

        try {
            const response = await axiosInstance.post("/api/auth/foodpartner/register", {
                fullname,
                email,
                password,
                contactName,
                phone,
                address
            });

            setFullname("");
            setEmail("");
            setPassword("");
            setContactName("");
            setPhone("");
            setAddress("");

            navigate('/foodpartner/profile');

        }
        catch (err) {
            // registration failed — fields remain for retry
        };

    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="role-badge partner">Partner</div>
                <h2 className="auth-title">Partner Registration</h2>
                <p className="auth-subtitle">Grow your business with us.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="fullname">Restaurant Full Name</label>
                        <input
                            type="text"
                            id="fullname"
                            className="form-input"
                            placeholder="Enter restaurant name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
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

                    <div className="form-group">
                        <label className="form-label" htmlFor="contactName">Contact Person Name</label>
                        <input
                            type="text"
                            id="contactName"
                            className="form-input"
                            placeholder="Enter contact person name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            className="form-input"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            className="form-input"
                            placeholder="Enter restaurant address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
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
