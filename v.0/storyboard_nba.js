/**
 *
 * Created by kanhua on 12/30/15.
 */



var svg = dimple.newSvg("#chartContainer", 900, 600);
d3.csv("../agg_team_stat.csv", function (data) {


    // Create the indicator chart on the right of the main chart
    var indicator = new dimple.chart(svg, data);

    // Pick blue as the default and orange for the selected month
    var defaultColor = indicator.defaultColors[0];
    var indicatorColor = indicator.defaultColors[2];

    // The frame duration for the animation in milliseconds
    var frame = 2000;

    var firstTick = true;

    // Place the indicator bar chart to the right
    indicator.setBounds("80%", "5%", "15%", "90%");

    // Add dates along the y axis
    var y = indicator.addCategoryAxis("y", "Team");
    y.addOrderRule("Team",true);

    // Use sales for bar size and hide the axis
    var x = indicator.addMeasureAxis("x", "dummy_col");
    x.hidden = true;

    // Add the bars to the indicator and add event handlers
    var s = indicator.addSeries(null, dimple.plot.bar);
    s.addEventHandler("click", onClick);
    // Draw the side chart
    indicator.draw();

    // Remove the title from the y axis
    y.titleShape.remove();

    // Remove the lines from the y axis
    y.shapes.selectAll("line,path").remove();

    // Move the y axis text inside the plot area
    y.shapes.selectAll("text")
        .style("text-anchor", "start")
        .style("font-size", "11px")
        .attr("transform", "translate(18, 0.5)");


    // Manually set the bar colors
    s.shapes
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill", function (d) { return (d.y === 'League Average' ? indicatorColor.fill : defaultColor.fill) })
        .style("stroke", function (d) { return (d.y === 'League Average' ? indicatorColor.stroke : defaultColor.stroke) })
        .style("opacity", 0.4);

    // Draw the main chart
    var bubbles = new dimple.chart(svg, data);
    bubbles.setBounds("5%", "5%", "75%", "85%");

    bubbles.addCategoryAxis("x","year");
    bubbles.addMeasureAxis("y", "3PAPG");
    bubbles.addSeries(["year_team", "year","dummy_col"], dimple.plot.bubble);
    //bubbles.addLegend(60, 10, 410, 60);

    // Add a storyboard to the main chart and set the tick event
    var story = bubbles.setStoryboard("Team", onTick);
    // Change the frame duration
    story.frameDuration = frame;
    // Order the storyboard by date
    story.addOrderRule("Team");

    // Draw the bubble chart
    bubbles.draw();

    // Orphan the legends as they are consistent but by default they
    // will refresh on tick
    bubbles.legends = [];
    // Remove the storyboard label because the chart will indicate the
    // current month instead of the label
    story.storyLabel.remove();

    // On click of the side chart
    function onClick(e) {
        // Pause the animation
        story.pauseAnimation();
        // If it is already selected resume the animation
        // otherwise pause and move to the selected month
        if (e.yValue === story.getFrameValue()) {
            story.startAnimation();
        } else {
            story.goToFrame(e.yValue);
            story.pauseAnimation();
        }
    }

    // On tick of the main charts storyboard
    function onTick(e) {
        if (!firstTick) {
            // Color all shapes the same
            s.shapes
                .transition()
                .duration(frame / 2)
                .style("fill", function (d) { return (d.y === e ? indicatorColor.fill : defaultColor.fill) })
                .style("stroke", function (d) { return (d.y === e ? indicatorColor.stroke : defaultColor.stroke) });
        }
        firstTick = false;
    }
});