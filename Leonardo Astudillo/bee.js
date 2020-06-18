// Beeswarm POC using d3

// Data taken from LI
var data = [
  {
    id: "Best Action Adventure TV Series",
    salary: 2005
  },
   {
    id: "Best Animated Television Production",
    salary: 2006
  },
   {
    id: "Best TV Series",
    salary: 2005
  },
   {
    id: "in an Animated Television Production",
    salary: 2006
  },
   {
    id: "Writing for an Animated Television Production",
    salary: 2006
  },
   {
    id: "Fave Toon",
    salary: 2007
  },
   {
    id: "Character Animation in a Television Production",
    salary: 2007
  },
   {
    id: "Directing in an Animated Television Production",
    salary: 2007
  },
   {
    id: "Best Action Adventure TV Series",
    salary: 2007
  },
  {
    id: "Best Action Adventure TV Series",
    salary: 2007
  },
  {
    id: "Best Action Adventure TV Series",
    salary: 2007
  },
  
  {
    id: "Best Action Adventure TV Series",
    salary: 2008
  },
  {
    id: "Best Action Adventure TV Series",
    salary: 2008
  },
  {
    id: "Best Action Adventure TV Series",
    salary: 2008
  },
  {
    id: "Best Action Adventure TV Series",
    salary: 2008
  },
  {
    id: "Best Action Adventure TV Series",
    salary: 2009
  },{
    id: "Best Action Adventure TV Series",
    salary: 2009
  },{
    id: "Best Action Adventure TV Series",
    salary: 2009
  },{
    id: "Best Action Adventure TV Series",
    salary: 2009
  },
  {
    id: "Best Action Adventure TV Series",
    salary: 2010
  },
  
];

// sort the data to place the SVG elements on the tab order
data.sort((a, b) => a.salary - b.salary);

var svg = d3.select("svg"),
  margin = { top: 40, right: 40, bottom: 40, left: 40 },
  width = svg.attr("width") - margin.left - margin.right,
  height = svg.attr("height") - margin.top - margin.bottom;

var formatValue = d3.format(",d");

var x = d3.scaleLinear().rangeRound([0, width]);

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// get the range of salary
var range = d3.extent(data, function(d) {
  return d.salary;
});
x.domain(range);

var simulation = d3
  .forceSimulation(data)
  .force(
    "x",
    d3
      .forceX(function(d) {
        return x(d.salary);
      })
      .strength(1)
  )
  .force("y", d3.forceY(height / 2))
  .force("collide", d3.forceCollide(8))
  .stop();

for (var i = 0; i < 150; ++i) simulation.tick();

var cell = g
  .append("g")
  .attr("class", "cells")
  .selectAll("g")
  .data(drawPolygon)
  .enter()
  .append("g");

// To improve hover interaction, add hidden paths
function drawPolygon() {
  var f = d3
    .voronoi()
    .extent([
      [-margin.left, -margin.top],
      [width + margin.right, height + margin.top]
    ])
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
    .polygons(data);
  return f;
}

// Draw the bubbles
cell
  .append("circle")
  .attr("r", 6)
  .attr("cx", function(d) {
    return d.data.x;
  })
  .attr("cy", function(d) {
    return d.data.y;
  })
  .attr("tabindex", 0);

cell.append("path").attr("d", function(d) {
  return "M" + d.join("L") + "Z";
});

cell.append("title").text(function(d) {
  return d.data.id + "\n" + formatValue(d.data.salary);
});

// Draw the axis line in the middle
 g.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height / 2 + ")")
  .append("line")
  .attr("x1", -10)
  .attr("x2", width + 10)
  .attr("y1", 0)
  .attr("y2", 0);

// Draw the axis labels
var label = g
  .append("g")
  .attr("class", "axis-label")
  .attr("transform", "translate(0," + (height / 2 + 25) + ")");

label.append("text").text(formatValue(range[0]));
label.append("text").text(formatValue(range[1])).attr("x", width - 30);

// Draw the average label
//var avgLabel = g.append("g").attr("class", "avg-label").attr("transform", "translate(0," + height + ")");

//avgLabel.append("text").text("$" + formatValue((range[1] - range[0]) / 2)).attr("x", width / 1.75).attr("class", "avg-value");
//avgLabel.append("text").text("average").attr("x", width / 1.75).attr("class", "avg").attr("dy", 25);

// Path for the dotted line that connects the average label to the axis
//var path = ["M", width / 2 - 5, height / 2, "L", width / 2 - 5, height - 5, "L", width / 1.75, //height - 5];
//g.append("path").attr("d", path.join(" ")).attr("class", "dotted");