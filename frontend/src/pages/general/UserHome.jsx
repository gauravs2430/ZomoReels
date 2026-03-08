import React, { useState, useEffect, useRef } from "react";
import "../../styles/userHome.css";
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
//  VideoCard
//  Props:
//    video      - food document from DB (includes likeCount)
//    isActive   - whether this card is currently in view
//    toggleMute - mutes/unmutes all videos globally
//    isMuted    - current mute state
// ─────────────────────────────────────────────────────────────
const VideoCard = ({ video, isActive, toggleMute, isMuted }) => {
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [isTruncated, setIsTruncated] = useState(true);

    // ── Like State ──────────────────────────────────────────
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(video.likeCount || 0);

    // ── Save State ──────────────────────────────────────────
    // saved: whether the user has bookmarked this reel
    // Calls POST /api/food/save { foodId } — toggles save/unsave in DB
    const [saved, setSaved] = useState(false);

    // Auto-play / pause based on visibility
    useEffect(() => {
        if (isActive) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
        } else {
            videoRef.current.pause();
        }
    }, [isActive]);

    // ── Handle Like / Unlike ────────────────────────────────
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

    // ── Handle Save / Unsave ────────────────────────────────
    // Flow: optimistic toggle → POST /api/food/save { foodId }
    // Backend creates or deletes a save document for this user+food pair
    const handleSave = async (e) => {
        e.stopPropagation();
        const wasSaved = saved;
        setSaved(!wasSaved);
        try {
            await axiosInstance.post("/api/food/save", { foodId: video._id });
        } catch (err) {
            console.error("Save failed:", err);
            setSaved(wasSaved); // rollback on error
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

            <div className="video-overlay">
                {/* Bottom-left: dish name, description, visit store */}
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
                        // Navigate to the restaurant's public profile page
                        // RestaurantProfile.jsx shows reels only if user is logged in
                        navigate(`/restaurant/${video.foodpartner}`);
                    }}>
                        Visit Store <span>→</span>
                    </button>
                </div>

                {/* Right-side action buttons */}
                <div className="sidebar-actions">

                    {/* Like button */}
                    <div
                        className={`action-btn ${liked ? 'liked' : ''}`}
                        onClick={handleLike}
                        title={liked ? "Unlike" : "Like"}
                    >
                        {liked ? '❤️' : '🤍'}
                        <span className="action-label">{likes}</span>
                    </div>

                    {/* 💬 Comment — placeholder */}
                    <div className="action-btn" title="Comment (coming soon)">
                        💬
                    </div>

                    {/* � Save button
                        - Calls POST /api/food/save with { foodId }
                        - Toggles saved state optimistically */}
                    <div
                        className={`action-btn ${saved ? 'saved' : ''}`}
                        onClick={handleSave}
                        title={saved ? "Unsave" : "Save"}
                    >
                        {saved ? '�' : '🏷️'}
                        <span className="action-label">{saved ? 'SAVED' : 'SAVE'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  UserHome
//  - Fetches all food reels from GET /api/food/getItem
//  - Manages scroll-snap active video tracking
//  - Renders a vertical TikTok-style feed of VideoCards
// ─────────────────────────────────────────────────────────────
const UserHome = () => {
    const [videos, setVideos] = useState([]);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // GET /api/food/getItem → returns { foodItem: [...] }
                // Each food item now includes `likeCount` from food.models.js
                const response = await axiosInstance.get("/api/food/getItem");
                if (response.data && response.data.foodItem) {
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

    // Track which video is currently in view using scroll position
    const handleScroll = (e) => {
        const container = e.target;
        const scrollPosition = container.scrollTop;
        const videoHeight = container.clientHeight;
        const index = Math.round(scrollPosition / videoHeight);

        if (videos[index] && videos[index]._id !== activeVideoId) {
            setActiveVideoId(videos[index]._id);
        }
    };

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <div className="video-feed-container" onScroll={handleScroll}>
            {!loaded ? (
                <div className="loading-state">Loading delicious feed...</div>
            ) : videos.length === 0 ? (
                <div className="loading-state">🍽️ No reels yet! Check back soon.</div>
            ) : (
                videos.map((video) => (
                    <VideoCard
                        key={video._id}
                        video={video}          // full food doc with likeCount
                        isActive={video._id === activeVideoId}
                        toggleMute={toggleMute}
                        isMuted={isMuted}
                    />
                ))
            )}
        </div>
    );
};

export default UserHome;