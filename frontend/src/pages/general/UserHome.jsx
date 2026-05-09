import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/userHome.css";
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
//  MuteIcon / UnmuteIcon  (inline SVG — no external dep)
// ─────────────────────────────────────────────────────────────────────────────
const MuteIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H2v6h4l5 4V5z"/>
        <line x1="23" y1="9" x2="17" y2="15"/>
        <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
);

const UnmuteIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
);

const HeartIcon = ({ filled }) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? "#ff4d6d" : "none"} stroke={filled ? "#ff4d6d" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
);

const BookmarkIcon = ({ filled }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#FFD600" : "none"} stroke={filled ? "#FFD600" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
);

const ShareIcon = () => (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
);

const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
);

const SavedNavIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
//  formatCount  — "1200" → "1.2K", "1000000" → "1M"
// ─────────────────────────────────────────────────────────────────────────────
function formatCount(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
}

// ─────────────────────────────────────────────────────────────────────────────
//  TagBadge
// ─────────────────────────────────────────────────────────────────────────────
const TagBadge = ({ tag }) => (
    <span className="tag-badge">#{tag}</span>
);

// ─────────────────────────────────────────────────────────────────────────────
//  VideoCard
//  Renders one full-screen reel with all premium interactions.
// ─────────────────────────────────────────────────────────────────────────────
const VideoCard = ({ video, isActive, isMuted, onMuteToggle }) => {
    const videoRef = useRef(null);
    const navigate = useNavigate();

    const [isTruncated, setIsTruncated] = useState(true);
    const [liked,  setLiked]  = useState(false);
    const [likes,  setLikes]  = useState(video.likeCount || 0);
    const [saved,  setSaved]  = useState(false);
    const [showTap, setShowTap] = useState(false);
    const [showLikeAnim, setShowLikeAnim] = useState(false);
    const [progress, setProgress] = useState(0);
    const tapTimer = useRef(null);
    const lastTap  = useRef(0);

    // ── Auto-play / pause ────────────────────────────────────────────────────
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        if (isActive) {
            el.currentTime = 0;
            el.play().catch(() => {});
        } else {
            el.pause();
        }
    }, [isActive]);

    // ── Sync muted state ─────────────────────────────────────────────────────
    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = isMuted;
    }, [isMuted]);

    // ── Progress bar ─────────────────────────────────────────────────────────
    const handleTimeUpdate = useCallback(() => {
        const el = videoRef.current;
        if (!el || !el.duration) return;
        setProgress((el.currentTime / el.duration) * 100);
    }, []);

    // ── Like ─────────────────────────────────────────────────────────────────
    const handleLike = async (e) => {
        e?.stopPropagation?.();
        const wasLiked = liked;
        setLiked(l => !l);
        setLikes(n => wasLiked ? n - 1 : n + 1);
        if (!wasLiked) {
            setShowLikeAnim(true);
            setTimeout(() => setShowLikeAnim(false), 900);
        }
        try {
            await axiosInstance.post("/api/food/like", { foodId: video._id });
        } catch {
            setLiked(wasLiked);
            setLikes(n => wasLiked ? n + 1 : n - 1);
        }
    };

    // ── Save ─────────────────────────────────────────────────────────────────
    const handleSave = async (e) => {
        e?.stopPropagation?.();
        const wasSaved = saved;
        setSaved(s => !s);
        try {
            await axiosInstance.post("/api/food/save", { foodId: video._id });
        } catch {
            setSaved(wasSaved);
        }
    };

    // ── Double-tap to like ───────────────────────────────────────────────────
    const handleVideoTap = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
            clearTimeout(tapTimer.current);
            handleLike();
        } else {
            tapTimer.current = setTimeout(() => onMuteToggle(), 250);
            setShowTap(true);
            setTimeout(() => setShowTap(false), 600);
        }
        lastTap.current = now;
    };

    // ── Share (Web Share API → fallback clipboard) ────────────────────────────
    const handleShare = async (e) => {
        e.stopPropagation();
        const shareData = { title: video.foodname, text: video.description, url: window.location.href };
        if (navigator.share) {
            await navigator.share(shareData).catch(() => {});
        } else {
            await navigator.clipboard.writeText(window.location.href).catch(() => {});
        }
    };

    const tags = video.tags?.slice(0, 3) || [];

    return (
        <div className="video-card">
            {/* Video element */}
            <video
                ref={videoRef}
                className="video-player"
                src={video.video}
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onClick={handleVideoTap}
                preload="metadata"
            />

            {/* Double-tap ripple */}
            {showTap && <div className="tap-ripple"><div className="tap-ring" /></div>}

            {/* Double-tap like burst */}
            {showLikeAnim && (
                <div className="like-burst" aria-hidden>❤️</div>
            )}

            {/* Progress bar */}
            <div className="video-progress-bar">
                <div className="video-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Top bar: mute toggle + ZomoReels brand */}
            <div className="top-bar">
                <div className="brand-pill">
                    <span className="brand-dot" />
                    ZomoReels
                </div>
                <button
                    className="mute-btn"
                    onClick={(e) => { e.stopPropagation(); onMuteToggle(); }}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <MuteIcon /> : <UnmuteIcon />}
                </button>
            </div>

            {/* Bottom-left info overlay */}
            <div className="video-overlay">
                <div className="store-info">
                    {/* Tags row */}
                    {tags.length > 0 && (
                        <div className="tags-row">
                            {tags.map(t => <TagBadge key={t} tag={t} />)}
                        </div>
                    )}

                    <h3 className="store-name">{video.foodname}</h3>

                    <p
                        className={`video-description ${isTruncated ? 'truncated' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setIsTruncated(t => !t); }}
                    >
                        {video.description}
                        {isTruncated && <span className="read-more"> more</span>}
                    </p>

                    <button
                        className="visit-store-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/restaurant/${video.foodpartner}`);
                        }}
                    >
                        🍽️ &nbsp;Visit Restaurant
                    </button>
                </div>
            </div>

            {/* Right sidebar actions */}
            <div className="sidebar-actions">
                {/* Like */}
                <div
                    className={`action-item ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                    role="button"
                    aria-label="Like"
                >
                    <div className="action-circle">
                        <HeartIcon filled={liked} />
                    </div>
                    <span className="action-count">{formatCount(likes)}</span>
                </div>

                {/* Comment (placeholder — future feature) */}
                <div className="action-item" role="button" aria-label="Comment">
                    <div className="action-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                    <span className="action-count">Chat</span>
                </div>

                {/* Save */}
                <div
                    className={`action-item ${saved ? 'saved' : ''}`}
                    onClick={handleSave}
                    role="button"
                    aria-label="Save"
                >
                    <div className="action-circle">
                        <BookmarkIcon filled={saved} />
                    </div>
                    <span className="action-count">{saved ? 'Saved' : 'Save'}</span>
                </div>

                {/* Share */}
                <div className="action-item" role="button" aria-label="Share" onClick={handleShare}>
                    <div className="action-circle">
                        <ShareIcon />
                    </div>
                    <span className="action-count">Share</span>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
//  LoadingSkeleton — shown while reels are fetching
// ─────────────────────────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
    <div className="loading-skeleton">
        <div className="skeleton-shimmer" />
        <div className="loading-brand">
            <div className="loading-logo">🍜</div>
            <p className="loading-text">Loading your reels…</p>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  SavedFeed
// ─────────────────────────────────────────────────────────────────────────────
const SavedFeed = ({ isMuted, onMuteToggle }) => {
    const [savedVideos, setSavedVideos] = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [activeId,    setActiveId]    = useState(null);

    useEffect(() => {
        axiosInstance.get("/api/food/saved")
            .then(res => {
                const items = res.data?.savedItems ?? [];
                setSavedVideos(items);
                if (items.length) setActiveId(items[0]._id);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleScroll = (e) => {
        const idx = Math.round(e.target.scrollTop / e.target.clientHeight);
        if (savedVideos[idx]?._id !== activeId) setActiveId(savedVideos[idx]?._id);
    };

    if (loading) return <LoadingSkeleton />;
    if (!savedVideos.length) return (
        <div className="empty-state">
            <div className="empty-icon">🏷️</div>
            <h2>Nothing saved yet</h2>
            <p>Tap the bookmark on any reel to save it here.</p>
        </div>
    );

    return (
        <div className="video-feed-container" onScroll={handleScroll}>
            {savedVideos.map(v => (
                <VideoCard
                    key={v._id}
                    video={v}
                    isActive={v._id === activeId}
                    isMuted={isMuted}
                    onMuteToggle={onMuteToggle}
                />
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
//  UserHome — root component
// ─────────────────────────────────────────────────────────────────────────────
const UserHome = () => {
    const [activeTab,     setActiveTab]     = useState('home');
    const [videos,        setVideos]        = useState([]);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [isMuted,       setIsMuted]       = useState(true);
    const [loaded,        setLoaded]        = useState(false);

    useEffect(() => {
        axiosInstance.get("/api/food/getItem")
            .then(res => {
                const items = res.data?.foodItem ?? [];
                setVideos(items);
                if (items.length) setActiveVideoId(items[0]._id);
            })
            .catch(console.error)
            .finally(() => setLoaded(true));
    }, []);

    const handleScroll = (e) => {
        const idx = Math.round(e.target.scrollTop / e.target.clientHeight);
        if (videos[idx]?._id !== activeVideoId) setActiveVideoId(videos[idx]?._id);
    };

    const toggleMute = useCallback(() => setIsMuted(m => !m), []);

    return (
        <div className="user-home-wrapper">
            {/* ── Feed Area ─────────────────────────────────── */}
            <div className="feed-area">
                {activeTab === 'home' ? (
                    !loaded ? (
                        <LoadingSkeleton />
                    ) : videos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🍽️</div>
                            <h2>No reels yet</h2>
                            <p>Food partners haven't posted any reels yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="video-feed-container" onScroll={handleScroll}>
                            {videos.map(v => (
                                <VideoCard
                                    key={v._id}
                                    video={v}
                                    isActive={v._id === activeVideoId}
                                    isMuted={isMuted}
                                    onMuteToggle={toggleMute}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <SavedFeed isMuted={isMuted} onMuteToggle={toggleMute} />
                )}
            </div>

            {/* ── Bottom Navigation ─────────────────────────── */}
            <nav className="bottom-nav">
                <button
                    id="home-tab-btn"
                    className={`bottom-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('home')}
                >
                    <span className="bnav-icon"><HomeIcon /></span>
                    <span className="bnav-label">Home</span>
                </button>
                <button
                    id="saved-tab-btn"
                    className={`bottom-nav-btn ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    <span className="bnav-icon"><SavedNavIcon /></span>
                    <span className="bnav-label">Saved</span>
                </button>
            </nav>
        </div>
    );
};

export default UserHome;