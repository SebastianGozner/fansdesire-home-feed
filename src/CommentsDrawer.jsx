// src/CommentsDrawer.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

const CommentsDrawer = ({ isOpen, comments, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed bottom-0 left-0 right-0 bg-[#222222] rounded-t-lg shadow-lg p-4 z-50"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-white">Comments</h2>
                        <button onClick={onClose} className="text-gray-300">
                            Close
                        </button>
                    </div>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex items-center justify-between border-b pb-2"
                                >
                                    <div className="flex items-center">
                                        {/* Avatar on the left */}
                                        <img
                                            src={comment.avatar || "avatar.jpg"}
                                            alt={comment.username}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <div>
                      <span className="font-bold text-white mr-1">
                        {comment.username}:
                      </span>
                                            <span className="text-gray-300">{comment.text}</span>
                                        </div>
                                    </div>
                                    {/* Like button on the right */}
                                    <button className="p-2">
                                        <FaHeart size={16} color="white" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No comments yet.</p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommentsDrawer;
