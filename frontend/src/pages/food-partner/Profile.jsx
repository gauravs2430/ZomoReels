import React, { useState, useEffect, useRef } from "react";
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from "react-router-dom";
import "../../styles/foodPartnerProfile.css";

const Profile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [partner, setPartner] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageMsg, setImageMsg] = useState(null);
    // Popup menu state: null | 'menu'
    const [avatarMenu, setAvatarMenu] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("/api/food/getFoodpartnerItems");
                if (res.data) {
                    if (res.data.videos) setVideos(res.data.videos);
                    if (res.data.foodpartner) setPartner(res.data.foodpartner);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        if (!avatarMenu) return;
        const close = () => setAvatarMenu(false);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, [avatarMenu]);

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/api/auth/foodpartner/logout");
            navigate("/foodpartner/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const triggerUpload = () => {
        setAvatarMenu(false);
        fileInputRef.current.click();
    };

    const handleRemoveImage = async () => {
        setAvatarMenu(false);
        // Just clear the image locally — you can extend to call a backend DELETE if needed
        setPartner(prev => ({ ...prev, image: null }));
        setImageMsg({ type: 'success', text: '✅ Profile picture removed!' });
        setTimeout(() => setImageMsg(null), 3000);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        setImageUploading(true);
        setImageMsg(null);
        try {
            const res = await axiosInstance.post("/api/auth/foodpartner/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setPartner(prev => ({ ...prev, image: res.data.image }));
            setImageMsg({ type: 'success', text: '✅ Profile picture updated!' });
        } catch (err) {
            console.error("Image upload failed:", err);
            setImageMsg({ type: 'error', text: '❌ Upload failed. Try again.' });
        } finally {
            setImageUploading(false);
            setTimeout(() => setImageMsg(null), 3000);
        }
    };

    if (loading) return <div className="fp-loading">Loading Profile...</div>;

    const avatarUrl =
        partner?.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            partner?.fullname || "R"
        )}&background=FF5A36&color=fff&size=200&bold=true`;

    return (
        <div className="fp-profile-wrapper">

            {/* HERO */}
            <div className="fp-profile-hero">

                {/* Avatar with popup menu */}
                <div className="fp-avatar-wrapper">
                    <img src={avatarUrl} alt={partner?.fullname} className="fp-avatar" />
                    <button
                        className="fp-avatar-edit-btn"
                        title="Edit photo"
                        onClick={(e) => { e.stopPropagation(); setAvatarMenu(v => !v); }}
                    >
                        ✏️
                    </button>

                    {/* 3-option popup */}
                    {avatarMenu && (
                        <div className="fp-avatar-menu" onClick={e => e.stopPropagation()}>
                            <button className="fp-avatar-menu-item" onClick={triggerUpload}>
                                📤 Upload photo
                            </button>
                            <button className="fp-avatar-menu-item" onClick={triggerUpload}>
                                🔄 Change photo
                            </button>
                            <button
                                className="fp-avatar-menu-item fp-avatar-menu-danger"
                                onClick={handleRemoveImage}
                            >
                                🗑️ Remove photo
                            </button>
                        </div>
                    )}

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Info */}
                <div className="fp-profile-info">
                    <h1 className="fp-business-name">{partner?.fullname}</h1>
                    {imageUploading && <p style={{ fontWeight: 700, color: 'var(--color-primary)' }}>⏳ Uploading...</p>}
                    {imageMsg && (
                        <p style={{ margin: '4px 0', fontWeight: 700, color: imageMsg.type === 'success' ? 'green' : 'red' }}>
                            {imageMsg.text}
                        </p>
                    )}
                    <div className="fp-tag-row">
                        <span className="fp-tag">🍽 Restaurant</span>
                        <span className="fp-tag">📍 {partner?.address}</span>
                    </div>
                    <p className="fp-address">📞 {partner?.phone} &nbsp;·&nbsp; ✉ {partner?.email}</p>
                    <p className="fp-address">Contact: <strong>{partner?.contactName}</strong></p>
                </div>

                {/* Action buttons */}
                <div className="fp-hero-actions">
                    <button className="fp-dashboard-btn" onClick={() => navigate("/foodpartner/Home")}>
                        📤 Upload Reels &amp; Manage
                    </button>
                    <button className="fp-logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* STATS */}
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

            {/* CONTENT */}
            <div className="fp-content-area">
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
                    <button className="fp-sidebar-edit-btn" onClick={() => navigate("/foodpartner/Home")}>
                        📤 Upload Reels &amp; Manage
                    </button>
                </aside>

                <section className="fp-grid-section">
                    <div className="fp-section-header">
                        <h2 className="fp-section-title">My Reels</h2>
                        <span className="fp-video-count">{videos.length} {videos.length === 1 ? "video" : "videos"}</span>
                    </div>
                    <div className="fp-video-grid">
                        {videos.length === 0 ? (
                            <div className="fp-empty-state">
                                🎥 No reels yet!{" "}
                                <span
                                    style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 900, textDecoration: 'underline' }}
                                    onClick={() => navigate("/foodpartner/Home")}
                                >
                                    Upload your first reel →
                                </span>
                            </div>
                        ) : (
                            videos.map((video) => (
                                <div key={video._id} className="fp-video-thumb" onClick={() => navigate("/foodpartner/Home")}>
                                    <video src={video.video} className="fp-video-preview" muted playsInline preload="metadata" />
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