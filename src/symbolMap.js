// symbolMap.js
document.addEventListener('DOMContentLoaded', function() {
    // Clear the container first
    const container = d3.select("#vis-symbolMap");
    container.html("");
    
    // Set up dimensions - width 600 with proportional height
    const width = 600;
    const height = 450; // 600 * 0.75 = 450 (maintain 4:3 aspect ratio)
    const margin = { top: 30, right: 20, bottom: 30, left: 20 };

    // Create SVG container
    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "linear-gradient(135deg, #0f1a30, #1a2a6c)")
        .style("border-radius", "10px");

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const mapWidth = width - margin.left - margin.right;
    const mapHeight = height - margin.top - margin.bottom;

    // Title
    g.append("text")
        .attr("x", mapWidth / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text("Real-Time Website Visitor Map");

    // World map projection - adjusted for smaller size
    const projection = d3.geoMercator()
        .scale(100) // Smaller scale for smaller map
        .center([0, 30])
        .translate([mapWidth / 2, mapHeight / 2]);

    const path = d3.geoPath().projection(projection);

    // Load world map data
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(function(world) {
            // Convert TopoJSON to GeoJSON
            const countries = topojson.feature(world, world.objects.countries);
            
            // Draw countries
            g.selectAll(".country")
                .data(countries.features)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("d", path)
                .style("fill", "#1e3a5f")
                .style("stroke", "#2d4d76")
                .style("stroke-width", 0.5)
                .style("opacity", 0.8);

            // Major cities with geographic coordinates
            const majorCities = [
                { city: "New York", country: "USA", coords: [-74.006, 40.7128] },
                { city: "London", country: "UK", coords: [-0.1276, 51.5074] },
                { city: "Tokyo", country: "Japan", coords: [139.6917, 35.6895] },
                { city: "Hong Kong", country: "China", coords: [114.1694, 22.3193] },
                { city: "Singapore", country: "Singapore", coords: [103.8198, 1.3521] },
                { city: "Sydney", country: "Australia", coords: [151.2093, -33.8688] },
                { city: "Berlin", country: "Germany", coords: [13.4050, 52.5200] },
                { city: "São Paulo", country: "Brazil", coords: [-46.6333, -23.5505] },
                { city: "Mumbai", country: "India", coords: [72.8777, 19.0760] },
                { city: "Toronto", country: "Canada", coords: [-79.3832, 43.6532] },
                { city: "San Francisco", country: "USA", coords: [-122.4194, 37.7749] },
                { city: "Paris", country: "France", coords: [2.3522, 48.8566] },
                { city: "Dubai", country: "UAE", coords: [55.2708, 25.2048] },
                { city: "Moscow", country: "Russia", coords: [37.6173, 55.7558] },
                { city: "Seoul", country: "South Korea", coords: [126.9780, 37.5665] }
            ];

            // Pre-calculate city positions
            const cityPositions = {};
            majorCities.forEach(city => {
                const projected = projection(city.coords);
                if (projected) {
                    cityPositions[city.city] = {
                        x: projected[0],
                        y: projected[1],
                        country: city.country
                    };
                }
            });

            // Draw city markers (small white dots)
            Object.values(cityPositions).forEach(pos => {
                g.append("circle")
                    .attr("cx", pos.x)
                    .attr("cy", pos.y)
                    .attr("r", 1.5) // Smaller dots for smaller map
                    .style("fill", "white")
                    .style("opacity", 0.7);
            });

            // Store active visitors
            let activeVisitors = [];
            let visitorId = 0;
            const cityCounters = {};
            majorCities.forEach(city => {
                cityCounters[city.city] = 0;
            });

            // Color scale based on visitor duration
            const colorScale = d3.scaleSequential(d3.interpolatePlasma)
                .domain([0, 60]);

            // Create tooltip
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "visitor-tooltip")
                .style("position", "absolute")
                .style("background", "rgba(255, 255, 255, 0.95)")
                .style("padding", "8px 12px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "4px")
                .style("pointer-events", "none")
                .style("opacity", 0)
                .style("font-size", "12px")
                .style("box-shadow", "0 4px 15px rgba(0,0,0,0.2)")
                .style("z-index", "1000");

            // Function to create a new visitor
            function createVisitor() {
                const randomCity = majorCities[Math.floor(Math.random() * majorCities.length)];
                const cityPos = cityPositions[randomCity.city];
                
                if (!cityPos) return null;

                // Add random offset around the city center
                const offsetX = (Math.random() - 0.5) * 20; // Smaller offset for smaller map
                const offsetY = (Math.random() - 0.5) * 20;

                const x = cityPos.x + offsetX;
                const y = cityPos.y + offsetY;
                const size = Math.random() * 3 + 4; // Smaller dots for smaller map
                const duration = Math.random() * 50 + 10;

                const visitor = {
                    id: visitorId++,
                    city: randomCity.city,
                    country: randomCity.country,
                    x: x,
                    y: y,
                    size: size,
                    duration: duration,
                    joinTime: new Date()
                };

                activeVisitors.push(visitor);
                cityCounters[randomCity.city]++;

                // Create visitor dot
                const visitorCircle = g.append("circle")
                    .attr("class", "visitor-dot")
                    .attr("visitor-id", visitor.id)
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", size)
                    .style("fill", colorScale(duration))
                    .style("stroke", "#fff")
                    .style("stroke-width", 1.5)
                    .style("cursor", "pointer")
                    .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.3))")
                    .style("opacity", 0.9);

                // Add hover effects
                visitorCircle.on("mouseover", function(event) {
                    const timeOnline = Math.floor((new Date() - visitor.joinTime) / 1000);
                    const minutes = Math.floor(timeOnline / 60);
                    const seconds = timeOnline % 60;
                    
                    // Highlight on hover
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", size * 1.3)
                        .style("opacity", 1);
                    
                    tooltip
                        .style("opacity", 1)
                        .html(`
                            <strong>Visitor from ${visitor.city}</strong><br/>
                            Country: ${visitor.country}<br/>
                            Online: ${minutes}m ${seconds}s<br/>
                            Estimated stay: ${Math.floor(visitor.duration)} minutes
                        `);
                })
                .on("mousemove", function(event) {
                    tooltip
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 15) + "px");
                })
                .on("mouseout", function() {
                    // Return to normal size
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", size)
                        .style("opacity", 0.9);
                        
                    tooltip.style("opacity", 0);
                });

                // Schedule visitor departure
                setTimeout(() => {
                    removeVisitor(visitor.id);
                }, visitor.duration * 1000);

                return visitor;
            }

            // Function to remove visitor
            function removeVisitor(id) {
                const index = activeVisitors.findIndex(v => v.id === id);
                if (index !== -1) {
                    const visitor = activeVisitors[index];
                    cityCounters[visitor.city]--;
                    
                    g.select(`.visitor-dot[visitor-id="${id}"]`).remove();
                    activeVisitors.splice(index, 1);
                    updateStats();
                }
            }

            // Update statistics display
            function updateStats() {
                const activeCities = Object.values(cityCounters).filter(count => count > 0).length;
                d3.select("#visitor-stats").html(`
                    <div style="margin-bottom: 6px;"><strong>Live Stats</strong></div>
                    <div>Active Visitors: <strong>${activeVisitors.length}</strong></div>
                    <div>Cities: <strong>${activeCities}</strong></div>
                    <div style="font-size: 9px; margin-top: 6px; color: #ccc;">Updated: ${new Date().toLocaleTimeString()}</div>
                `);
            }

            // Create stats display
            const statsContainer = container
                .append("div")
                .attr("id", "visitor-stats")
                .style("position", "absolute")
                .style("top", "15px")
                .style("right", "15px")
                .style("background", "rgba(0, 0, 0, 0.8)")
                .style("color", "white")
                .style("padding", "12px")
                .style("border-radius", "8px")
                .style("font-size", "11px")
                .style("font-family", "Arial, sans-serif")
                .style("border", "1px solid rgba(255, 255, 255, 0.3)")
                .style("backdrop-filter", "blur(5px)");

            updateStats();

            // Create legend
            const legend = g.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(15, 15)`);

            // Legend background
            legend.append("rect")
                .attr("width", 120)
                .attr("height", 110)
                .style("fill", "rgba(0, 0, 0, 0.7)")
                .style("rx", "6")
                .style("ry", "6")
                .style("stroke", "rgba(255, 255, 255, 0.3)")
                .style("stroke-width", "1");

            // Legend title
            legend.append("text")
                .attr("x", 60)
                .attr("y", 15)
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .style("font-weight", "bold")
                .style("fill", "white")
                .text("Session Duration");

            // Legend items
            const legendData = [10, 25, 40, 55, 70];
            legend.selectAll(".legend-item")
                .data(legendData)
                .enter()
                .append("g")
                .attr("transform", (d, i) => `translate(15, ${i * 18 + 25})`)
                .each(function(d) {
                    const g = d3.select(this);
                    g.append("circle")
                        .attr("r", 5)
                        .style("fill", colorScale(d))
                        .style("stroke", "white")
                        .style("stroke-width", 1);
                    g.append("text")
                        .attr("x", 18)
                        .attr("y", 3)
                        .style("font-size", "9px")
                        .style("fill", "white")
                        .style("font-weight", "bold")
                        .text(`${d} min`);
                });

            // Start visitor simulation
            function startSimulation() {
                // Create initial visitors
                for (let i = 0; i < 6; i++) {
                    setTimeout(() => {
                        createVisitor();
                        updateStats();
                    }, i * 800);
                }

                // Continuous visitor generation
                setInterval(() => {
                    if (activeVisitors.length < 15) {
                        createVisitor();
                        updateStats();
                    }
                }, 2000);

                // Update timestamp every second
                setInterval(updateStats, 1000);
            }

            // Start the simulation
            startSimulation();

        })
        .catch(function(error) {
            console.error("Error loading world map data:", error);
            // Fallback to simple map
            createSimpleWorldMap();
        });

    function createSimpleWorldMap() {
        // Simple fallback map scaled for 600x450
        const continents = [
            { name: "North America", x: mapWidth * 0.25, y: mapHeight * 0.4, radius: 60 },
            { name: "South America", x: mapWidth * 0.3, y: mapHeight * 0.65, radius: 45 },
            { name: "Europe", x: mapWidth * 0.55, y: mapHeight * 0.35, radius: 38 },
            { name: "Africa", x: mapWidth * 0.6, y: mapHeight * 0.5, radius: 52 },
            { name: "Asia", x: mapWidth * 0.75, y: mapHeight * 0.4, radius: 68 },
            { name: "Australia", x: mapWidth * 0.85, y: mapHeight * 0.7, radius: 30 }
        ];

        // Draw continent backgrounds
        continents.forEach(continent => {
            g.append("circle")
                .attr("cx", continent.x)
                .attr("cy", continent.y)
                .attr("r", continent.radius)
                .style("fill", "#1e3a5f")
                .style("stroke", "#2d4d76")
                .style("stroke-width", 2)
                .style("opacity", 0.6);
        });

        g.append("text")
            .attr("x", mapWidth / 2)
            .attr("y", mapHeight / 2)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("opacity", 0.5)
            .style("font-size", "12px")
            .text("World Map - Data Loading Failed");
    }
});