// Set dimensions and margins
const width = 600;
const height = 600;
const margin = { top: 30, right: 120, bottom: 30, left: 120 };

// Create SVG container
const svg = d3.select("#vis-treemap")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add title
svg.append("text")
    .attr("x", (width - margin.left - margin.right) / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("My Skill and Ability Tree");

// Hierarchical data (16 attributes)
const treeData = {
    name: "Mabel Wong Mei Po",
    children: [
        {
            name: "Personal Qualities",
            children: [
                { name: "Wisdom", score: 7 },
                { name: "Luck", score: 7 },
                { name: "Patience", score: 6.5 },
                { name: "Health", score: 7 },
                { name: "Resilience", score: 6.5 },
                { name: "Confidence", score: 6.5 },
                { name: "Curiosity", score: 7 },
                { name: "Mindful.", score: 5.5 }
            ]
        },
        {
            name: "Social Skills",
            children: [
                { name: "Empathy", score: 6 },
                { name: "Comm.", score: 7 },
                { name: "Social", score: 6 }
            ]
        },
        {
            name: "Professional Skills",
            children: [
                { name: "Creativity", score: 5 },
                { name: "Discipline", score: 8.5 },
                { name: "Adapt.", score: 8 },
                { name: "Time Mgmt", score: 7.5 },
                { name: "Focus", score: 6.5 }
            ]
        }
    ]
};

// Create hierarchy
const root = d3.hierarchy(treeData)
    .sort((a, b) => d3.descending(a.data.score, b.data.score)); // Sort by score for ranking

root.each(d => {
    d._children = d.children; // Store children for collapsing
});

// Initialize tree layout
const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

// Color scale for categories
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Update function for collapsible tree
function update(source) {
    const duration = 750;
    const treeNodes = treeLayout(root).descendants();
    const treeLinks = treeLayout(root).links();

    // Normalize node positions
    treeNodes.forEach(d => { d.y = d.depth * 180; });

    // Update nodes
    const node = svg.selectAll(".node")
        .data(treeNodes, d => d.id || (d.id = ++i));

    const nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${source.y0 || 0},${source.x0 || 0})`)
        .on("click", (event, d) => {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        });

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", d => d.data.score ? colorScale(d.data.score / 10) : colorScale(d.depth))
        .style("stroke", "#fff");

    nodeEnter.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children || d._children ? -13 : 13)
        .attr("text-anchor", d => d.children || d._children ? "end" : "start")
        .style("font-size", "8px")
        .style("fill", "black")
        .text(d => `${d.data.name}${d.data.score ? ` (${d.data.score})` : ""}`);

    // Tooltip
    const tooltip = d3.select("body").selectAll(".tooltip").data([0])
        .enter().append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "lightgray")
        .style("padding", "5px")
        .style("border-radius", "5px");

    nodeEnter.on("mouseover", (event, d) => {
        tooltip.style("opacity", 1)
            .html(`${d.data.name}${d.data.score ? `: Score ${d.data.score}/10` : ""}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", () => {
        tooltip.style("opacity", 0);
    });

    // Update node positions
    const nodeUpdate = node.merge(nodeEnter)
        .transition()
        .duration(duration)
        .attr("transform", d => `translate(${d.y},${d.x})`);

    nodeUpdate.select("circle")
        .attr("r", d => d.data.score ? 5 + (d.data.score - 5) : 5) // Size by score
        .style("fill", d => d.data.score ? colorScale(d.data.score / 10) : colorScale(d.depth));

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Remove exiting nodes
    const nodeExit = node.exit()
        .transition()
        .duration(duration)
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .remove();

    nodeExit.select("circle").attr("r", 1e-6);
    nodeExit.select("text").style("fill-opacity", 1e-6);

    // Update links
    const link = svg.selectAll(".link")
        .data(treeLinks, d => d.target.id);

    const linkEnter = link.enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x))
        .style("fill", "none")
        .style("stroke", "#ccc")
        .style("stroke-width", "2px");

    link.merge(linkEnter)
        .transition()
        .duration(duration)
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    link.exit()
        .transition()
        .duration(duration)
        .attr("d", d3.linkHorizontal()
            .x(d => source.y)
            .y(d => source.x))
        .remove();

    // Store old positions for transition
    treeNodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Initialize counter for node IDs
let i = 0;

// Initialize the tree
root.x0 = height / 2;
root.y0 = 0;
update(root);