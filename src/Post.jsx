// src/Post.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaDonate, FaBookmark } from 'react-icons/fa';

/**
 * Reusable ActionButton Component
 * Wraps an icon with Framer Motion hover and tap animations.
 */
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
 * Post Component
 * Renders a full-screen post with a background image,
 * bottom-left user info, and bottom-right icon buttons.
 *
 * The bottom elements are positioned with an inline style that moves them up by
 * `calc(1rem + env(safe-area-inset-bottom))` to avoid being covered by the device's UI.
 */
const Post = ({ post, onCommentClick }) => {
    return (
        <div className="relative w-full h-full">
            {/* Main Post Image */}
            <img
                src={post.mainImage}
                alt="Post"
                className="w-full h-full object-cover"
            />

            {/* Bottom Left: User Info */}
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
                <p className="text-lg">{post.description}</p>
                <p className="text-xs opacity-75">{post.date}</p>
            </div>

            {/* Bottom Right: Action Buttons */}
            <div
                className="absolute right-4 flex flex-col space-y-4"
                style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
            >
                <ActionButton>
                    <FaHeart size={24} color="white" />
                </ActionButton>
                <ActionButton onClick={() => onCommentClick(post)}>
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
