import React, { useState, useEffect, useRef } from "react";
import axiosInstance from '../../api/axiosInstance';
import "../../styles/userHome.css"; // Reuse existing styles for video feed
import "../../styles/foodPartnerHome.css"; // New dashboard styles
import { useNavigate } from "react-router-dom";

// Duplicated VideoCard for now as per plan


const FoodPartnerHome = () => {
    const navigate = useNavigate();
    const [showReels, setShowReels] = useState(false);
    const [videos, setVideos] = useState([]);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [isMuted, setIsMuted] = useState(true);

    // Form States
    const [foodName, setFoodName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    // Restaurant background image states
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageUploadStatus, setImageUploadStatus] = useState(null);
    const handleFileChange = (e) => {
        if (e.target.files[0]) { setVideoFile(e.target.files[0]); }
    };

    const handleProfileImageChange = (e) => {
        if (e.target.files[0]) { setProfileImageFile(e.target.files[0]); }
    };

    const handleProfileImageUpload = async (e) => {
        e.preventDefault();
        if (!profileImageFile) { alert("Please select an image file first"); return; }
        const formData = new FormData();
        formData.append("image", profileImageFile);
        setIsUploadingImage(true);
        setImageUploadStatus(null);
        try {
            await axiosInstance.post("/api/auth/foodpartner/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setImageUploadStatus('success');
            setProfileImageFile(null);
            setTimeout(() => setImageUploadStatus(null), 3000);
        } catch (error) {
            console.error("Image upload failed:", error);
            setImageUploadStatus('error');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!foodName || !description || !videoFile) {
            alert("Please fill all fields");
            return;
        }

        const formData = new FormData();
        formData.append("foodname", foodName);
        formData.append("description", description);
        formData.append("video", videoFile);
        if (tags) {
            formData.append("tags", tags);
        }

        setIsUploading(true);
        setUploadStatus(null);

        try {
            const response = await axiosInstance.post("/api/food/addItem", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUploadStatus('success');
            setFoodName("");
            setDescription("");
            setTags("");
            setVideoFile(null);
            // clear success message after 3 seconds
            setTimeout(() => setUploadStatus(null), 3000);
        } catch (error) {
            console.error("Upload failed:", error);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };



    const fetchMyReels = async () => {
        try {
            const response = await axiosInstance.get("/api/food/getFoodpartnerItems");
            if (response.data && response.data.videos) {
                setVideos(response.data.videos);
                if (response.data.videos.length > 0) {
                    setActiveVideoId(response.data.videos[0]._id);
                }
            }
        } catch (error) {
            console.error("Error fetching my reels:", error);
        }
    };

    const toggleReels = () => {
        if (!showReels) {
            fetchMyReels();
        }
        setShowReels(!showReels);
    };

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

    if (showReels) {
        return (
            <div className="reels-view-overlay">
                <button
                    onClick={toggleReels}
                    className="back-btn"
                >
                    ← Back to Dashboard
                </button>
                <div className="video-feed-container" onScroll={handleScroll}>
                    {videos.length === 0 ? (
                        <div className="empty-state">No videos uploaded yet.</div>
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
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Partner Dashboard</h1>
                    <p>Manage your culinary content</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/foodpartner/profile')}
                        className="view-reels-btn"
                        style={{ background: 'var(--color-surface)' }}
                    >
                        👤 My Profile
                    </button>
                    <button onClick={toggleReels} className="view-reels-btn">
                        View My Reels 📱
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="upload-card">
                    <h2 className="card-title">
                        📤 Upload New Reel
                    </h2>

                    <form onSubmit={handleUpload} className="upload-form">
                        <div className="form-group">
                            <label>Dish Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={foodName}
                                onChange={(e) => setFoodName(e.target.value)}
                                placeholder="e.g., Signature Pasta"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell us about this dish..."
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Tags (Optional)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g., spicy, vegan, dessert"
                            />
                        </div>

                        <div className="form-group">
                            <label>Video File</label>
                            <div className="file-drop-zone">
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="file-input-hidden"
                                />
                                <div className="file-label-text">
                                    <span style={{ fontSize: '2rem' }}>📹</span>
                                    <span>
                                        {videoFile ? `✅ ${videoFile.name}` : 'Click or Drag video here'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {uploadStatus === 'success' && (
                            <div className="upload-status success">
                                ✅ Upload Successful!
                            </div>
                        )}
                        {uploadStatus === 'error' && (
                            <div className="upload-status error">
                                ❌ Upload Failed. Please try again.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isUploading}
                            className="submit-btn"
                        >
                            {isUploading ? 'Uploading...' : 'Publish Reel'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default FoodPartnerHome;
