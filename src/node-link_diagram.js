(function () {
    // Set dimensions
    const width = 600;
    const height = 600;

    // Data with generated dates
    const nodes = [
        { id: "Black and White drawing", software: "Procreate", details: "Black and white artwork", date: new Date(2020, 0, 1) },
        { id: "Animate characters drawings", software: "Procreate", details: "Animated character illustrations", date: new Date(2020, 2, 1) },
        { id: "Sketches", software: "Procreate", details: "Practice sketches", date: new Date(2020, 4, 1) },
        { id: "Original characters", software: "Procreate", details: "Unique character designs", date: new Date(2020, 6, 1) },
        { id: "Universe x Rhythm Survival game", software: "Processing", details: "Universe x Rhythm Survival game", date: new Date(2021, 0, 1) },
        { id: "Simple video jigsaw puzzle", software: "Processing", details: "Simple video jigsaw puzzle", date: new Date(2021, 2, 1) },
        { id: "Image Processing Algorithms", software: "Processing", details: "Edges highlighted effect using Convolution Kernels, Pokemon card effect using 3D pixels, splitting effect using RGB values, gothic stained glass windows using Mosaic concept", date: new Date(2021, 4, 1) },
        { id: "Edge Highlight Effect", software: "Processing", details: "Edges highlighted using Convolution Kernels", date: new Date(2021, 6, 1) },
        { id: "Pokemon Card Effect", software: "Processing", details: "Pokemon card effect using 3D pixels", date: new Date(2021, 8, 1) },
        { id: "RGB Split & Mosaic Effect", software: "Processing", details: "Splitting effect using RGB values, gothic stained glass windows using Mosaic concept", date: new Date(2021, 10, 1) },
        { id: "AlchemAR", software: "Processing", details: "An interactive AR platform where users can engage with chemical elements to form compounds through virtual reactions.", date: new Date(2022, 0, 1) },
        { id: "Barrier Grid Animation on Meme Cat", software: "Processing", details: "Barrier grid animation on meme cat", date: new Date(2022, 2, 1) },
        { id: "Mood expressor", software: "Arduino", details: "System for individuals unable to express facial emotions", date: new Date(2023, 0, 1) },
        { id: "Rhythm trainer", software: "Arduino", details: "Rhythm trainer", date: new Date(2023, 2, 1) },
        { id: "Bad mood convertor", software: "Arduino", details: "Bad mood convertor", date: new Date(2023, 4, 1) },
        { id: "Collage of HatsukiYura's Album Cover", software: "TouchDesigner", details: "Collage of HatsukiYura's album cover", date: new Date(2024, 0, 1) },
        { id: "Animated Composition (Barbara Kruger Style)", software: "TouchDesigner", details: "Animated composition referencing Barbara Kruger’s text and image works. Randomize image and text selections.", date: new Date(2024, 2, 1) },
        { id: "Visual-Text Generator", software: "TouchDesigner", details: "Generative visual-text responding to music in a rhythmic way", date: new Date(2024, 4, 1) },
        { id: "Animated Alphabets (Jeffrey Gibson Style)", software: "TouchDesigner", details: "Invented typographic visual style referencing American artist Jeffrey Gibson", date: new Date(2024, 6, 1) },
        { id: "Sonify a Drawing", software: "TouchDesigner", details: "Take an image of a drawing as a 'score' and create a network/system/process to turn the drawing into sound", date: new Date(2024, 8, 1) }
    ];

    // Create links for artworks sharing the same software
    const links = [
        // Procreate links (pairwise among 4 nodes)
        { source: "Black and White drawing", target: "Animate characters drawings" },
        { source: "Black and White drawing", target: "Sketches" },
        { source: "Black and White drawing", target: "Original characters" },
        { source: "Animate characters drawings", target: "Sketches" },
        { source: "Animate characters drawings", target: "Original characters" },
        { source: "Sketches", target: "Original characters" },
        // Processing links (Universe, Jigsaw, Image Processing Algorithms; Image Processing Algorithms to 3 algorithms; new links for Barrier Grid and AlchemAR)
        { source: "Universe x Rhythm Survival game", target: "Simple video jigsaw puzzle" },
        { source: "Universe x Rhythm Survival game", target: "Image Processing Algorithms" },
        { source: "Universe x Rhythm Survival game", target: "AlchemAR" },
        { source: "Universe x Rhythm Survival game", target: "Barrier Grid Animation on Meme Cat" }, // New link
        { source: "Simple video jigsaw puzzle", target: "Image Processing Algorithms" },
        { source: "AlchemAR", target: "Image Processing Algorithms" },
        { source: "Barrier Grid Animation on Meme Cat", target: "Image Processing Algorithms" }, // New link
        { source: "Image Processing Algorithms", target: "Edge Highlight Effect" },
        { source: "Image Processing Algorithms", target: "Pokemon Card Effect" },
        { source: "Image Processing Algorithms", target: "RGB Split & Mosaic Effect" },
        // Arduino links (pairwise among 3 nodes)
        { source: "Mood expressor", target: "Rhythm trainer" },
        { source: "Mood expressor", target: "Bad mood convertor" },
        { source: "Rhythm trainer", target: "Bad mood convertor" },
        // TouchDesigner links (pairwise among 5 nodes)
        { source: "Collage of HatsukiYura's Album Cover", target: "Animated Composition (Barbara Kruger Style)" },
        { source: "Collage of HatsukiYura's Album Cover", target: "Visual-Text Generator" },
        { source: "Collage of HatsukiYura's Album Cover", target: "Animated Alphabets (Jeffrey Gibson Style)" },
        { source: "Collage of HatsukiYura's Album Cover", target: "Sonify a Drawing" },
        { source: "Animated Composition (Barbara Kruger Style)", target: "Visual-Text Generator" },
        { source: "Animated Composition (Barbara Kruger Style)", target: "Animated Alphabets (Jeffrey Gibson Style)" },
        { source: "Animated Composition (Barbara Kruger Style)", target: "Sonify a Drawing" },
        { source: "Visual-Text Generator", target: "Animated Alphabets (Jeffrey Gibson Style)" },
        { source: "Visual-Text Generator", target: "Sonify a Drawing" },
        { source: "Animated Alphabets (Jeffrey Gibson Style)", target: "Sonify a Drawing" }
    ];

    // Container
    const container = d3.select("#vis-node-link_diagram");

    // Create SVG container
    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .append("g")
        .attr("transform", "translate(0,30)");

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Artworks Network by Software");

    // Force simulation with adjusted parameters for closer clustering and quadrant positioning
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(120).strength(0.3)) // Increased distance for spread out nodes
        .force("charge", d3.forceManyBody().strength(-300)) // Increased repulsion for more space
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(35)) // Increased radius to prevent overlap
        .force("x", d3.forceX().x(d => {
            switch (d.software) {
                case "Procreate": return width / 4; // Top left
                case "Processing": return 3 * width / 4; // Top right
                case "Arduino": return width / 4; // Bottom left
                case "TouchDesigner": return 3 * width / 4; // Bottom right
                default: return width / 2;
            }
        }).strength(0.3)) // Increased strength for positioning
        .force("y", d3.forceY().y(d => {
            switch (d.software) {
                case "Procreate": return height / 4; // Top left
                case "Processing": return height / 4; // Top right
                case "Arduino": return height / 2 + height / 8; // Bottom left, moved up
                case "TouchDesigner": return height / 2 + height / 8; // Bottom right, moved up
                default: return height / 2;
            }
        }).strength(0.3)); // Increased strength for positioning

    // Tooltip
    const tooltip = d3.select("body").select(".tooltip").empty()
        ? d3.select("body").append("div").attr("class", "tooltip")
        : d3.select("body").select(".tooltip");

    // Calculate min and max dates
    const minDate = d3.min(nodes, d => d.date);
    const maxDate = d3.max(nodes, d => d.date);
    const minTime = minDate.getTime();
    const maxTime = maxDate.getTime();

    // Add slider
    container.append("label").text("Select Date: ");
    const dateLabel = container.append("span").attr("id", "date-label").style("margin-left", "10px");
    const slider = container.append("input")
        .attr("type", "range")
        .attr("min", minTime)
        .attr("max", maxTime)
        .attr("step", 86400000) // One day
        .attr("value", maxTime)
        .on("input", function() {
            const selectedTime = +this.value;
            const selectedDate = new Date(selectedTime);
            dateLabel.text(selectedDate.toDateString());
            updateGraph(selectedDate);
        });

    // Initial date label
    dateLabel.text(maxDate.toDateString());

    // Update function
    function updateGraph(selectedDate) {
        const filteredNodes = nodes.filter(d => d.date <= selectedDate);
        const filteredNodeIds = new Set(filteredNodes.map(d => d.id));
        const filteredLinks = links.filter(l => filteredNodeIds.has(l.source.id || l.source) && filteredNodeIds.has(l.target.id || l.target));

        // Update links
        const linkUpdate = svg.selectAll("line")
            .data(filteredLinks, d => `${(d.source.id || d.source)}-${(d.target.id || d.target)}`);

        linkUpdate.enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-opacity", 0.8)
            .style("stroke-width", 1.5);

        linkUpdate.exit().remove();

        // Update nodes
        const nodeUpdate = svg.selectAll("g.node")
            .data(filteredNodes, d => d.id);

        const nodeEnter = nodeUpdate.enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        nodeEnter.append("circle")
            .attr("r", 10)
            .style("fill", d => {
                const softwareIndex = ["Procreate", "Processing", "Arduino", "TouchDesigner"].indexOf(d.software);
                return d3.schemeCategory10[softwareIndex >= 0 ? softwareIndex : 0];
            })
            .style("stroke", "#fff")
            .style("stroke-width", 1.5);

        nodeEnter.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(d => d.id)
            .style("font-size", "10px")
            .style("fill", "black");

        nodeUpdate.exit().remove();

        // Add mouse events to all nodes (enter + update)
        nodeUpdate.merge(nodeEnter)
            .on("mouseover", (event, d) => {
                tooltip.style("opacity", 1)
                    .html(`${d.id}<br>Software: ${d.software}${d.details ? `<br>${d.details}` : ""}<br>Date: ${d.date.toDateString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Update software labels
        const softwares = Array.from(new Set(filteredNodes.map(d => d.software)));
        const labelUpdate = svg.selectAll("text.label")
            .data(softwares, d => d);

        labelUpdate.enter()
            .append("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "black")
            .style("font-weight", "bold")
            .text(d => d);

        labelUpdate.exit().remove();

        // Update simulation
        simulation.nodes(filteredNodes);
        simulation.force("link").links(filteredLinks);
        simulation.alpha(1).restart();
    }

    // Tick handler
    simulation.on("tick", () => {
        svg.selectAll("line")
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        svg.selectAll("g.node")
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        // Update software labels at centroids
        svg.selectAll("text.label").each(function (software) {
            const relatedNodes = simulation.nodes().filter(d => d.software === software);
            if (relatedNodes.length > 0) {
                const centroidX = d3.mean(relatedNodes, d => d.x) || width / 2;
                const centroidY = d3.mean(relatedNodes, d => d.y) || height / 2;
                d3.select(this)
                    .attr("x", centroidX)
                    .attr("y", centroidY - 30); // Increased offset above the cluster
            }
        });
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

    // Initial update
    updateGraph(maxDate);
})();