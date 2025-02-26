// src/Post.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaDonate, FaBookmark } from 'react-icons/fa';

const ActionButton = ({ children, onClick }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2"
    >
        {children}
    </motion.button>
);

/**
 * Renders multiple media items (images/videos) in a horizontal scroll-snap carousel.
 */
const MediaCarousel = ({ items }) => {
    return (
        <div className="h-full w-full overflow-x-scroll snap-x snap-mandatory scroll-smooth">
            <div className="flex h-full w-full">
                {items.map((item, index) => (
                    <div key={index} className="snap-start h-full w-full flex-shrink-0">
                        {item.type === 'video' ? (
                            <video
                                src={item.src}
                                autoPlay
                                loop
                                muted
                                playsInline
                                webkit-playsinline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={item.src}
                                alt={`Media ${index}`}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Post = ({ post, onCommentClick }) => {
    const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // Truncation constants
    const MAX_LENGTH = 33;
    const TRUNCATED_LENGTH = 22;
    const shouldTruncate = post.description.length > MAX_LENGTH;

    const handleReadMoreClick = (e) => {
        e.stopPropagation();
        setDescriptionExpanded(true);
    };

    // Collapse expanded description on tap anywhere else
    const handleContainerClick = () => {
        if (isDescriptionExpanded) {
            setDescriptionExpanded(false);
        }
    };

    return (
        <div
            className="relative w-full h-full"
            onClick={handleContainerClick}
        >
            {/* If post has multiple items, use the carousel; otherwise fallback to single image */}
            {post.items && post.items.length > 0 ? (
                <MediaCarousel items={post.items} />
            ) : (
                <img
                    src={post.mainImage}
                    alt="Post"
                    className="w-full h-full object-cover"
                />
            )}

            {/* Dark overlay for better text contrast when description is expanded */}
            {isDescriptionExpanded && (
                <div className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none"></div>
            )}

            {/* Bottom Left: User Info + Description */}
            <div
                className="absolute left-4 text-white"
                style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
            >
                <div className="flex items-center mb-2">
                    <img
                        src={post.avatar}
                        alt={post.username}
                        className="w-10 h-10 rounded-full mr-2"
                    />
                    <span className="font-bold">{post.username}</span>
                </div>
                <p className="text-lg max-w-[33ch] break-words">
                    {isDescriptionExpanded || !shouldTruncate ? (
                        post.description
                    ) : (
                        <>
                            {post.description.substring(0, TRUNCATED_LENGTH)}...
                            <span
                                className="underline cursor-pointer ml-1"
                                onClick={handleReadMoreClick}
                            >
                Read More
              </span>
                        </>
                    )}
                </p>
                <p className="text-xs opacity-75">{post.date}</p>
            </div>

            {/* Bottom Right: Action Buttons */}
            <div
                className="absolute right-4 flex flex-col space-y-4"
                style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
            >
                <ActionButton
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsLiked((prev) => !prev);
                    }}
                >
                    <FaHeart size={24} color={isLiked ? "red" : "white"} />
                </ActionButton>
                <ActionButton
                    onClick={(e) => {
                        e.stopPropagation();
                        onCommentClick(post);
                    }}
                >
                    <FaComment size={24} color="white" />
                </ActionButton>
                <ActionButton>
                    <FaDonate size={24} color="white" />
                </ActionButton>
                <ActionButton>
                    <FaBookmark size={24} color="white" />
                </ActionButton>
            </div>
        </div>
    );
};

export default Post;
