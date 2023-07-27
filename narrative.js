
d3.csv("car_prices.csv").then(data => {
  
  data.forEach(d => {
    d.car_ID = +d.car_ID;
    d.symboling = +d.symboling;
    d.wheelbase = +d.wheelbase;
    d.carlength = +d.carlength;
    d.carwidth = +d.carwidth;
    d.carheight = +d.carheight;
    d.curbweight = +d.curbweight;
    d.enginesize = +d.enginesize;
    d.boreratio = +d.boreratio;
    d.stroke = +d.stroke;
    d.compressionratio = +d.compressionratio;
    d.horsepower = +d.horsepower;
    d.peakrpm = +d.peakrpm;
    d.citympg = +d.citympg;
    d.highwaympg = +d.highwaympg;
    d.price = +d.price;
  });

  
  let currentScene = 0;

  
  const scatterWidth = 500;
  const scatterHeight = 400;
  const scatterMargin = { top: 20, right: 30, bottom: 40, left: 50 };
  const scatterX = d3.scaleLinear().domain(d3.extent(data, d => d.citympg)).nice().range([0, scatterWidth]);
  const scatterY = d3.scaleLinear().domain(d3.extent(data, d => d.horsepower)).nice().range([scatterHeight, 0]);

  
  const barWidth = 500;
  const barHeight = 300;
  const barMargin = { top: 20, right: 100, bottom: 40, left: 100 }; 
  const barX = d3.scaleBand().domain(data.map(d => d.carbody)).range([0, barWidth]).padding(0.1);
  const barY = d3.scaleLinear().domain([0, d3.max(data, d => d.horsepower)]).nice().range([barHeight, 0]);


  const bubbleWidth = 500;
  const bubbleHeight = 400;
  const bubbleMargin = { top: 20, right: 30, bottom: 40, left: 50 };
  const bubbleX = d3.scaleLinear().domain(d3.extent(data, d => d.enginesize)).nice().range([0, bubbleWidth]);
  const bubbleY = d3.scaleLinear().domain(d3.extent(data, d => d.price)).nice().range([bubbleHeight, 0]);
  const bubbleSize = d3.scaleLinear().domain(d3.extent(data, d => d.horsepower)).range([5, 30]);

  
  function createScatterPlot() {
    d3.select("#scatterPlot").html(""); 
    const scatterSvg = d3.select("#scatterPlot").append("svg").attr("width", scatterWidth + scatterMargin.left + scatterMargin.right).attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom);
    const scatterGroup = scatterSvg.append("g").attr("transform", `translate(${scatterMargin.left},${scatterMargin.top})`);

    scatterGroup.selectAll("circle").data(data).enter().append("circle")
      .attr("cx", d => scatterX(d.citympg))
      .attr("cy", d => scatterY(d.horsepower))
      .attr("r", 5)
      .attr("fill", "blue")
      .attr("opacity", 0.7);

    scatterGroup.append("g").attr("transform", `translate(0,${scatterHeight})`).call(d3.axisBottom(scatterX));
    scatterGroup.append("g").call(d3.axisLeft(scatterY));

    scatterGroup.append("text")
      .attr("x", scatterWidth / 2)
      .attr("y", scatterHeight + scatterMargin.bottom)
      .attr("text-anchor", "middle")
      .attr("class", "chart-axis-text")
      .text("Mileage (citympg)");

    scatterGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -scatterHeight / 2)
      .attr("y", -scatterMargin.left + 15)
      .attr("text-anchor", "middle")
      .attr("class", "chart-axis-text")
      .text("Horsepower");
  }


  function createBarChart() {
    d3.select("#barChart").html(""); 
    const barSvg = d3.select("#barChart").append("svg").attr("width", barWidth + barMargin.left + barMargin.right).attr("height", barHeight + barMargin.top + barMargin.bottom);
    const barGroup = barSvg.append("g").attr("transform", `translate(${barMargin.left},${barMargin.top})`);
  
    const barChartData = d3.rollup(data, v => d3.mean(v, d => d.horsepower), d => d.carbody);
  
    barGroup.selectAll("rect").data(barChartData).enter().append("rect")
      .attr("x", d => barX(d[0]))
      .attr("y", d => barY(d[1]))
      .attr("width", barX.bandwidth())
      .attr("height", d => barHeight - barY(d[1]))
      .attr("fill", "steelblue")
      .on("mouseover", function (event, d) {
        tooltip.style("opacity", 1)
          .style("left", event.pageX + "px")
          .style("top", event.pageY + "px")
          .html(`<b>${d[0]}</b><br>Average Horsepower: ${d[1]} hp`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });
  
    barGroup.append("g").attr("transform", `translate(0,${barHeight})`).call(d3.axisBottom(barX));
    barGroup.append("g").call(d3.axisLeft(barY));
  
    barGroup.append("text")
      .attr("x", barWidth / 2)
      .attr("y", barHeight + barMargin.bottom)
      .attr("text-anchor", "middle")
      .attr("class", "chart-axis-text")
      .text("Car Body Type");
  
    barGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -barHeight / 2)
      .attr("y", -barMargin.left + 10) 
      .attr("text-anchor", "middle")
      .attr("class", "chart-axis-text")
      .text("Average Horsepower");

      const tooltip = d3.select("#barChart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  barGroup.selectAll("rect").data(barChartData).enter().append("rect")

    .on("mouseover", function (event, d) {
      tooltip.style("opacity", 1)
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px")
        .html(`<b>${d[0]}</b><br>Average Horsepower: ${d[1]} hp`);
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
    });
  }

  function createBubbleChart() {
    d3.select("#bubbleChart").html(""); 
    const bubbleSvg = d3.select("#bubbleChart").append("svg").attr("width", bubbleWidth + bubbleMargin.left + bubbleMargin.right).attr("height", bubbleHeight + bubbleMargin.top + bubbleMargin.bottom);
    const bubbleGroup = bubbleSvg.append("g").attr("transform", `translate(${bubbleMargin.left},${bubbleMargin.top})`);

    bubbleGroup.selectAll("circle").data(data).enter().append("circle")
      .attr("cx", d => bubbleX(d.enginesize))
      .attr("cy", d => bubbleY(d.price))
      .attr("r", d => bubbleSize(d.horsepower))
      .attr("fill", "blue")
      .attr("opacity", 0.7);

    bubbleGroup.append("g").attr("transform", `translate(0,${bubbleHeight})`).call(d3.axisBottom(bubbleX));
    bubbleGroup.append("g").call(d3.axisLeft(bubbleY));

    bubbleGroup.append("text")
      .attr("x", bubbleWidth / 2)
      .attr("y", bubbleHeight + bubbleMargin.bottom)
      .attr("text-anchor", "middle")
      .attr("class", "chart-axis-text")
      .text("Engine Size");

    bubbleGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -bubbleHeight / 2)
      .attr("y", -bubbleMargin.left)
      .attr("text-anchor", "middle")
      .attr("class", "chart-axis-text")
      .text("Price");

    bubbleGroup.append("text")
      .attr("x", bubbleWidth / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("class", "chart-title")
      .text("Bubble Chart: Engine Size vs. Price");

    bubbleGroup.append("text")
      .attr("x", bubbleWidth / 2)
      .attr("y", bubbleHeight + bubbleMargin.bottom - 10)
      .attr("text-anchor", "middle")
      .attr("class", "chart-axis-text")
      .text("Horsepower (Bubble Size)");
  }

  function updateScene() {
    if (currentScene === 0) {
      createScatterPlot();
    } else if (currentScene === 1) {
      createBarChart();
    } else if (currentScene === 2) {
      createBubbleChart();
    }
  }

  d3.select("#nextButton").on("click", () => {
    currentScene = (currentScene + 1) % 3; 
    updateScene();
  });

  updateScene();
});
