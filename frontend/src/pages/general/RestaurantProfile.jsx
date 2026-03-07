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
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
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
        fetchRestaurant();
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
                ← Back to Feed
            </button>

            {/* HERO */}
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

            {/* STATS */}
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

            {/* VIDEO GRID */}
            <div className="rp-section">
                <h2 className="rp-section-title">
                    🎥 Reels
                    <span className="rp-video-count">{videos.length} {videos.length === 1 ? "video" : "videos"}</span>
                </h2>

                {videos.length === 0 ? (
                    <div className="rp-empty">This restaurant hasn't uploaded any reels yet.</div>
                ) : (
                    <div className="rp-video-grid">
                        {videos.map((video) => (
                            <div key={video._id} className="rp-video-card">
                                <div
                                    className="rp-video-thumb"
                                    onClick={() => setActiveVideo(activeVideo === video._id ? null : video._id)}
                                >
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
                                    {/* Order button — placeholder for future ordering flow */}
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
