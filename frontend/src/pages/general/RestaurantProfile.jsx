import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/restaurantProfile.css";

const RestaurantProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [partner, setPartner] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const init = async () => {
            // Check login status
            try {
                await axiosInstance.get("/api/auth/user/me");
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            }

            // Always load restaurant info (public)
            try {
                const res = await axiosInstance.get(`/api/food/restaurant/${id}`);
                if (res.data) {
                    setPartner(res.data.foodpartner);
                    setVideos(res.data.videos || []);
                }
            } catch (err) {
                console.error("Failed to load restaurant:", err);
                setError("Restaurant not found.");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    if (loading) return <div className="rp-loading">Loading Restaurant...</div>;
    if (error) return <div className="rp-loading">{error}</div>;

    const avatarUrl =
        partner?.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.fullname || "R")}&background=FF5A36&color=fff&size=200&bold=true`;

    return (
        <div className="rp-wrapper">

            {/* Back button */}
            <button className="rp-back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            {/* HERO — always visible */}
            <div className="rp-hero">
                <img src={avatarUrl} alt={partner?.fullname} className="rp-avatar" />
                <div className="rp-hero-info">
                    <h1 className="rp-name">{partner?.fullname}</h1>
                    <div className="rp-tag-row">
                        <span className="rp-tag">🍽 Restaurant</span>
                        <span className="rp-tag">📍 {partner?.address}</span>
                    </div>
                    <p className="rp-contact">📞 {partner?.phone} &nbsp;·&nbsp; ✉ {partner?.email}</p>
                </div>
            </div>

            {/* STATS — always visible */}
            <div className="rp-stats-row">
                <div className="rp-stat">
                    <p className="rp-stat-val">{videos.length}</p>
                    <p className="rp-stat-label">Reels</p>
                </div>
                <div className="rp-stat">
                    <p className="rp-stat-val">4.8 ⭐</p>
                    <p className="rp-stat-label">Rating</p>
                </div>
                <div className="rp-stat">
                    <p className="rp-stat-val">15K</p>
                    <p className="rp-stat-label">Happy Customers</p>
                </div>
            </div>

            {/* REELS SECTION — gated */}
            <div className="rp-section">
                <h2 className="rp-section-title">
                    🎥 Reels
                    <span className="rp-video-count">
                        {isLoggedIn ? `${videos.length} ${videos.length === 1 ? "video" : "videos"}` : "Login to view"}
                    </span>
                </h2>

                {!isLoggedIn ? (
                    /* NOT logged in → login gate */
                    <div className="rp-auth-gate">
                        <div className="rp-gate-icon">🔒</div>
                        <h3 className="rp-gate-title">Login to view reels & order food</h3>
                        <p className="rp-gate-sub">Join ZomoReels to watch food reels and place orders from your favourite restaurants.</p>
                        <div className="rp-gate-btns">
                            <button className="rp-gate-btn-primary" onClick={() => navigate('/user/login')}>
                                Log In
                            </button>
                            <button className="rp-gate-btn-secondary" onClick={() => navigate('/user/register')}>
                                Sign Up — it's free
                            </button>
                        </div>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="rp-empty">This restaurant hasn't uploaded any reels yet.</div>
                ) : (
                    /* Logged in → show full video grid */
                    <div className="rp-video-grid">
                        {videos.map((video) => (
                            <div key={video._id} className="rp-video-card">
                                <div className="rp-video-thumb">
                                    <video
                                        src={video.video}
                                        className="rp-video-preview"
                                        muted
                                        playsInline
                                        preload="metadata"
                                    />
                                    <span className="rp-play-icon">▶</span>
                                </div>
                                <div className="rp-video-info">
                                    <p className="rp-video-name">{video.foodname}</p>
                                    {video.description && (
                                        <p className="rp-video-desc">{video.description}</p>
                                    )}
                                    {video.tags?.length > 0 && (
                                        <div className="rp-tags">
                                            {video.tags.map((tag, i) => (
                                                <span key={i} className="rp-tag-pill">#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    <button className="rp-order-btn" onClick={() => alert('Ordering coming soon!')}>
                                        🛒 Order This Dish
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantProfile;
