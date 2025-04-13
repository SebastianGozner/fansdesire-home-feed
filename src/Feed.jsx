import React, { useEffect } from 'react';
import postsData from './posts.json';
import Post from './Post';
import CommentsDrawer from './CommentsDrawer';

const Feed = () => {
    const [commentsDrawerOpen, setCommentsDrawerOpen] = React.useState(false);
    const [selectedPost, setSelectedPost] = React.useState(null);

    // Set a CSS variable for the actual viewport height (to deal with iOS Safari issues)
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    useEffect(() => {
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        return () => {
            window.removeEventListener('resize', setViewportHeight);
        };
    }, []);

    // Handle comment icon click
    const handleCommentClick = (post) => {
        setSelectedPost(post);
        setCommentsDrawerOpen(true);
    };

    // Handle closing the comments drawer
    const handleCloseDrawer = () => {
        setCommentsDrawerOpen(false);
    };

    // Define header height (adjust as needed)
    const headerHeight = "calc(56px + env(safe-area-inset-top))";
    // Feed height: full viewport height minus header and bottom safe-area inset
    const feedHeight = "calc(var(--vh, 1vh) * 100 - (56px + env(safe-area-inset-top) + env(safe-area-inset-bottom)))";

    return (
        <div className="relative h-screen">
            {/*
        The feed container starts below the header (using marginTop)
        and fills the remaining space (using the calculated feedHeight)
      */}
            <div style={{ marginTop: headerHeight }}>
                <div
                    className="overflow-y-scroll snap-y snap-mandatory scroll-smooth"
                    style={{ height: feedHeight }}
                >
                    {postsData.map((post) => (
                        <div key={post.id} className="snap-start h-full">
                            <Post post={post} onCommentClick={handleCommentClick} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Comments Drawer remains fixed */}
            <CommentsDrawer
                isOpen={commentsDrawerOpen}
                comments={selectedPost ? selectedPost.comments : []}
                onClose={handleCloseDrawer}
            />
        </div>
    );
};

export default Feed;
