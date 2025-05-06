// src/components/MediaViewerModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MediaViewerModal = ({ isOpen, onClose, mediaUrl, mediaType }) => {
    if (!isOpen || !mediaUrl) return null;

    const isVideo = mediaType === 'video' || mediaType === 'view_once_video';
    const isImage = mediaType === 'image' || mediaType === 'view_once_image';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={onClose} // Close when clicking the backdrop
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
                        className="relative max-w-[90vw] max-h-[90vh] bg-[#1f1f1f] rounded-lg shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Close media viewer"
                        >
                            <X size={24} />
                        </button>

                        {/* Media Content */}
                        {isImage && (
                            <img
                                src={mediaUrl}
                                alt="Viewed Content"
                                className="block max-w-full max-h-[85vh] object-contain" // Adjust max-h as needed
                                onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/300x200.png?text=Error+Loading+Image'}} // Basic error placeholder
                            />
                        )}
                        {isVideo && (
                            <video
                                src={mediaUrl}
                                controls // Add video controls
                                autoPlay // Optional: start playing automatically
                                className="block max-w-full max-h-[85vh] object-contain" // Adjust max-h as needed
                                onError={(e) => console.error("Error loading video:", e)} // Basic error handling
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MediaViewerModal;
