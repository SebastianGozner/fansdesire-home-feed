import { useState, useEffect, useMemo } from 'react';

const useConstellationData = (initialData) => {
    const [constellationData, setConstellationData] = useState(initialData);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [activeCharacters, setActiveCharacters] = useState(initialData?.characters || []);

    // Function to handle node selection from constellation
    const handleNodeSelect = (nodes) => {
        setSelectedNodes(nodes);
    };

    // Calculate character relevance scores based on selected nodes
    useEffect(() => {
        if (!constellationData || !constellationData.characters) return;

        if (selectedNodes.length === 0) {
            // When no nodes are selected, show all characters
            setActiveCharacters(constellationData.characters.map(char => ({
                ...char,
                relevance: 1
            })));
            return;
        }

        // Calculate relevance score for each character
        const charactersWithRelevance = constellationData.characters.map(character => {
            // For each selected node, check if the character has the trait
            const matchCount = selectedNodes.reduce((count, node) => {
                // Check if character has this trait
                if (character.traits.includes(node.id)) {
                    return count + 1;
                }
                return count;
            }, 0);

            // Calculate relevance score (0-1)
            const relevance = selectedNodes.length > 0 ? matchCount / selectedNodes.length : 0;

            return {
                ...character,
                relevance
            };
        });

        // Sort by relevance (most relevant first)
        const sortedCharacters = [...charactersWithRelevance].sort((a, b) => b.relevance - a.relevance);

        setActiveCharacters(sortedCharacters);
    }, [constellationData, selectedNodes]);

    // Function to load data (could be extended to fetch from API)
    const loadData = (data) => {
        setConstellationData(data);
    };

    // Prepare connection lines between characters and nodes
    const characterNodeConnections = useMemo(() => {
        if (!activeCharacters || !selectedNodes.length) return [];

        const connections = [];

        activeCharacters.forEach(character => {
            selectedNodes.forEach(node => {
                if (character.traits.includes(node.id)) {
                    connections.push({
                        characterId: character.id,
                        nodeId: node.id,
                        strength: character.relevance
                    });
                }
            });
        });

        return connections;
    }, [activeCharacters, selectedNodes]);

    return {
        constellationData,
        selectedNodes,
        activeCharacters,
        handleNodeSelect,
        loadData,
        characterNodeConnections
    };
};

export default useConstellationData;
