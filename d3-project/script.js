var files = ['data/data.json'];
var promises = [];

files.forEach(function(url) {
    promises.push(d3.json(url))
});

Promise.all(promises)
    .then(function (promises) {
        console.log(promises[0])
        scatter = new ReverseScatterPlot(promises[0]);
        scatter.update(promises[0]);

    });


function ReverseScatterPlot(data) {
    var margin = {
        left: 20,
        right: 20,
        top: 30,
        bottom: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var chart = this;

    chart.SVG = d3.select('#chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    chart.svg = d3.select('svg')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    chart.xScale = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.x; }))
        .range([width - 50, 0])
        .nice();

    chart.yScale = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.y; }))
        .range([50, height]);

    chart.xAxis = d3.axisBottom(chart.xScale).ticks(5, "s");
    chart.yAxis = d3.axisLeft(chart.yScale).ticks(5, "s");
};

ReverseScatterPlot.prototype.update = function (data) {

    var margin = {
        left: 50,
        right: 50,
        top: 30,
        bottom: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var chart = this;

    chart.full = data.slice();

    chart.SVG
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    chart.svg.append("g")
        .attr("transform", `translate(0,50)`)
        .attr("class", "axis")
        .call(chart.xAxis);

    chart.svg.append("g")
        .attr("transform", `translate(${width + margin.right - 30},0)`)
        .attr("class", "axis")
        .call(chart.yAxis);

    chart.svg.selectAll(".circ")
        .data(chart.full, function(d) { return d.x; }).enter()
        .append("circle")
        .attr("class", "circ")
        .attr("r", 0)
        .attr("cx", function(d) {return chart.xScale(d.x); })
        .attr("cy", function(d) {return chart.yScale(d.y); })
        .transition()
        .delay(function (d,i) {return (i * 20); })
        .duration(500)
        .attr("r", 8)
        .attr("fill", function(d) {

            colors = {'sticker': 'red',
                      'license': 'blue',
                      'street cleaning': 'green',
                      'speeding': 'yellow',
                      'snow': 'black'};

            return colors[d.label];
        });

    var legendVals = d3.set(data.map( function(d) { return d.label } ) ).values();

    var legendVals1 = d3.scaleOrdinal()
        .domain(legendVals)
        .range(['red','blue','green','yellow','black']);

    var legend = chart.svg.selectAll('.legend')
        .data(legendVals1.domain())
        .enter().append('g')
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return `translate(40, ${(i+3)*20})`;
        });

    legend.append('rect')
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
            return legendVals1(i);
        });

    legend.append('text')
        .attr("x", 20)
        .attr("y", 10)
        .text(function (d, i) {
            return d
        })
        .attr("class", "textselected")
        .style("text-anchor", "start")
        .style("font-size", 15);


    chart.svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .style("fill", "#000000")
        .text("Revenue by Day");

    chart.svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("At this time, the data will not reflext any meaningful patterns, but the requirements of the reverse scatter plot are met.");


    chart.svg.append("text")
        .attr("transform",
              "translate(" + (width/2) + " ," +
              (40) + ")")
        .style("text-anchor", "middle")
        .text("Day");

   chart.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.left - 20)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Dollars ($)");

    chart.svg.append("text")
        .attr("transform",
              "translate(" + (width - 50) + " ," +
              (0 - 5) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Source: Propublica");

};










