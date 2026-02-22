import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/landing.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get("http://localhost:3002/api/auth/foodpartners");
                if (response.data && response.data.partners) {
                    setRestaurants(response.data.partners);
                }
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            }
        };

        fetchRestaurants();
    }, []);

    const filteredRestaurants = restaurants.filter(
        rest => rest.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="landing-container">
            {/* Header */}
            <header className="landing-header">
                <div className="brand-logo">
                    ZomoReels
                </div>
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search for restaurant, cuisine or a dish..."
                        className="landing-search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="auth-nav">
                    <button className="nav-btn login-btn" onClick={() => navigate('/user/login')}>Log In</button>
                    <button className="nav-btn register-btn" onClick={() => navigate('/user/register')}>Sign Up</button>
                </div>
            </header>

            {/* Main Body */}
            <main className="landing-main">
                <h1 className="main-title">Discover the best food & drinks</h1>

                <div className="restaurant-grid">
                    {filteredRestaurants.length === 0 ? (
                        <p className="empty-message">No restaurants found matching your search.</p>
                    ) : (
                        filteredRestaurants.map(rest => (
                            <div key={rest._id} className="restaurant-card">
                                {/* Using a placeholder background image if no dedicated image exists yet */}
                                <div className="card-bg" style={{ backgroundImage: `url(https://source.unsplash.com/600x400/?restaurant,food&sig=${rest._id})` }}>
                                    <div className="card-overlay">
                                        <h3 className="card-restaurant-name">{rest.fullname}</h3>
                                        <p className="card-contact">📞 {rest.phone}</p>
                                        <span className="card-contact-name">Contact: {rest.contactName}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-columns">
                    <div className="footer-column">
                        <h4>About ZomoReels</h4>
                        <ul>
                            <li>Who We Are</li>
                            <li>Blog</li>
                            <li>Work With Us</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Zomaverse</h4>
                        <ul>
                            <li>Zomato</li>
                            <li>Blinkit</li>
                            <li>Feeding India</li>
                            <li>Zomaland</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>For Restaurants</h4>
                        <ul>
                            <li>Partner With Us</li>
                            <li>Apps For You</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Learn More</h4>
                        <ul>
                            <li>Privacy</li>
                            <li>Security</li>
                            <li>Terms</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. 2026 © ZomoReels™ Ltd. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
