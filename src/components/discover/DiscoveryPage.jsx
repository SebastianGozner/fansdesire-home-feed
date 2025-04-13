import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConstellationMap from './ConstellationMap';
import CharacterCard from './CharacterCard';
import useConstellationData from './useConstellationData';
import dummyData from './dummyData.json';

const DiscoveryPage = () => {
    const [isMapMinimized, setIsMapMinimized] = useState(false);
    const [hoveredCharacter, setHoveredCharacter] = useState(null);
    const mapContainerRef = useRef(null);

    // Initialize with dummy data
    const {
        constellationData,
        selectedNodes,
        activeCharacters,
        handleNodeSelect,
        characterNodeConnections
    } = useConstellationData(dummyData);

    // Scroll handler to minimize map
    const handleScroll = () => {
        if (!mapContainerRef.current) return;

        const scrollY = window.scrollY;
        const mapHeight = mapContainerRef.current.offsetHeight;

        // Start minimizing when scrolled past 1/3 of the map
        if (scrollY > mapHeight / 3) {
            setIsMapMinimized(true);
        } else {
            setIsMapMinimized(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Character card interaction handlers
    const handleCardHover = (character) => {
        setHoveredCharacter(character);
    };

    const handleCardLeave = () => {
        setHoveredCharacter(null);
    };

    // Group characters for grid layout
    const characterRows = [];
    for (let i = 0; i < activeCharacters.length; i += 3) {
        characterRows.push(activeCharacters.slice(i, i + 3));
    }

    return (
        <div className="discovery-page min-h-screen bg-dark-900 text-white">
            <div
                ref={mapContainerRef}
                className={`constellation-section transition-all duration-500 ease-in-out relative ${
                    isMapMinimized ? 'h-20 sticky top-0 z-10 bg-dark-800 shadow-md' : 'h-96'
                }`}
            >
                <div className="container mx-auto px-4 h-full relative">
                    {/* Toggle button */}
                    <motion.button
                        className="absolute right-6 top-4 bg-dark-700 hover:bg-dark-600 rounded-full p-2 z-30"
                        onClick={() => setIsMapMinimized(!isMapMinimized)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isMapMinimized ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"}
                            />
                        </svg>
                    </motion.button>

                    {/* Full constellation map */}
                    <AnimatePresence>
                        {!isMapMinimized && (
                            <motion.div
                                className="w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ConstellationMap
                                    data={constellationData}
                                    onNodeSelect={handleNodeSelect}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Minimized constellation summary */}
                    <AnimatePresence>
                        {isMapMinimized && (
                            <motion.div
                                className="flex items-center h-full px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="text-sm mr-4">Selected traits:</div>
                                {selectedNodes.length === 0 ? (
                                    <div className="text-gray-400 text-sm">None - showing all characters</div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedNodes.map((node) => (
                                            <div
                                                key={node.id}
                                                className="bg-dark-700 rounded-full px-3 py-1 text-xs flex items-center gap-1"
                                            >
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: node.color || '#7047ff' }}
                                                />
                                                <span>{node.name}</span>
                                                <button
                                                    className="ml-1 text-gray-400 hover:text-white"
                                                    onClick={() => handleNodeSelect(node)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Character Grid */}
            <div className="container mx-auto px-4 py-8">
                {/* Character filter header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-lg font-medium">
                        {selectedNodes.length === 0
                            ? "All Characters"
                            : `Characters (${activeCharacters.length})`}
                    </div>

                    {selectedNodes.length > 0 && (
                        <motion.button
                            className="text-sm text-gray-400 hover:text-white flex items-center"
                            onClick={() => handleNodeSelect([])}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear filters
                        </motion.button>
                    )}
                </div>

                {/* If no matching characters */}
                {activeCharacters.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-xl text-gray-400">No matching characters found</div>
                        <motion.button
                            className="mt-4 px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-full text-white"
                            onClick={() => handleNodeSelect([])}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Reset filters
                        </motion.button>
                    </div>
                )}

                {/* Character grid layout */}
                <div className="mt-8">
                    {characterRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex flex-wrap justify-center gap-6 mb-8">
                            {row.map((character) => (
                                <CharacterCard
                                    key={character.id}
                                    character={character}
                                    selectedNodes={selectedNodes}
                                    onCardHover={handleCardHover}
                                    onCardLeave={handleCardLeave}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiscoveryPage;
