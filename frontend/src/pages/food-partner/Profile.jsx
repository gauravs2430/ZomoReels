import React, { useState, useEffect } from "react";
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from "react-router-dom";
import "../../styles/foodPartnerProfile.css";

const Profile = () => {
    const navigate = useNavigate();

    const [partner, setPartner] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch partner's own reels
                const videosRes = await axiosInstance.get("/api/food/getFoodpartnerItems");
                if (videosRes.data && videosRes.data.videos) {
                    setVideos(videosRes.data.videos);
                }

                // Use a placeholder for partner info until a /me endpoint exists
                // Replace with a real API call when you add GET /api/auth/foodpartner/me
                setPartner({
                    fullname: "Your Restaurant",
                    contactName: "Contact Person",
                    phone: "+91 00000 00000",
                    address: "123, Food Street, City, India",
                    email: "partner@restaurant.com",
                    image: null,
                });
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/api/auth/foodpartner/logout");
            navigate("/foodpartner/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    if (loading) {
        return <div className="fp-loading">Loading Profile...</div>;
    }

    const avatarUrl =
        partner?.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            partner?.fullname || "R"
        )}&background=FF5A36&color=fff&size=200&bold=true`;

    return (
        <div className="fp-profile-wrapper">

            {/* ── HERO SECTION ── */}
            <div className="fp-profile-hero">
                {/* Avatar */}
                <div className="fp-avatar-wrapper">
                    <img
                        src={avatarUrl}
                        alt={partner?.fullname}
                        className="fp-avatar"
                    />
                </div>

                {/* Info */}
                <div className="fp-profile-info">
                    <h1 className="fp-business-name">{partner?.fullname}</h1>
                    <div className="fp-tag-row">
                        <span className="fp-tag">🍽 Restaurant</span>
                        <span className="fp-tag">📍 {partner?.address}</span>
                    </div>
                    <p className="fp-address">
                        📞 {partner?.phone} &nbsp;·&nbsp; ✉ {partner?.email}
                    </p>
                    <p className="fp-address">
                        Contact: <strong>{partner?.contactName}</strong>
                    </p>
                </div>

                {/* Logout button */}
                <button className="fp-logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* ── STATS ROW ── */}
            <div className="fp-stats-row">
                <div className="fp-stat-card">
                    <p className="fp-stat-value">{videos.length}</p>
                    <p className="fp-stat-label">Total Reels</p>
                </div>
                <div className="fp-stat-card">
                    <p className="fp-stat-value">43</p>
                    <p className="fp-stat-label">Total Meals</p>
                </div>
                <div className="fp-stat-card">
                    <p className="fp-stat-value">15K</p>
                    <p className="fp-stat-label">Customers Served</p>
                </div>
                <div className="fp-stat-card">
                    <p className="fp-stat-value">4.8 ⭐</p>
                    <p className="fp-stat-label">Avg. Rating</p>
                </div>
            </div>

            {/* ── CONTENT AREA ── */}
            <div className="fp-content-area">

                {/* Sidebar */}
                <aside className="fp-sidebar">
                    <div className="fp-sidebar-card">
                        <p className="fp-sidebar-title">Business Name</p>
                        <p className="fp-sidebar-detail">{partner?.fullname}</p>
                    </div>
                    <div className="fp-sidebar-card">
                        <p className="fp-sidebar-title">Address</p>
                        <p className="fp-sidebar-detail">{partner?.address}</p>
                    </div>
                    <div className="fp-sidebar-card">
                        <p className="fp-sidebar-title">Phone</p>
                        <p className="fp-sidebar-detail">{partner?.phone}</p>
                    </div>
                    <div className="fp-sidebar-card">
                        <p className="fp-sidebar-title">Email</p>
                        <p className="fp-sidebar-detail">{partner?.email}</p>
                    </div>
                    <button
                        className="fp-sidebar-edit-btn"
                        onClick={() => navigate("/foodpartner/Home")}
                    >
                        ← Back to Dashboard
                    </button>
                </aside>

                {/* Video Grid */}
                <section className="fp-grid-section">
                    <div className="fp-section-header">
                        <h2 className="fp-section-title">My Reels</h2>
                        <span className="fp-video-count">
                            {videos.length} {videos.length === 1 ? "video" : "videos"}
                        </span>
                    </div>

                    <div className="fp-video-grid">
                        {videos.length === 0 ? (
                            <div className="fp-empty-state">
                                🎥 No reels uploaded yet. Go to your dashboard and upload your first reel!
                            </div>
                        ) : (
                            videos.map((video) => (
                                <div
                                    key={video._id}
                                    className="fp-video-thumb"
                                    onClick={() => navigate("/foodpartner/Home")}
                                >
                                    <video
                                        src={video.video}
                                        className="fp-video-preview"
                                        muted
                                        playsInline
                                        preload="metadata"
                                    />
                                    <span className="fp-play-icon">▶</span>
                                    <div className="fp-video-overlay">
                                        <p className="fp-video-label">{video.foodname}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Profile;