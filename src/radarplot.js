(function () {
// Set dimensions and margins
const width = 600; // Increased from 600
const height = 600; // Increased from 600
const radius = Math.min(width, height) / 2 - 80;

    // Data with 15 attributes
    const data = [
        { attribute: "Wisdom", value: 7 },
        { attribute: "Luck", value: 7 },
        { attribute: "Patience", value: 6.5 },
        { attribute: "Health", value: 7 },
        { attribute: "Resilience", value: 6.5 },
        { attribute: "Empathy", value: 6 },
        { attribute: "Creativity", value: 5 },
        { attribute: "Discipline", value: 8.5 },
        { attribute: "Adapt.", value: 8 },
        { attribute: "Confidence", value: 6.5 },
        { attribute: "Communication skills", value: 7 },
        { attribute: "Curiosity", value: 7 },
        { attribute: "Time Mgmt", value: 7.5 },
        { attribute: "Social", value: 6 },
        { attribute: "Mindful.", value: 5.5 }
    ];

    // Create SVG container
    const svg = d3.select("#vis-radarplot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .attr("class", "radar-chart");

    // Add title
    svg.append("text")
        .attr("x", 0)
        .attr("y", -height / 2 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("My Abilities and Qualities Scatterplot Radarplot");

    // Scales
    const rScale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, radius]);

    const angleScale = d3.scalePoint()
        .domain(data.map(d => d.attribute).concat([data[0].attribute])) // Ensure closed loop
        .range([0, 2 * Math.PI]);

    // Radial line generator
    const radialLine = d3.lineRadial()
        .angle(d => angleScale(d.attribute))
        .radius(d => rScale(d.value))
        .curve(d3.curveLinearClosed);

    // Draw grid (concentric circles for value levels)
    const levels = [0, 2, 4, 6, 8, 10];
    svg.selectAll(".grid-circle")
        .data(levels)
        .enter()
        .append("circle")
        .attr("class", "grid-circle")
        .attr("r", d => rScale(d))
        .style("fill", "none")
        .style("stroke", "#ccc")
        .style("stroke-dasharray", "2,2");

    // Add score range labels (0–10) along the first axis (Wisdom)
    svg.selectAll(".grid-label")
        .data(levels)
        .enter()
        .append("text")
        .attr("class", "grid-label")
        .attr("x", d => rScale(d) * Math.cos(angleScale(data[0].attribute)))
        .attr("y", d => rScale(d) * Math.sin(angleScale(data[0].attribute)))
        .attr("dy", "0.35em")
        .attr("text-anchor", angleScale(data[0].attribute) > Math.PI / 2 && angleScale(data[0].attribute) < 3 * Math.PI / 2 ? "end" : "start")
        .style("font-size", "10px")
        .text(d => d);

    // Draw radial axes
    svg.selectAll(".axis-line")
        .data(data)
        .enter()
        .append("line")
        .attr("class", "axis-line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", d => rScale(10) * Math.cos(angleScale(d.attribute)))
        .attr("y2", d => rScale(10) * Math.sin(angleScale(d.attribute)))
        .style("stroke", "#ccc");

    // Add axis labels with smaller font size
    svg.selectAll(".axis-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "axis-label")
        .attr("x", d => rScale(10.5) * Math.cos(angleScale(d.attribute)))
        .attr("y", d => rScale(10.5) * Math.sin(angleScale(d.attribute)))
        .attr("text-anchor", d => {
            const angle = angleScale(d.attribute);
            return angle > Math.PI / 2 && angle < 3 * Math.PI / 2 ? "end" : "start";
        })
        .attr("dy", "0.35em")
        .style("font-size", "8px") // Reduced from 10px
        .text(d => d.attribute);

    // Plot data
    svg.append("path")
        .datum(data)
        .attr("class", "radar-area")
        .attr("d", radialLine)
        .style("fill", "steelblue")
        .style("fill-opacity", 0.3)
        .style("stroke", "steelblue")
        .style("stroke-width", 2);

    // Add data points with color-coding for ranking
    svg.selectAll(".radar-dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "radar-dot")
        .attr("cx", d => rScale(d.value) * Math.cos(angleScale(d.attribute)))
        .attr("cy", d => rScale(d.value) * Math.sin(angleScale(d.attribute)))
        .attr("r", 4)
        .style("fill", d => d.value >= 7.5 ? "red" : "steelblue") // Highlight top attributes
        .style("opacity", 0.7);
})();