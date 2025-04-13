import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const CharacterCard = ({
                           character,
                           selectedNodes = [],
                           onCardHover = () => {},
                           onCardLeave = () => {}
                       }) => {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);

    // Handle card hover state
    const handleMouseEnter = () => {
        setIsHovered(true);
        onCardHover(character);

        // Play video when available
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.log("Video playback prevented:", err);
            });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        onCardLeave();

        // Pause and reset video
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    // Calculate match strength with selected nodes
    const matchStrength = selectedNodes.length === 0
        ? 1
        : selectedNodes.filter(node => character.traits.includes(node.id)).length / selectedNodes.length;

    // Create array of trait badges to display (max 3)
    const traitBadges = character.traits.slice(0, 3).map(traitId => {
        const isSelected = selectedNodes.some(node => node.id === traitId);
        return { id: traitId, isSelected };
    });

    // Random dialogue to show (changes every few seconds)
    const [dialogueIndex, setDialogueIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDialogueIndex(prev =>
                (prev + 1) % (character.sampleDialogue?.length || 1)
            );
        }, 5000);

        return () => clearInterval(intervalId);
    }, [character.sampleDialogue]);

    // Determine card opacity based on match strength
    const cardOpacity = Math.max(0.4, matchStrength);

    return (
        <motion.div
            className="character-card w-64 h-96 rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: cardOpacity,
                y: 0,
                scale: isHovered ? 1.05 : 1,
                boxShadow: isHovered ? '0 20px 25px -5px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
            transition={{ duration: 0.3 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Static Image */}
            <img
                src={character.imageSrc || "/placeholder.jpg"}
                alt={character.name}
                className={`character-card-image w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Video on hover */}
            <video
                ref={videoRef}
                src={character.videoSrc}
                className={`character-card-video absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                muted
                loop
                playsInline
            />

            {/* Top-left corner: Trait badges */}
            <div className="absolute top-2 left-2 flex space-x-1">
                {traitBadges.map((trait) => (
                    <motion.div
                        key={trait.id}
                        className={`w-3 h-3 rounded-full ${trait.isSelected ? 'ring-2 ring-white' : ''}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                            backgroundColor: trait.isSelected ? '#7047ff' : '#717171',
                            opacity: trait.isSelected ? 1 : 0.7
                        }}
                    />
                ))}
            </div>

            {/* Top-right corner: New badge */}
            {character.isNew && (
                <div className="absolute top-2 right-2">
                    <motion.div
                        className="bg-secondary-500 text-white text-xxs font-bold px-2 py-0.5 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 15
                        }}
                    >
                        NEW
                    </motion.div>
                </div>
            )}

            {/* Bottom content with gradient overlay */}
            <div className="card-content-overlay">
                <h3 className="text-white text-lg font-bold">{character.name}</h3>
                <p className="text-white text-sm">{character.description}</p>

                {/* Dialogue snippet that changes */}
                <motion.div
                    key={dialogueIndex}
                    className="mt-2 text-xs text-gray-200 italic h-8 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    "{character.sampleDialogue?.[dialogueIndex] || ''}"
                </motion.div>

                {/* Popularity indicator */}
                <div className="mt-2 flex items-center">
                    <FaStar className="text-yellow-400 mr-1" size={12} />
                    <span className="text-xs text-white">
            {character.popularity} ({Math.round(character.popularity * 1000)} ratings)
          </span>
                </div>
            </div>
        </motion.div>
    );
};

export default CharacterCard;
