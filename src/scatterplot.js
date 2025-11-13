(function () {

// Set dimensions and margins
const scatterMargin = { top: 50, right: 50, bottom: 140, left: 80 };
const scatterWidth = 600 - scatterMargin.left - scatterMargin.right;
const scatterHeight = 500 - scatterMargin.top - scatterMargin.bottom;

// Data
const scatterData = [
    { attribute: "Wisdom", value: 7 },
    { attribute: "Luck", value: 7 },
    { attribute: "Patience", value: 6.5 },
    { attribute: "Health", value: 7 },
    { attribute: "Resilience", value: 6.5 },
    { attribute: "Empathy", value: 6 },
    { attribute: "Creativity", value: 5 },
    { attribute: "Self-discipline", value: 8.5 },
    { attribute: "Adaptability", value: 8 },
    { attribute: "Confidence", value: 6.5 },
    { attribute: "Communication Skills", value: 7 },
    { attribute: "Curiosity", value: 7 },
    { attribute: "Time Management", value: 7.5 },
    { attribute: "Social Skills", value: 6 },
    { attribute: "Mindfulness", value: 5.5 }
];

// Create container div
const container = d3.select("#vis-scatterplot");

// Add dropdown for range selection
const select = container.append("select")
    .style("margin-bottom", "10px");

select.selectAll("option")
    .data(["All", "Below 6", "6-8", "8-10"])
    .enter()
    .append("option")
    .text(d => d);

// Create SVG container for scatterplot
const scatterSvg = container
    .append("svg")
    .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
    .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
    .append("g")
    .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`);

// Add title
scatterSvg.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("My Abilities and Qualities Scatterplot");

// Scales
const scatterYScale = d3.scaleLinear()
    .domain([0, 10])
    .range([scatterHeight, 0]);

// Create axes groups
const xAxisGroup = scatterSvg.append("g")
    .attr("transform", `translate(0, ${scatterHeight})`);

const yAxisGroup = scatterSvg.append("g")
    .call(d3.axisLeft(scatterYScale));

// Add axis labels
scatterSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - scatterMargin.left)
    .attr("x", 0 - (scatterHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Rating (0-10)");

scatterSvg.append("text")
    .attr("transform", `translate(${scatterWidth / 2}, ${scatterHeight + scatterMargin.bottom - 10})`)
    .style("text-anchor", "middle")
    .text("Attributes");

// Function to filter data based on range
function filterData(range) {
    return scatterData.filter(d => {
        if (range === "All") return true;
        if (range === "Below 6") return d.value < 6;
        if (range === "6-8") return d.value >= 6 && d.value <= 8;
        if (range === "8-10") return d.value > 8 && d.value <= 10;
        return false;
    });
}

// Function to update the plot
function updatePlot(filteredData) {
    const scatterXScale = d3.scaleBand()
        .domain(filteredData.map(d => d.attribute))
        .range([0, scatterWidth])
        .padding(0.1);

    // Update X axis
    xAxisGroup.call(d3.axisBottom(scatterXScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    // Update dots
    const dots = scatterSvg.selectAll(".scatter-dot")
        .data(filteredData, d => d.attribute);

    dots.enter()
        .append("circle")
        .attr("class", "scatter-dot")
        .attr("r", 6)
        .style("fill", "steelblue")
        .style("opacity", 0.7)
        .merge(dots)
        .transition()
        .duration(500)
        .attr("cx", d => scatterXScale(d.attribute) + scatterXScale.bandwidth() / 2)
        .attr("cy", d => scatterYScale(d.value));

    dots.exit()
        .transition()
        .duration(500)
        .attr("r", 0)
        .remove();

    // Update labels
    const labels = scatterSvg.selectAll(".scatter-value-label")
        .data(filteredData, d => d.attribute);

    labels.enter()
        .append("text")
        .attr("class", "scatter-value-label")
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .merge(labels)
        .transition()
        .duration(500)
        .attr("x", d => scatterXScale(d.attribute) + scatterXScale.bandwidth() / 2)
        .attr("y", d => scatterYScale(d.value) - 10)
        .text(d => d.value);

    labels.exit()
        .transition()
        .duration(500)
        .remove();
}

// Initial plot
updatePlot(scatterData);

// Event listener for dropdown
select.on("change", function() {
    const selectedRange = d3.select(this).property("value");
    const filtered = filterData(selectedRange);
    updatePlot(filtered);
});

})();