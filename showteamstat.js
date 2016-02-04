/**
 *
 * Created by kanhua on 1/10/16.
 */


function getFeature(d, featureName) {
    return d[featureName];
}

/* Main function that draws the main chart,
 *  team labels, and y-axis selector buttons
 */
d3.csv("./agg_team_stat.csv", function (d) {
    d["3P"] = +d["3P"];
    d["3PA"] = +d["3PA"];
    d["year"] = +d["year"];
    d["G"] = +d["G"];
    d["3PAPG"] = +d["3PAPG"];
    d["3P%"] = +d["3P%"];
    return d;
}, function (data) {


    // Define the dimension parameters of the chart
    var margin = {"top": 15, "bottom": 25, "left": 75, "right": 75},
        svgWidth = 700,
        svgHeight = 600,
        chartWidth = svgWidth - margin.left,
        chartHeight = svgHeight - margin.right,
        labelWidth = 170,
        labelHeight = svgHeight;


    // Initialize the "g" element for the main chart
    var mainChartG = d3.select("#chartContainer")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g");


    // a flag that records whether the elements have already drawed
    var dataDrawed = false;


    // the array that maintains the teams to be highlighted on the chart
    var highlightTeam = [];


    // Place the buttons for selecting different statistics
    var yFeatures = ["3PAPG", "3PA", "3P", "3P%"];

    /*
    * The feature that currently shows on the main chart.
    * The default is "3PAPG
    * */
    var currentFeature = "3PAPG";

    var dataPointDefaultColor="grey";

    // Initialize the properties of tooltips for the data points
    var tooltipDiv = d3.select("#chartDiv")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);



    /*
    * getFillColor(), getStrokeColor() and getOpacity() adjusts the
    * color properties of data point
    * */

    /**
     * Return the fill color of the data point for d3.select("circle").attr("fill",value)
     * @param d the datum
     * @returns {string} the color
     */
    function getFillColor(d) {
        if (highlightTeam.indexOf(d["Team"]) >= 0) {

            return teamCode[d["Team"]]["color1"];
        }
        else {
            return dataPointDefaultColor;
        }
    }

    /**
     * Return the fill color of the data point for d3.select("circle").attr("stroke",value)
     * @param d the datum
     * @returns {string} the color
     */
    function getStrokeColor(d) {

        if (highlightTeam.indexOf(d["Team"]) >= 0) {

            return teamCode[d["Team"]]["color2"];
        }
        else {
            return dataPointDefaultColor;
        }
    }

    /**
     * Return the opacity of the data point for d3.select("circle").attr("opacity",value)
     * @param d the datum
     * @returns {number} the value of opacity
     */
    function getOpacity(d) {
        if (highlightTeam.indexOf(d["Team"]) >= 0) {

            return 0.8
        }
        else {
            return 0.2;
        }
    }


    // Adjust the colors of the data point when it is highlight or unhilight

    /**
     * Update the properties of the data circles on the main chart,
     * depending on whether a particular team should be highlighted or not
     * @param dataPoint the selection object of all data circles
     */
    function fillDataPointColor(dataPoint) {

        dataPoint.attr("fill", getFillColor)
            .attr("stroke", getStrokeColor)
            .attr("opacity", getOpacity);
    }



    /**
     * Draw the main chart
     * @param the feature (y-axis), e.g. 3PAPG, 3P etc., to be drawn on the figure
     * @returns {*} the selector of all data circles
     */
    function drawMainChart(featureName) {

        // Define the x- and y-scales

        var xScale = d3.scale.linear()
            .range([margin.left, chartWidth])
            .domain([d3.min(data, function (d) {
                return getFeature(d, "year");
            }), d3.max(data, function (d) {
                return getFeature(d, "year");
            })]);


        var yScale = d3.scale.linear()
            .range([chartHeight, margin.top])
            .domain([0, d3.max(data, function (d) {
                return getFeature(d, featureName);
            })
            ]);

        //
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(d3.format("{:}"));


        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        /*
        * Make x-axis on the chart.
        * If x-axis is already on the chart. Skip this step
        * */
        if (!dataDrawed) {
            d3.select("#chartContainer")
                .append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + chartHeight + ")")
                .call(xAxis);
        }



        /*
         * Make y-axis on the chart.
         * If y-axis is already on the chart. Remove it and draw new one.
         * */
        if (!dataDrawed) {

            d3.select("#chartContainer")
                .append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis);
        }
        else {
            d3.select("#chartContainer").select(".y.axis").remove();

            d3.select("#chartContainer")
                .append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(yAxis);

        }


        // Bind circles with data
        d3.select("#chartContainer")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle");


        // Set the initial behaviours of data points on the main chart
        var datapoint = d3.selectAll("circle")
            .attr("cx", function (d) {
                return xScale(d["year"]);
            })
            .attr("cy", function (d) {
                return yScale(d[featureName]);
            })
            .attr("r", 8)
            .attr("stroke-width", 2)
            .on("mouseover", function (d) {
                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", 0.8);
                tooltipDiv.html("season:" + d["year"] + "</br>" + "Team:" + d["Team"])
                    .style("left", d3.select(this).attr("cx") + "px")
                    .style("top", d3.select(this).attr("cy") + 'px');

                d3.select(this)
                    .attr("r", 10)
                    .attr("opacity", 0.8);

            })
            .on("mouseout", function () {
                tooltipDiv.transition()
                    .duration(500)
                    .attr("opacity", 0);

                d3.select(this)
                    .attr("opacity", 0.2)
                    .attr("r", 8)
            });

        fillDataPointColor(datapoint);


        // Remove the x and y label if the we are just updating the graph
        if (dataDrawed) {
            mainChartG.select("#ylabel").remove();
            mainChartG.select("#xlabel").remove();
        }

        /*
        * Make y label on the chart with its tooltip.
        * This tooltips shows the definition of the y label.
        * */
        mainChartG.append("text")
            .attr("id", "ylabel")
            .attr("transform", "rotate(-90)")
            .attr("y", 25)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(featureName + "[?]")
            .on("mouseover", function () {

                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltipDiv.html(yFeatureExp[featureName])
                    .style("left", "50"+ "px")
                    .style("top", "233" + "px");
            })
            .on("mouseout", function () {

                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);

            });

        // Make x label on the main chart
        mainChartG.append("text")
            .attr("id", "xlabel")
            .attr("y", chartHeight + 20)
            .attr("x", (chartWidth / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("season");


        dataDrawed = true;
        return datapoint;
    }

    var datapoint = drawMainChart(currentFeature);


    // Define the dimension of each team name label
    var barHeight = 20,
        barWidth = 160;

    var teamName = data.map(function (d) {
        return d["Team"];
    });

    teamName = d3.set(teamName);
    teamName.remove("League Average");
    teamName = teamName.values();


    // Plot the team-name rectangles on the left-hand side

    var chartSvgG = d3.select("#teamButtonContainer")
        .attr("width", labelWidth)
        .attr("height", labelHeight);


    // Set the color of team label rectangles
    function fillBarColor(bd, bar) {
        if (highlightTeam.indexOf(bd) < 0) {

            // Set the color when the team is de-selected
            d3.select(bar)
                .select("rect")
                .attr("fill", "white");
            d3.select(bar)
                .select("text")
                .attr("fill", teamCode[bd]["color1"]);

        }
        else {

            // Set the color when the team is selected
            d3.select(bar)
                .select("rect")
                .attr("fill", teamCode[bd]["color1"]);
            d3.select(bar)
                .select("text")
                .attr("fill", teamCode[bd]["color2"]);
        }
    }


    /* Bind the teamname-color data to the g container of each team label
     * and set its onclick call back function. When each of the container g
     * is clicked, it adds or removes the corresponded team to highlightTeam array
     * and update the chart
      */
    var bar = chartSvgG.selectAll("g")
        .data(teamName)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(" + 0 + "," + i * barHeight + ")";
        })
        .on("click", function (bd) {

            if (highlightTeam.indexOf(bd) >= 0) {
                // Remove the team from highlightTeam
                highlightTeam.splice(highlightTeam.indexOf(bd));

            }
            else {
                // Add the team into highlightTeam
                highlightTeam.push(bd);
            }


            //Update the data points in the main chart
            fillBarColor(bd, this);
            fillDataPointColor(datapoint);
        })
        ;


    // Bind the data with team-label rectangles and set their initial properties.
    bar.append("rect")
        .attr("width", barWidth)
        .attr("height", barHeight - 4)
        .attr("fill", function (d) {
            if (highlightTeam.indexOf(d) >= 0) {
                return teamCode[d]["color1"];
            }
            else {
                return "white";
            }
        })
        .attr("stroke", function (d) {
            return teamCode[d]["color2"];
        })
        .attr("stroke-width", 1);


    // Add team name text onto the team label rectangle
    bar.append("text")
        .attr("x", 3)
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .attr("fill", function (d) {
            return teamCode[d]["color1"];
        })
        .text(function (d) {
            return d;
        });



    /* Set the behavious of button in the bottom of the chart
    * (the button that selects the which feature to show on the main chart)
    */
    function updateButtonStatus(d) {
        if (d == currentFeature) {
            return "btn btn-default active";
        }
        else {
            return "btn btn-default";
        }
    }

    /* Bind the available features with the buttons in the bottom of the figures
     Details of these buttons are provided by Bootstrap framework.*/
    var bpBtnGroup = d3.select("#stat-btn-group");
    bpBtnGroup.selectAll("button")
        .data(yFeatures)
        .enter()
        .append("button")
        .attr("type", "button")
        .attr("class", updateButtonStatus)
        .attr("id", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        })
        .on("click", function (d) {
            // when clicked, update the main chart and reset currentFeature
            drawMainChart(d);
            currentFeature = d;
            bpBtnGroup.selectAll("button")
                .attr("class", updateButtonStatus);
        });

    var lavgButton = d3.select("#lavg")
        .attr("class", "btn btn-default active")
        .text("Hide League Average");

    /* Set default style of the button
    * The "League Average" is highlighted when the chart is loaded.
     */

    highlightTeam.push("League Average");

    // The color of the data points need to be updated
    // because we just added "League Average" into highlightTeam
    fillDataPointColor(datapoint);

    /*Set the style of "League Average" button based on
    whether it is already clicked or not*/
    function setlavgButtonStyle(){

        if (lavgButton.attr("class") == "btn btn-default") {
            highlightTeam.push("League Average");

            fillDataPointColor(datapoint);

            lavgButton.attr("class", "btn btn-default active")
                .text("Hide League Average");

        }
        else if (lavgButton.attr("class") == "btn btn-default active") {
            highlightTeam.splice(highlightTeam.indexOf("League Average"));


            fillDataPointColor(datapoint);

            lavgButton.attr("class", "btn btn-default")
                .text("Show League Average");

        }

    }

    lavgButton.on("click", setlavgButtonStyle);


});
