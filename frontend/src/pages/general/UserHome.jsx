import React, { useState, useEffect, useRef } from "react";
import "../../styles/userHome.css";
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
//  VideoCard
//  Renders a single full-screen reel with like, comment, save actions.
//  Props: video (food doc), isActive, toggleMute, isMuted
// ─────────────────────────────────────────────────────────────
const VideoCard = ({ video, isActive, toggleMute, isMuted }) => {
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [isTruncated, setIsTruncated] = useState(true);

    // Like: tracks whether this user liked this reel + running count from DB
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(video.likeCount || 0);

    // Save: tracks whether this user bookmarked this reel
    const [saved, setSaved] = useState(false);

    // Auto-play / pause when scrolled in/out of view
    useEffect(() => {
        if (isActive) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
        } else {
            videoRef.current.pause();
        }
    }, [isActive]);

    // POST /api/food/like { foodId } — toggles like, updates count on food doc
    const handleLike = async (e) => {
        e.stopPropagation();
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikes(prev => wasLiked ? prev - 1 : prev + 1);
        try {
            await axiosInstance.post("/api/food/like", { foodId: video._id });
        } catch (err) {
            console.error("Like failed:", err);
            setLiked(wasLiked);
            setLikes(prev => wasLiked ? prev + 1 : prev - 1);
        }
    };

    // POST /api/food/save { foodId } — creates or deletes a save document
    const handleSave = async (e) => {
        e.stopPropagation();
        const wasSaved = saved;
        setSaved(!wasSaved);
        try {
            await axiosInstance.post("/api/food/save", { foodId: video._id });
        } catch (err) {
            console.error("Save failed:", err);
            setSaved(wasSaved);
        }
    };

    return (
        <div className="video-card">
            <video
                ref={videoRef}
                className="video-player"
                src={video.video}
                loop
                muted={isMuted}
                playsInline
                onClick={toggleMute}
            />

            {/* Bottom-left gradient overlay: dish name, description, Visit Store */}
            <div className="video-overlay">
                <div className="store-info">
                    <h3 className="store-name">{video.foodname}</h3>
                    <p
                        className={`video-description ${isTruncated ? 'truncated' : ''}`}
                        onClick={() => setIsTruncated(!isTruncated)}
                    >
                        {video.description}
                    </p>
                    <button className="visit-store-btn" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/restaurant/${video.foodpartner}`);
                    }}>
                        Visit Store →
                    </button>
                </div>
            </div>

            {/* Right sidebar — outside overlay, positioned absolute to video-card */}
            <div className="sidebar-actions">
                {/* Like */}
                <div className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
                    <span className="action-icon">{liked ? '❤️' : '🤍'}</span>
                    <span className="action-label">{likes}</span>
                </div>
                {/* Comment placeholder */}
                <div className="action-btn">
                    <span className="action-icon">💬</span>
                </div>
                {/* Save */}
                <div className={`action-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
                    <span className="action-icon">{saved ? '🔖' : '🏷️'}</span>
                    <span className="action-label">{saved ? 'Saved' : 'Save'}</span>
                </div>
            </div>
        </div>

    );
};

// ─────────────────────────────────────────────────────────────
//  SavedFeed
//  Shown when user taps the "Saved" tab.
//  Fetches GET /api/food/saved → renders reels in a vertical feed.
// ─────────────────────────────────────────────────────────────
const SavedFeed = () => {
    const [savedVideos, setSavedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                // GET /api/food/saved — requires user auth cookie
                // Returns { savedItems: [...food docs] }
                const res = await axiosInstance.get("/api/food/saved");
                if (res.data?.savedItems) {
                    setSavedVideos(res.data.savedItems);
                    if (res.data.savedItems.length > 0) {
                        setActiveId(res.data.savedItems[0]._id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch saved reels:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSaved();
    }, []);

    const handleScroll = (e) => {
        const index = Math.round(e.target.scrollTop / e.target.clientHeight);
        if (savedVideos[index] && savedVideos[index]._id !== activeId) {
            setActiveId(savedVideos[index]._id);
        }
    };

    if (loading) return <div className="loading-state">Loading saved reels...</div>;
    if (savedVideos.length === 0) return (
        <div className="loading-state">
            🏷️ No saved reels yet!<br />
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>Tap 🏷️ on any reel to save it.</span>
        </div>
    );

    return (
        <div className="video-feed-container saved-feed" onScroll={handleScroll}>
            {savedVideos.map(video => (
                <VideoCard
                    key={video._id}
                    video={video}
                    isActive={video._id === activeId}
                    toggleMute={() => setIsMuted(m => !m)}
                    isMuted={isMuted}
                />
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  UserHome
//  Main page with two tabs controlled by a bottom nav bar:
//    🏠 Home  → vertial reel feed (all reels)
//    🔖 Saved → saved reels feed (user's bookmarks)
// ─────────────────────────────────────────────────────────────
const UserHome = () => {
    // 'home' | 'saved' — controls which tab/feed is visible
    const [activeTab, setActiveTab] = useState('home');

    const [videos, setVideos] = useState([]);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // GET /api/food/getItem → { foodItem: [...] }
                // Each food doc includes likeCount (added to food.models.js)
                const response = await axiosInstance.get("/api/food/getItem");
                if (response.data?.foodItem) {
                    setVideos(response.data.foodItem);
                    if (response.data.foodItem.length > 0) {
                        setActiveVideoId(response.data.foodItem[0]._id);
                    }
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoaded(true);
            }
        };
        fetchVideos();
    }, []);

    const handleScroll = (e) => {
        const index = Math.round(e.target.scrollTop / e.target.clientHeight);
        if (videos[index] && videos[index]._id !== activeVideoId) {
            setActiveVideoId(videos[index]._id);
        }
    };

    return (
        <div className="user-home-wrapper">
            {/* ── Main Content ─────────────────────────────── */}
            <div className="feed-area">
                {activeTab === 'home' ? (
                    /* HOME TAB: full reel feed */
                    <div className="video-feed-container" onScroll={handleScroll}>
                        {!loaded ? (
                            <div className="loading-state">Loading delicious feed...</div>
                        ) : videos.length === 0 ? (
                            <div className="loading-state">🍽️ No reels yet! Check back soon.</div>
                        ) : (
                            videos.map(video => (
                                <VideoCard
                                    key={video._id}
                                    video={video}
                                    isActive={video._id === activeVideoId}
                                    toggleMute={() => setIsMuted(m => !m)}
                                    isMuted={isMuted}
                                />
                            ))
                        )}
                    </div>
                ) : (
                    /* SAVED TAB: user's bookmarked reels */
                    <SavedFeed />
                )}
            </div>

            {/* ── Bottom Navigation Bar ────────────────────── */}
            {/* Two tabs: Home (all reels) and Saved (bookmarked reels) */}
            <nav className="bottom-nav">
                <button
                    className={`bottom-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('home')}
                >
                    <span className="bottom-nav-icon">🏠</span>
                    <span className="bottom-nav-label">Home</span>
                </button>
                <button
                    className={`bottom-nav-btn ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    <span className="bottom-nav-icon">🔖</span>
                    <span className="bottom-nav-label">Saved</span>
                </button>
            </nav>
        </div>
    );
};

export default UserHome;