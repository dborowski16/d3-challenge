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

// Function used for updating xAxis var upon click on axis label.
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// Updating Y-axis upon click from axis label
function yScale(newsData, chosenYaxis, chartHeight) {
    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(newsData, d => d[chosenYaxis]))
    .range([chartHeight, 0]);
    return yLinearScale;
}

// Function used for updating yAxis var upon click on axis label.
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// Making circle markers
function makeCircles(circlesGroup, newXScale, newYScale, chosenXaxis, chosenYaxis) {
    circlesGroup.transition()
        duration(1000)
        .attr('cx', d => newXScale(d[chosenXaxis]))
        .attr('cy', d => newYScale(d[chosenYaxis]))
        // .attr('r', 15)
        // .attr("stroke-width", "1")
        // .classed('stateCircle', true)
        // .attr('opacity', '0.75');
    return circlesGroup;
}

function newText(textGroup, newXScale, newYScale, chosenXaxis, chosenYaxis) {
    textGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXaxis]))
        .attr('cy', d => newYScale(d[chosenYaxis]))
    return textGroup;
}

d3.csv("assets/data/data.csv").then(function(newsData) {

    // console.log(newsData);

    // Cast each hours value in tvData as a number using the unary + operator
    newsData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.obese = +data.obese;
      data.smokes = +data.smokes;
      data.age = +data.ageMoe;
      data.income = +data.incomeMoe;
    });

    var xLinearScale = xScale(newsData, chosenXaxis, chartWidth);
    var yLinearScale = yScale(newsData, chosenYaxis, chartHeight);

    // Creating new axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append('g')
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll('circle')
        .data(newsData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXaxis]))
        .attr('cy', d => yLinearScale(d[chosenYaxis]))
        .attr('r', 15)
        .attr("stroke-width", "1")
        .classed('stateCircle', true)
        .attr('opacity', '0.75');

    // Creating text for each data point
    var textGroup = chartGroup.selectAll('.stateText')
        .data(newsData)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr('x', d => xLinearScale(d[chosenXaxis]))
        .attr('y', d => yLinearScale(d[chosenYaxis]))
        .classed('stateText', true)
        .attr('font-size', '10px')
        .attr('alignment-baseline', 'central');

    // Creating a new group for 3 x-axis
    var xLabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${chartWidth / 2}, 470)`)

    var povertyLabel = xLabelsGroup.append('text')
        .attr('class', 'axisText')
        .attr('value', 'poverty')
        .text('In Poverty (%)');

    var ageLabel = xLabelsGroup.append('text')
        .attr('class', 'axisText')
        .attr('value', 'poverty')
        .text('Age (Median)');

    var houseLabel = xLabelsGroup.append('text')
        .attr('class', 'axisText')
        .attr('value', 'poverty')
        .text('Household Income (Median');

    xLabelsGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');
            if (value != chosenXaxis) {
                chosenXaxis = value;
                xLinearScale = xScale(newsData, chosenXaxis);
                xAxis = renderXAxes(xLinearScale, xAxis);
                circlesGroup = makeCircles(circlesGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);
                textGroup = newText(textGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis)

                if (chosenXAxis === "poverty") {
                    povertyLabel.classed("active", true).classed("inactive", false);
                    ageLabel.classed("active", false).classed("inactive", true);
                    houseLabel.classed("active", false).classed("inactive", true);
                } else if (chosenXAxis === "age") {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", true).classed("inactive", false);
                    houseLabel.classed("active", false).classed("inactive", true);
                } else {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", false).classed("inactive", true);
                    houseLabel.classed("active", true).classed("inactive", false);
                }
            }
        })
    
    var yLabelsGroup = chartGroup.append('g')
    .attr('transform', `translate(${0 - margin.left/4}, ${chartHeight/2})`)

    var healthLabel = xLabelsGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - (margin.left / 2) - 25)
        .attr('x', 0 - (chartHeight / 2) - 30)
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Lacks Healtcare (%)');

    var smokesLabel = xLabelsGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - (margin.left / 2) - 25)
        .attr('x', 0 - (chartHeight / 2) - 30)
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Smokes (%)');

    var obeseLabel = xLabelsGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - (margin.left / 2) - 25)
        .attr('x', 0 - (chartHeight / 2) - 30)
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Obese (%)');


});