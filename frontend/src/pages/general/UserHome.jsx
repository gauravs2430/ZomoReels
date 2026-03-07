import React, { useState, useEffect, useRef } from "react";
import "../../styles/userHome.css";
import axiosInstance from '../../api/axiosInstance';

const VideoCard = ({ video, isActive, toggleMute, isMuted }) => {
    const videoRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(true);

    useEffect(() => {
        if (isActive) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(error => console.log("Autoplay prevented:", error));
        } else {
            videoRef.current.pause();
        }
    }, [isActive]);

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
                        console.log(`Navigating to store ${video.foodpartner}`);
                        // navigate(`/store/${video.foodpartner}`);
                    }}>
                        Visit Store <span>→</span>
                    </button>
                </div>

                <div className="sidebar-actions">
                    <div className="action-btn">
                        ❤️ <span className="action-label">{Math.floor(Math.random() * 1000) + 100}</span>
                    </div>
                    <div className="action-btn">
                        💬
                    </div>
                    <div className="action-btn">
                        🔗
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserHome = () => {
    const [videos, setVideos] = useState([]);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
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

    const handleScroll = (e) => {
        const container = e.target;
        const scrollPosition = container.scrollTop;
        const videoHeight = container.clientHeight;
        const index = Math.round(scrollPosition / videoHeight);

        if (videos[index] && videos[index]._id !== activeVideoId) {
            setActiveVideoId(videos[index]._id);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

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
                        video={video}
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