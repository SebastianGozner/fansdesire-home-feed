import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { FaGamepad, FaBrain, FaHeart, FaCrown, FaStar } from 'react-icons/fa';

const ConstellationMap = ({ data, onNodeSelect }) => {
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Map of category IDs to their appropriate icons
    const categoryIcons = {
        'playful': <FaGamepad size={14} />,
        'intellectual': <FaBrain size={14} />,
        'sensual': <FaHeart size={14} />,
        'dominant': <FaCrown size={14} />,
        'romantic': <FaStar size={14} />
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (svgRef.current) {
                setDimensions({
                    width: svgRef.current.clientWidth,
                    height: svgRef.current.clientHeight
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize D3 force simulation
    useEffect(() => {
        if (!data || !data.nodes || !data.links || dimensions.width === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Create force simulation
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
            .force("collide", d3.forceCollide().radius(d => d.size + 10).iterations(2));

        // Create links
        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("class", "node-link")
            .attr("stroke", d => d.color || "#555")
            .attr("stroke-width", d => Math.sqrt(d.value))
            .attr("stroke-opacity", 0.6);

        // Create node groups
        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(data.nodes)
            .enter()
            .append("g")
            .attr("class", "node-group")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Add circles to nodes
        node.append("circle")
            .attr("r", d => d.size)
            .attr("fill", d => d.color)
            .attr("class", "node-primary")
            .attr("cursor", "pointer")
            .attr("stroke", "#fff")
            .attr("stroke-width", d => selectedNodes.some(n => n.id === d.id) ? 3 : 0)
            .attr("stroke-opacity", 0.7)
            .on("click", (event, d) => {
                event.stopPropagation(); // Prevent event bubbling
                // Set as active category and open details panel
                setActiveCategory(d);
                setIsDetailsOpen(true);
            });

        // Add icon foreign objects to nodes
        node.append("foreignObject")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", d => -10)
            .attr("y", d => -10)
            .attr("pointer-events", "none") // Pass events to circle underneath
            .html(d => {
                const iconColor = "#ffffff";
                let iconSvg;

                switch(d.id) {
                    case 'playful':
                        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="${iconColor}"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm349.5 52.4c18.7-4.4 35.9 12 25.5 28.1C350.4 374.6 306.3 400 255.9 400s-94.5-25.4-119.1-63.5c-10.4-16.1 6.8-32.5 25.5-28.1c28.9 6.8 60.5 10.5 93.6 10.5s64.7-3.7 93.6-10.5zM215.3 152c0 8.8-7.2 16-16 16s-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16zm61.5 16c-8.8 0-16-7.2-16-16s7.2-16 16-16s16 7.2 16 16s-7.2 16-16 16z"/></svg>`;
                        break;
                    case 'intellectual':
                        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="${iconColor}"><path d="M184 0c30.9 0 56 25.1 56 56V456c0 30.9-25.1 56-56 56c-28.9 0-52.6-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-0.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3.1 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56V56c0-30.9 25.1-56 56-56zM184 80c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V96c0-8.8-7.2-16-16-16zm144 0c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V96c0-8.8-7.2-16-16-16zM184 224c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V240c0-8.8-7.2-16-16-16zm144 0c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V240c0-8.8-7.2-16-16-16zM184 368c-8.8 0-16 7.2-16 16s7.2 16 16 16s16-7.2 16-16s-7.2-16-16-16zm144 0c-8.8 0-16 7.2-16 16s7.2 16 16 16s16-7.2 16-16s-7.2-16-16-16z"/></svg>`;
                        break;
                    case 'sensual':
                        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="${iconColor}"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;
                        break;
                    case 'dominant':
                        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512" fill="${iconColor}"><path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"/></svg>`;
                        break;
                    case 'romantic':
                        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512" fill="${iconColor}"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
                        break;
                    default:
                        iconSvg = '';
                }

                return `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">${iconSvg}</div>`;
            });

        // Add labels to nodes
        node.append("text")
            .text(d => d.name)
            .attr("x", 0)
            .attr("y", d => -d.size - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "#fff")
            .attr("pointer-events", "none");

        // Animation function
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });

        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        // Click outside to close details panel
        svg.on("click", () => {
            setIsDetailsOpen(false);
            setActiveCategory(null);
        });

        return () => {
            simulation.stop();
        };
    }, [data, dimensions, selectedNodes]);

    // Handle node selection
    const handleNodeSelect = (node) => {
        const isSelected = selectedNodes.some(n => n.id === node.id);

        if (isSelected) {
            const newSelectedNodes = selectedNodes.filter(n => n.id !== node.id);
            setSelectedNodes(newSelectedNodes);
            onNodeSelect(newSelectedNodes);
        } else {
            const newSelectedNodes = [...selectedNodes, node];
            setSelectedNodes(newSelectedNodes);
            onNodeSelect(newSelectedNodes);
        }
    };

    // Handle selecting a subcategory
    const handleSubcategorySelect = (subcategory) => {
        // Create a full node with parent info
        const nodeWithParent = {
            id: subcategory.id,
            name: subcategory.name,
            color: subcategory.color,
            primaryNode: activeCategory.id
        };

        handleNodeSelect(nodeWithParent);
    };

    return (
        <div className="constellation-container w-full h-full rounded-lg overflow-hidden relative">
            {/* Click to explore instruction */}
            {!isDetailsOpen && (
                <div className="absolute top-2 left-0 right-0 mx-auto w-64 bg-dark-700 bg-opacity-80 rounded-lg p-2 z-10 text-center">
                    <p className="text-white text-xs">Click on traits to explore sub-traits</p>
                </div>
            )}

            <svg ref={svgRef} width="100%" height="100%" className="constellation-svg">
                {/* D3 will render the main visualization here */}
            </svg>

            {/* Subcategory Details Panel - Slide in from right */}
            <AnimatePresence>
                {isDetailsOpen && activeCategory && (
                    <motion.div
                        className="absolute top-0 right-0 bottom-0 w-64 bg-dark-8e00 shadow-lg z-20 overflow-auto"
                        initial={{ x: 300 }}
                        animate={{ x: 0 }}
                        exit={{ x: 300 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        {/* Header */}
                        <div
                            className="p-4 border-b border-dark-600 sticky top-0 bg-dark-700 z-10"
                            style={{
                                background: `linear-gradient(to right, ${activeCategory.color}22, ${activeCategory.color}44)`
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className="w-4 h-4 rounded-full mr-2"
                                        style={{ backgroundColor: activeCategory.color }}
                                    />
                                    <h3 className="text-white font-bold">{activeCategory.name}</h3>
                                </div>
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDetailsOpen(false);
                                        setActiveCategory(null);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                            <p className="text-gray-300 text-xs mt-1">{activeCategory.description}</p>

                            {/* Add to Selection button */}
                            <motion.button
                                className="mt-3 w-full py-1 px-3 rounded text-xs font-medium"
                                style={{
                                    backgroundColor: activeCategory.color,
                                    color: '#fff'
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNodeSelect(activeCategory);
                                }}
                            >
                                {selectedNodes.some(n => n.id === activeCategory.id)
                                    ? 'Remove from Selection'
                                    : 'Add to Selection'}
                            </motion.button>
                        </div>

                        {/* Subcategories */}
                        <div className="p-4">
                            <h4 className="text-gray-400 text-xs uppercase mb-3">Sub-traits</h4>

                            <div className="space-y-2">
                                {activeCategory.secondary?.map((subcategory) => (
                                    <motion.div
                                        key={subcategory.id}
                                        className="flex items-center p-2 rounded-lg cursor-pointer"
                                        style={{
                                            backgroundColor: selectedNodes.some(n => n.id === subcategory.id)
                                                ? `${subcategory.color}33`
                                                : 'transparent',
                                            border: selectedNodes.some(n => n.id === subcategory.id)
                                                ? `1px solid ${subcategory.color}`
                                                : '1px solid transparent'
                                        }}
                                        whileHover={{
                                            backgroundColor: `${subcategory.color}22`,
                                            transition: { duration: 0.2 }
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSubcategorySelect(subcategory);
                                        }}
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: subcategory.color }}
                                        />
                                        <span className="text-white text-sm">{subcategory.name}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Legend for selected nodes */}
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-2 max-w-full p-2">
                {selectedNodes.map((node) => (
                    <motion.div
                        key={node.id}
                        className="bg-dark-700 rounded-full px-3 py-1 text-xs flex items-center gap-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: node.color || '#7047ff' }}
                        />
                        <span>{node.name}</span>
                        <button
                            className="ml-1 text-gray-400 hover:text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNodeSelect(node);
                            }}
                        >
                            ×
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ConstellationMap;
