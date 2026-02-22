import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/userProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Since user data is not explicitly sent back via a separate verify endpoint,
        // we normally rely on React context or fetching profile data.
        // For now, if no token/user state exists, we should be handling it.
        // Assuming user details are fetched via videos endpoint or similar context if added later.
        // Dummy user info for visual layout till a proper GET /user/me exists:
        setUser({
            fullname: "Atharva",
            email: "user@example.com",
            profilePic: "https://ui-avatars.com/api/?name=Atharva&background=FF5A36&color=fff&size=150"
        });

        const fetchVideos = async () => {
            try {
                const response = await axios.get("http://localhost:3002/api/food/getItem", {
                    withCredentials: true
                });
                if (response.data && response.data.foodItem) {
                    setVideos(response.data.foodItem);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:3002/api/auth/user/logout", {
                withCredentials: true
            });
            navigate('/user/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading) return <div className="loading-state">Loading Profile...</div>;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <div className="profile-info-section">
                    <img src={user?.profilePic} alt="Profile" className="profile-avatar" />
                    <div>
                        <h1 className="profile-name">{user?.fullname}</h1>
                        <p className="profile-email">{user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </header>

            <section className="profile-stats">
                <div className="stat-card">
                    <h3 className="stat-value">12</h3>
                    <p className="stat-label">Food Ordered</p>
                </div>
                <div className="stat-card">
                    <h3 className="stat-value">5</h3>
                    <p className="stat-label">Restaurants Ordered From</p>
                </div>
            </section>

            <section className="profile-reels">
                <h2 className="section-title">Reel Feed</h2>
                <div className="reels-grid">
                    {videos.length === 0 ? (
                        <p className="empty-reels">No reels available right now.</p>
                    ) : (
                        videos.map((video) => (
                            <div key={video._id} className="reel-thumbnail" onClick={() => navigate('/user/Home')}>
                                <video src={video.video} muted playsInline className="reel-video-preview" />
                                <div className="reel-thumbnail-overlay">
                                    <span className="reel-title">{video.foodname}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default UserProfile;
