// src/Feed.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import postsData from './posts.json';
import Post from './Post';

const Feed = () => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Called when a swipe gesture is detected
    const paginate = (newDirection) => {
        setDirection(newDirection);
        setIndex((prevIndex) => {
            let newIndex = prevIndex + newDirection;
            if (newIndex < 0) newIndex = postsData.length - 1;
            if (newIndex >= postsData.length) newIndex = 0;
            return newIndex;
        });
    };

    // Variants for entering, centered, and exiting posts.
    const variants = {
        enter: (direction) => ({
            y: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            y: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            zIndex: 0,
            y: direction > 0 ? -1000 : 1000,
            opacity: 0,
        }),
    };

    // Threshold for triggering a swipe (in pixels)
    const dragThreshold = 100;

    return (
        <div className="relative h-screen overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={postsData[index].id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        y: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={(event, info) => {
                        // If the drag offset exceeds the threshold, trigger the appropriate pagination
                        if (info.offset.y < -dragThreshold) {
                            paginate(1);
                        } else if (info.offset.y > dragThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute w-full h-full"
                >
                    <Post post={postsData[index]} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Feed;
