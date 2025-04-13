import React, { useState } from 'react';
import { MessageCircle, Gift, DollarSign, Heart, Users, Calendar, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

// This is where you'll replace with your JSON data
const profileData = {
    coverImage: "/profile/cover.png",
    profileImage: "/profile/avatar.jpg",
    username: "Oana Roman",
    joinDate: "March 15, 2024",
    followers: 12482,
    following: 345,
    subscribers: 5621,
    bio: "Award-winning photographer and digital artist based in San Francisco. Specializing in portrait and landscape photography. My work has been featured in National Geographic, Vogue, and various exhibitions around the world. I'm passionate about capturing moments that tell stories and evoke emotions. When I'm not behind the camera, you can find me hiking or experimenting with new coffee brewing methods.",
    isVerified: true,
    isFollowing: false,
    isSubscribed: false
};

const ProfilePage = () => {
    const [isFollowing, setIsFollowing] = useState(profileData.isFollowing);
    const [isSubscribed, setIsSubscribed] = useState(profileData.isSubscribed);
    const [followers, setFollowers] = useState(profileData.followers);
    const [showFullBio, setShowFullBio] = useState(false);

    const toggleFollow = () => {
        if (isFollowing) {
            setFollowers(prev => prev - 1);
        } else {
            setFollowers(prev => prev + 1);
        }
        setIsFollowing(!isFollowing);
    };

    const toggleSubscribe = () => {
        setIsSubscribed(!isSubscribed);
    };

    const truncateBio = (bio) => {
        if (bio.length <= 150 || showFullBio) return bio;
        return bio.substring(0, 150) + '...';
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden">
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 w-full overflow-hidden">
                <img
                    src={profileData.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Profile Section */}
            <div className="relative px-4 md:px-6 pb-5">
                {/* Profile Image with different layouts for mobile and desktop */}
                <div className="absolute -top-8 left-4 md:left-6">
                    <div className="relative">
                        <img
                            src={profileData.profileImage}
                            alt={profileData.username}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-900 object-cover"
                        />
                        {profileData.isVerified && (
                            <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile layout - username below profile image */}
                <div className="pt-16 mt-2 md:hidden">
                    <h1 className="text-2xl font-bold text-white">
                        {profileData.username}
                    </h1>
                    <div className="flex flex-wrap items-center mt-2 text-sm text-gray-400 gap-4">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Joined: {profileData.joinDate}</span>
                        </div>
                        <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>Followed by {followers.toLocaleString()} people</span>
                        </div>
                    </div>
                </div>

                {/* Desktop layout - username next to profile image */}
                <div className="hidden md:block md:ml-40 pt-4">
                    <h1 className="text-3xl font-bold text-white">
                        {profileData.username}
                    </h1>
                    <div className="flex items-center mt-2 text-sm text-gray-400 space-x-4">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Joined: {profileData.joinDate}</span>
                        </div>
                        <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>Followed by {followers.toLocaleString()} people</span>
                        </div>
                    </div>
                </div>

                {/* Follow/Subscribe Buttons */}
                <div className="flex flex-wrap gap-2 mt-6 md:justify-center">
                    <motion.button
                        onClick={toggleFollow}
                        className={`flex items-center justify-center px-4 py-2 rounded-full ${
                            isFollowing
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        } transition-all duration-200 flex-grow md:flex-grow-0 md:w-80 md:mx-2`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Heart className={`h-4 w-4 mr-1 ${isFollowing ? 'fill-current' : ''}`} />
                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </motion.button>
                    <motion.button
                        onClick={toggleSubscribe}
                        className={`flex items-center justify-center px-4 py-2 rounded-full ${
                            isSubscribed
                                ? 'bg-purple-700 text-white'
                                : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800'
                        } transition-all duration-200 flex-grow md:flex-grow-0 md:w-80 md:mx-2`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Bell className="h-4 w-4 mr-1" />
                        <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                    </motion.button>
                </div>

                {/* Action Buttons (using mobile style for both mobile and desktop) */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <motion.button
                        className="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs md:text-sm mt-1 text-gray-700 dark:text-gray-300">Message</span>
                    </motion.button>
                    <motion.button
                        className="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Gift className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        <span className="text-xs md:text-sm mt-1 text-gray-700 dark:text-gray-300">Gift</span>
                    </motion.button>
                    <motion.button
                        className="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-xs md:text-sm mt-1 text-gray-700 dark:text-gray-300">Tip</span>
                    </motion.button>
                </div>

                {/* Bio */}
                <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                        {truncateBio(profileData.bio)}
                    </p>
                    {profileData.bio.length > 150 && (
                        <motion.button
                            onClick={() => setShowFullBio(!showFullBio)}
                            className="mt-2 text-blue-600 dark:text-blue-400 flex items-center text-sm font-medium hover:underline"
                            whileHover={{ x: showFullBio ? -5 : 5 }}
                        >
                            {showFullBio ? (
                                <>
                                    <span>Show less</span>
                                    <ChevronUp className="h-4 w-4 ml-1" />
                                </>
                            ) : (
                                <>
                                    <span>Read more</span>
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                </>
                            )}
                        </motion.button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    <motion.div
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{followers.toLocaleString()}</div>
                    </motion.div>
                    <motion.div
                        className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-3 rounded-lg"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{profileData.following.toLocaleString()}</div>
                    </motion.div>
                    <motion.div
                        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="text-sm text-gray-500 dark:text-gray-400">Subscribers</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{profileData.subscribers.toLocaleString()}</div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
