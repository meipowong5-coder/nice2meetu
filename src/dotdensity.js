/* -------------------------------------------------
   dotdensity.js – Dot-density culture interest map (centered)
   ------------------------------------------------- */
(function () {

  // ---------------------------------------------------------
  // 1. DATA – cultures of interest
  // ---------------------------------------------------------
  const cultures = [
    { name: "Hong Kong", lat: 22.3193, lng: 114.1694, interest: 1000, type: "home culture" },
    { name: "Guangzhou", lat: 23.1291, lng: 113.2644, interest: 800, type: "hometown culture" },
    { name: "Taipei", lat: 25.0330, lng: 121.5654, interest: 600, type: "Taiwanese culture" },
    { name: "Tainan", lat: 22.9908, lng: 120.2133, interest: 400, type: "Taiwanese culture" },
    { name: "Kaohsiung", lat: 22.6273, lng: 120.3014, interest: 300, type: "Taiwanese culture" },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503, interest: 900, type: "Japanese culture" },
    { name: "Fukuoka", lat: 33.5902, lng: 130.4017, interest: 500, type: "Japanese culture" },
    { name: "Nagasaki", lat: 32.7503, lng: 129.8779, interest: 400, type: "Japanese culture" },
    { name: "Sasebo", lat: 33.1800, lng: 129.7150, interest: 300, type: "Japanese culture" },
    { name: "Vancouver", lat: 49.2827, lng: -123.1207, interest: 200, type: "Canadian culture" }
  ];

  // ---------------------------------------------------------
  // 2. CONTAINER & CENTERED WRAPPER
  // ---------------------------------------------------------
  const container = d3.select("#vis-dotdensity");
  container.selectAll("*").remove();

  const wrapper = container.append("div")
      .attr("class", "map-wrapper")
      .style("max-width", "900px")
      .style("margin", "0 auto")
      .style("text-align", "center");

  wrapper.append("h2")
    .style("margin","0 0 12px")
    .style("font-size","24px")
    .style("color","#2c3e50")
    .style("font-weight","bold")
    .text("My Dot-Density Map of Cultures I'm Interested In");

  wrapper.append("p")
    .style("margin","0 0 24px")
    .style("font-size","16px")
    .style("color","white")
    .text("Cultures of countries and cities I'm interested in – interest level represented by dot density (use mouse wheel to zoom)");

  // ---------------------------------------------------------
  // 3. SVG + PROJECTION
  // ---------------------------------------------------------
  const width  = 800;
  const height = 500;

  const svg = wrapper.append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width","100%")
      .style("height","auto")
      .style("background","#fff")
      .style("border-radius","12px")
      .style("box-shadow","0 4px 16px rgba(0,0,0,0.1)")
      .style("display","block")
      .style("margin","0 auto");

  const projection = d3.geoMercator()
      .center([115, 25])
      .scale(800)
      .translate([width/2, height/2]);

  const path = d3.geoPath().projection(projection);

  // Zoom functionality
  const zoom = d3.zoom()
      .scaleExtent([1, 32])
      .on("zoom", zoomed);

  svg.call(zoom);

  const mapGroup = svg.append("g");

  function zoomed(event) {
    mapGroup.attr("transform", event.transform);
  }

  // ---------------------------------------------------------
  // 4. LOAD REAL WORLD MAP (TopoJSON)
  // ---------------------------------------------------------
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(world => {
      const countries = topojson.feature(world, world.objects.countries);

      mapGroup.append("g")
        .selectAll("path")
        .data(countries.features)
        .enter().append("path")
        .attr("class","land")
        .attr("d",path)
        .attr("fill", "#f0f0f0")
        .attr("stroke", "#ccc");

      const graticule = d3.geoGraticule();
      mapGroup.append("path")
        .datum(graticule)
        .attr("class","graticule")
        .attr("d",path)
        .attr("fill","none")
        .attr("stroke","#ddd")
        .attr("stroke-width",0.5);

      // ---------------------------------------------------------
      // 5. DRAW DOTS (multiple small dots for dot-density)
      // ---------------------------------------------------------
      const dotsGroup = mapGroup.append("g");
      const jitter = 2; // Adjust jitter for dot spread (in pixels)

      cultures.forEach(culture => {
        const [x, y] = projection([culture.lng, culture.lat]);
        for (let i = 0; i < culture.interest; i++) {
          const dx = (Math.random() - 0.5) * jitter * 2;
          const dy = (Math.random() - 0.5) * jitter * 2;
          dotsGroup.append("circle")
            .attr("class", `dot ${culture.type.replace(/ /g, "-")}`)
            .attr("cx", x + dx)
            .attr("cy", y + dy)
            .attr("r", 1)
            .attr("fill", "steelblue")
            .attr("opacity", 0.7)
            .on("mouseover", (event) => handleMouseOver(event, culture))
            .on("mouseout", handleMouseOut);
        }
      });

      // ---------------------------------------------------------
      // 6. TOOLTIP
      // ---------------------------------------------------------
      const tooltip = d3.select("body").append("div")
          .attr("class","tooltip")
          .style("opacity",0)
          .style("position", "absolute")
          .style("background", "#fff")
          .style("border", "1px solid #ccc")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("pointer-events", "none");

      function handleMouseOver(event, d) {
        tooltip.html(`
          <strong>${d.name} Culture</strong><br>
          ${d.type.charAt(0).toUpperCase() + d.type.slice(1)}: Interest level ${d.interest}
        `)
        .style("left", (event.pageX + 12) + "px")
        .style("top",  (event.pageY - 28) + "px")
        .transition().duration(200).style("opacity", 1);

        d3.select(this)
          .attr("stroke", "#000")
          .attr("stroke-width", 0.5)
          .raise();
      }

      function handleMouseOut() {
        tooltip.transition().duration(400).style("opacity", 0);
        d3.select(this).attr("stroke", "none");
      }

    })
    .catch(err => {
      console.error("Failed to load world map:", err);
      wrapper.append("p").text("Warning: World map could not be loaded.");
    });

})();