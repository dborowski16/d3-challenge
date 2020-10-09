// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Axis Parameters
chosenXaxis = 'poverty';
chosenYaxis = 'healthcare';

// Updating X-axis upon click on axis label
function xScale(newsData, chosenXaxis, chartWidth) {
    var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(newsData, d => d[chosenXaxis]))
    .range([0,chartWidth]);
    return xLinearScale;
}

// Updating Y-axis upon click from axis label
function yScale(newsData, chosenYaxis, chartHeight) {
    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(newsData, d => d[chosenYaxis]))
    .range([chartHeight, 0]);
    return yLinearScale;
}

d3.csv("assets/data/data.csv").then(function(newsData) {

    console.log(newsData);

    // Cast each hours value in tvData as a number using the unary + operator
    newsData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.obese = +data.obese;
      data.smokes = +data.smokes;
      data.age = +data.ageMoe;
      data.income = +data.incomeMoe;
      console.log("Poverty:", data.poverty);
      console.log("healthCare:", data.healthcare);
    });

    // Configure a linear scale with a range between 0 and width
    // Set the domain for the xLinearScale function
    // var xScale = d3.scaleLinear()
    // .range([0, chartWidth])
    // .domain(d3.extent(newsData, d => d.poverty));

    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the yLinearScale function
    // var yScale = d3.scaleLinear()
    // .range([chartHeight, 0])
    // .domain([0, d3.max(newsData, d => d.healthcare)]);

    var xLinearScale = xScale(newsData, chosenXaxis, chartWidth);
    var yLinearScale = yScale(newsData, chosenYaxis, chartHeight);

    // Creating new axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);

    // Creating circle ids
    var circles = chartGroup.selectAll('circle')
        .data(newsData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.healthcare))
        .attr('r', 15)
        .attr("stroke-width", "1")
        .classed('stateCircle', true)
        .attr('opacity', '0.75');

    // Creating text for each data point
    chartGroup.append('g')
        .selectAll('text')
        .data(newsData)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr('x', d => xLinearScale(d.poverty))
        .attr('y', d => yLinearScale(d.healthcare))
        .classed('.stateText', true)
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '10px')
        .style('font-weight', 'bold')
        .attr('alignment-baseline', 'central');

    chartGroup.append('text')
        .attr('transform', `translate(${chartWidth / 2}, 470)`)
        .attr('class', 'axisText')
        .text('In Poverty (%)');

    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - (margin.left / 2) - 25)
        .attr('x', 0 - (chartHeight / 2) - 30)
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Lacks Healtcare (%)');

});