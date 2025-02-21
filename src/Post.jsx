// src/Post.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaDonate, FaBookmark } from 'react-icons/fa';

/**
 * Reusable ActionButton Component
 * Wraps an icon with Framer Motion hover and tap animations.
 */
const ActionButton = ({ children }) => (
    <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2"
    >
        {children}
    </motion.button>
);

/**
 * Post Component
 * Renders a single post with its image, user info, and action buttons.
 *
 * Props:
 * - post: Object containing post details:
 *   - mainImage: URL of the post's main image
 *   - avatar: URL of the user's avatar
 *   - username: The user's name
 *   - description: A short description of the post
 *   - date: The date of the post
 */
const Post = ({ post }) => {
    return (
        <div className="relative w-full h-screen">
            {/* Main Post Image */}
            <img
                src={post.mainImage}
                alt="Post"
                className="w-full h-full object-cover"
            />

            {/* Bottom Left: User Info */}
            <div className="absolute bottom-4 left-4 text-white">
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
            <div className="absolute bottom-4 right-4 flex flex-col space-y-4">
                <ActionButton>
                    <FaHeart size={24} color="white" />
                </ActionButton>
                <ActionButton>
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
