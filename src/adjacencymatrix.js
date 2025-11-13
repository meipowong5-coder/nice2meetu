(function () {
    // Set dimensions
    const width = 600;
    const height = 600;
    const margin = { top: 120, right: 60, bottom: 20, left: 140 }; // Increased left margin to 140
    const cellSize = 20; // 20x20 grid (20 * 20 = 400px)

    // Data
    const nodes = [
        { id: "Black and White drawing", software: "Procreate", details: "Black and white artwork" },
        { id: "Animate characters drawings", software: "Procreate", details: "Animated character illustrations" },
        { id: "Sketches", software: "Procreate", details: "Practice sketches" },
        { id: "Original characters", software: "Procreate", details: "Unique character designs" },
        { id: "Universe x Rhythm Survival game", software: "Processing", details: "Universe x Rhythm Survival game" },
        { id: "Simple video jigsaw puzzle", software: "Processing", details: "Simple video jigsaw puzzle" },
        { id: "Image Processing Algorithms", software: "Processing", details: "Edges highlighted effect using Convolution Kernels, Pokemon card effect using 3D pixels, splitting effect using RGB values, gothic stained glass windows using Mosaic concept" },
        { id: "Edge Highlight Effect", software: "Processing", details: "Edges highlighted using Convolution Kernels" },
        { id: "Pokemon Card Effect", software: "Processing", details: "Pokemon card effect using 3D pixels" },
        { id: "RGB Split & Mosaic Effect", software: "Processing", details: "Splitting effect using RGB values, gothic stained glass windows using Mosaic concept" },
        { id: "AlchemAR", software: "Processing", details: "An interactive AR platform where users can engage with chemical elements to form compounds through virtual reactions." },
        { id: "Barrier Grid Animation on Meme Cat", software: "Processing", details: "Barrier grid animation on meme cat" },
        { id: "Mood expressor", software: "Arduino", details: "System for individuals unable to express facial emotions" },
        { id: "Rhythm trainer", software: "Arduino", details: "Rhythm trainer" },
        { id: "Bad mood convertor", software: "Arduino", details: "Bad mood convertor" },
        { id: "Collage of HatsukiYura's Album Cover", software: "TouchDesigner", details: "Collage of HatsukiYura's album cover" },
        { id: "Animated Composition (Barbara Kruger Style)", software: "TouchDesigner", details: "Animated composition referencing Barbara Kruger’s text and image works. Randomize image and text selections." },
        { id: "Visual-Text Generator", software: "TouchDesigner", details: "Generative visual-text responding to music in a rhythmic way" },
        { id: "Animated Alphabets (Jeffrey Gibson Style)", software: "TouchDesigner", details: "Invented typographic visual style referencing American artist Jeffrey Gibson" },
        { id: "Sonify a Drawing", software: "TouchDesigner", details: "Take an image of a drawing as a 'score' and create a network/system/process to turn the drawing into sound" }
    ];

    // Create links
    const links = [
        // Procreate links (pairwise among 4 nodes)
        { source: "Black and White drawing", target: "Animate characters drawings" },
        { source: "Black and White drawing", target: "Sketches" },
        { source: "Black and White drawing", target: "Original characters" },
        { source: "Animate characters drawings", target: "Sketches" },
        { source: "Animate characters drawings", target: "Original characters" },
        { source: "Sketches", target: "Original characters" },
        // Processing links
        { source: "Universe x Rhythm Survival game", target: "Simple video jigsaw puzzle" },
        { source: "Universe x Rhythm Survival game", target: "Image Processing Algorithms" },
        { source: "Universe x Rhythm Survival game", target: "AlchemAR" },
        { source: "Universe x Rhythm Survival game", target: "Barrier Grid Animation on Meme Cat" },
        { source: "Simple video jigsaw puzzle", target: "Image Processing Algorithms" },
        { source: "AlchemAR", target: "Image Processing Algorithms" },
        { source: "Barrier Grid Animation on Meme Cat", target: "Image Processing Algorithms" },
        { source: "Image Processing Algorithms", target: "Edge Highlight Effect" },
        { source: "Image Processing Algorithms", target: "Pokemon Card Effect" },
        { source: "Image Processing Algorithms", target: "RGB Split & Mosaic Effect" },
        // Arduino links
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

    // Create adjacency matrix
    const n = nodes.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    links.forEach(link => {
        const i = nodes.findIndex(node => node.id === link.source);
        const j = nodes.findIndex(node => node.id === link.target);
        matrix[i][j] = 1;
        matrix[j][i] = 1; // Undirected graph
    });

    // Create SVG container
    const svg = d3.select("#vis-adjacencymatrix")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add title
    svg.append("text")
        .attr("x", (width - margin.left - margin.right) / 2)
        .attr("y", -margin.top + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Artworks Adjacency Matrix by Software");

    // Scales
    const x = d3.scaleBand()
        .domain(d3.range(n))
        .range([0, cellSize * n]);
    const y = d3.scaleBand()
        .domain(d3.range(n))
        .range([0, cellSize * n]);

    // Add cells
    const cell = svg.append("g")
        .selectAll("rect")
        .data(matrix.flatMap((row, i) => row.map((value, j) => ({ i, j, value }))))
        .enter()
        .append("rect")
        .attr("x", d => x(d.j))
        .attr("y", d => y(d.i))
        .attr("width", cellSize)
        .attr("height", cellSize)
        .style("fill", d => {
            if (d.value === 1) {
                const sourceSoftware = nodes[d.i].software;
                const softwareIndex = ["Procreate", "Processing", "Arduino", "TouchDesigner"].indexOf(sourceSoftware);
                return d3.schemeCategory10[softwareIndex >= 0 ? softwareIndex : 0];
            }
            return "white";
        })
        .style("stroke", "#ccc")
        .style("stroke-width", 0.5);

    // Add row labels
    svg.append("g")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", -5)
        .attr("y", (d, i) => y(i) + cellSize / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(d => {
            if (d.id === "Animated Composition (Barbara Kruger Style)") return "Animated Composition";
            if (d.id === "Animated Alphabets (Jeffrey Gibson Style)") return "Animated Alphabets";
            if (d.id === "Collage of HatsukiYura's Album Cover") return "HatsukiYura Collage";
            if (d.id === "Image Processing Algorithms") return "Image Proc. Algorithms";
            return d.id;
        })
        .style("font-size", "8px")
        .style("fill", "black");

    // Add column labels
    svg.append("g")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", (d, i) => x(i) + cellSize / 2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .text(d => {
            if (d.id === "Animated Composition (Barbara Kruger Style)") return "Animated Composition";
            if (d.id === "Animated Alphabets (Jeffrey Gibson Style)") return "Animated Alphabets";
            if (d.id === "Collage of HatsukiYura's Album Cover") return "HatsukiYura Collage";
            if (d.id === "Image Processing Algorithms") return "Image Proc. Algorithms";
            return d.id;
        })
        .style("font-size", "8px")
        .style("fill", "black")
        .attr("transform", (d, i) => `rotate(-45, ${x(i) + cellSize / 2}, -15)`);

    // Tooltip
    const tooltip = d3.select("body").select(".tooltip").empty()
        ? d3.select("body").append("div").attr("class", "tooltip")
        : d3.select("body").select(".tooltip");

    cell.on("mouseover", (event, d) => {
        if (d.value === 1) {
            const source = nodes[d.i];
            const target = nodes[d.j];
            tooltip.style("opacity", 1)
                .html(`${source.id} ↔ ${target.id}<br>Source Software: ${source.software}${source.details ? `<br>${source.details}` : ""}<br>Target Software: ${target.software}${target.details ? `<br>${target.details}` : ""}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        }
    })
    .on("mouseout", () => {
        tooltip.style("opacity", 0);
    });
})();