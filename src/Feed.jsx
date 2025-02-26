// src/Feed.js
import React, { useEffect } from 'react';
import postsData from './posts.json';
import Post from './Post';
import CommentsDrawer from './CommentsDrawer';

const Feed = () => {
    // Track whether the comments drawer is open, etc.
    const [commentsDrawerOpen, setCommentsDrawerOpen] = React.useState(false);
    const [selectedPost, setSelectedPost] = React.useState(null);

    // 1) Define a function to set the custom --vh variable
    const setViewportHeight = () => {
        // window.innerHeight is the *actual* height of the visible area in px
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // 2) On component mount, and whenever the window resizes, update --vh
    useEffect(() => {
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        return () => {
            window.removeEventListener('resize', setViewportHeight);
        };
    }, []);

    // Handle comment icon clicks
    const handleCommentClick = (post) => {
        setSelectedPost(post);
        setCommentsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setCommentsDrawerOpen(false);
    };

    return (
        <div className="relative">
            {/*
        3) Use the custom --vh variable to set the container's height
        scroll-smooth + snap-y + snap-mandatory for that IG Reels feel
      */}
            <div
                className="overflow-y-scroll snap-y snap-mandatory scroll-smooth"
                style={{
                    height: 'calc(var(--vh, 1vh) * 100)',
                }}
            >
                {postsData.map((post) => (
                    <div key={post.id} className="snap-start h-full">
                        <Post post={post} onCommentClick={handleCommentClick} />
                    </div>
                ))}
            </div>

            {/* Comments Drawer */}
            <CommentsDrawer
                isOpen={commentsDrawerOpen}
                comments={selectedPost ? selectedPost.comments : []}
                onClose={handleCloseDrawer}
            />
        </div>
    );
};

export default Feed;
