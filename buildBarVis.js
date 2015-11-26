// Creates a bar visualization
// @data: the data from the csv
// @translateXCoordinate: How far over (x-wise) the graph should go
// @vizNumber: The number of the viz, either 1 2 or 3
// @vizLabel: The label for the viz (what attribute it is)
function buildBarVis(data, translateXCoordinate, vizNumber, vizLabel) {

  var w = 330;
  var h = 700;

  var format = d3.format(",.0f");

  var x = d3.scale.linear().range([10, w-50]),
      y = d3.scale.ordinal().rangeBands([0, h-50], .1);

  var xAxis = d3.svg.axis().scale(x).orient("top").ticks(4).tickSize(-h + 60),
      yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

  var svg = d3.select("#locationOfSVGs").append("svg")
      .attr("class", getVizName(vizNumber))
      .attr("padding-left", "20")
      .attr("margin-left", "20")
      .attr("width", w+125)
      .attr("height", h)
    .append("g")
      .attr("transform", "translate(" + (translateXCoordinate + 25) + "," + 30 + ")");

  // Set the scale domain.
  x.domain([0, d3.max(data, function(d) {
    return d.values.length; 
  })]);
  y.domain(data.map(function(d) { return d.key; }));

  // Adding x axis to screen
  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  // Adding y axis to screen
  svg.append("g")
      .attr("class", "labels")
      .attr("transform", "translate(" + 10 + ",0)")
      .call(yAxis);

  var bar = svg.selectAll("g.bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) {
        return "translate(1," + y(d.key) + ")"; 
      });

  // Putting the rectangles on the bar chart
  bar.append("rect")
      .attr("fill", "#399DB1")
      .attr("transform", "translate(" + 10 + ",0)")
      .attr("width", function(d, i) {
        return x(d.values.length); 
      })
      .attr("height", y.rangeBand())
      .on("mouseover", function(d, i) {
        if(vizNumber == 1){
        // First, remove the old second and third charts
        d3.select("svg.secondChart")
        .remove();
        d3.select("svg.thirdChart")
          .remove();
          buildBarVis(aggregateByValue(data[i].values), 25, vizNumber + 1, "Value");
        } else if (vizNumber == 2) {
          d3.select(".calendarLabel")
            .remove();
          d3.select(".calendarBoxSVG")
            .remove();
          buildCalendarViewVis(aggregateByYear(data[i].values), 25, vizNumber + 1, "Air Date");
        }
        d3.select(this)
          .attr("fill", "#8dcad6");
       })
      .on("mouseout", function() {
        d3.select(this)
          .attr("fill", "#399DB1");
    });

  // Placing the label text for each bar
  bar.append("text")
      .attr("class", "labels")
      .attr("x", function(d) { 
        return x(d.values.length); 
      })
      .attr("y", y.rangeBand() / 2)
      .attr("dx", 20)
      .attr("dy", ".35em")
      .style("font-weight","bold")
      .attr("text-anchor", "end")
      .text(function(d) {
        return format(d.values.length); 
      });

  svg.append("text")
      .attr("x", w / 2 - 50 )
      .attr("y", h - 30)
      .style("font-size","15px")
      .style("font-weight","bold")
      .attr("fill", "black")
      .text(vizLabel);

}