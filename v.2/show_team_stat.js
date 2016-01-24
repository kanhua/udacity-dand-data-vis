/**
 *
 * Created by kanhua on 1/10/16.
 */


function getFeature(d, feature_name) {
    return d[feature_name];
}

d3.csv("./agg_team_stat.csv", function (d) {
    d["3P"] = +d["3P"];
    d["3PA"] = +d["3PA"];
    d["year"] = +d["year"];
    d["G"] = +d["G"];
    d["3PAPG"] = +d["3PAPG"];
    d["3P%"]=+d["3P%"];
    return d;
}, function (data) {




    var margin = {"top": 15, "bottom": 25, "left": 75, "right": 75},
        svg_width = 700,
        svg_height = 600,
        chart_width = svg_width - margin.left,
        chart_height = svg_height - margin.right,
        label_width = 150;
    y_stat_start = 0;
    label_height = svg_height;


    var main_chart_g = d3.select("#chartContainer")
        .attr("width", svg_width)
        .attr("height", svg_height)
        .append("g")
        .attr('class', 'chart');


    var highlightTeam = [];
    var currentFeature="3PAPG";

    var tooltipDiv=d3.select("#chartDiv")
        .append("div")
        .attr("class","tooltip")
        .style("opacity",0);


    function getFillColor(d) {
        if (highlightTeam.indexOf(d["Team"]) >= 0) {

            return teamCode[d["Team"]]["color1"];
        }
        else {
            return "grey";
        }
    }

    function getStrokeColor(d) {

        if (highlightTeam.indexOf(d["Team"]) >= 0) {

            return teamCode[d["Team"]]["color2"];
        }
        else {
            return "grey";
        }
    }

    function getOpacity(d) {
        if (highlightTeam.indexOf(d["Team"]) >= 0) {

            return 0.8
        }
        else {
            return 0.2;
        }
    }


    function fillDataPointColor(dataPoint) {

        dataPoint.attr("fill", getFillColor)
            .attr("stroke", getStrokeColor)
            .attr("opacity", getOpacity);
    }

    // a flag that determines whether the elements have already drawed
    var data_drawed = false;

    function drawMainChart(featureName) {


        var dataPointRadius = 8;

        var x_scale = d3.scale.linear()
            .range([margin.left, chart_width])
            .domain([d3.min(data, function (d) {
                return getFeature(d, "year");
            }), d3.max(data, function (d) {
                return getFeature(d, "year");
            })]);


        var y_scale = d3.scale.linear()
            .range([chart_height, margin.top])
            .domain([0, d3.max(data, function (d) {
                return getFeature(d, featureName);
            })
            ]);


        var x_axis = d3.svg.axis()
            .scale(x_scale)
            .orient("bottom")
            .tickFormat(d3.format("{:}"));


        var y_axis = d3.svg.axis()
            .scale(y_scale)
            .orient("left");


        if (!data_drawed) {
            d3.select("#chartContainer")
                .append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + chart_height + ")")
                .call(x_axis);
        }


        if (!data_drawed) {

            d3.select("#chartContainer")
                .append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(y_axis);
        }
        else {
            d3.select("#chartContainer").select(".y.axis").remove();

            d3.select("#chartContainer")
                .append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(y_axis);

        }


        d3.select("#chartContainer")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle");


        var datapoint = d3.selectAll("circle")
            .attr("cx", function (d) {
                return x_scale(d["year"]);
            })
            .attr("cy", function (d) {
                return y_scale(d[featureName]);
            })
            .attr("r", dataPointRadius)
            .on("mouseover",function(d)
            {
               debugger;
                tooltipDiv.transition()
                   .duration(200)
                   .style("opacity",9);
                tooltipDiv.html(d["Team"])
                    .style("left",d3.select(this).attr("cx")+"px")
                    .style("top",d3.select(this).attr("cy")+'px');
            })
            .on("mouseout",function(d){
                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity",0);
            });

        fillDataPointColor(datapoint);


        if (data_drawed) {
            main_chart_g.select("#ylabel").remove();
            main_chart_g.select("#xlabel").remove();
        }

        // Make y axis on the main chart
        main_chart_g.append("text")
            .attr("id", "ylabel")
            .attr("transform", "rotate(-90)")
            .attr("y", 30)
            .attr("x", 0 - (chart_height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(featureName);

        // Make x axis on the main chart
        main_chart_g.append("text")
            .attr("id", "xlabel")
            .attr("y", chart_height + 20)
            .attr("x", (chart_width / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("year");


        data_drawed = true;
        return datapoint;
    }

    var datapoint = drawMainChart(currentFeature);


    var barHeight = 20,
        barWidth = 150;

    var team_name = data.map(function (d) {
        return d["Team"];
    });

    team_name = d3.set(team_name);
    team_name.remove("League Average");
    team_name = team_name.values();

    var chart_svgg = d3.select("#teamButtonContainer")
        .attr("width", label_width)
        .attr("height", label_height);


    function fillBarColor(bd, bar) {
        if (highlightTeam.indexOf(bd) < 0) {
            d3.select(bar)
                .select("rect")
                .attr("fill", "white");
            d3.select(bar)
                .select("text")
                .attr("fill", teamCode[bd]["color1"]);

        }
        else {
            d3.select(bar)
                .select("rect")
                .attr("fill", teamCode[bd]["color1"]);
            d3.select(bar)
                .select("text")
                .attr("fill", teamCode[bd]["color2"]);
        }
    }


    var bar = chart_svgg.selectAll("g")
        .data(team_name)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(" + 0 + "," + i * barHeight + ")";
        })
        .on("click", function (bd) {

            if (highlightTeam.indexOf(bd) >= 0) {
                highlightTeam.splice(highlightTeam.indexOf(bd));

            }
            else {
                highlightTeam.push(bd);
            }


            fillBarColor(bd, this);

            fillDataPointColor(datapoint);
        })
        ;


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





    // Place the buttons for selecting different statistics
    var yFeatures = ["3PAPG", "3PA", "3P","3P%"];

    function updateButtonStatus(d)
    {
       if (d==currentFeature){
           return "btn btn-default active";
       }
        else{
          return "btn btn-default";
       }
    };


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
            drawMainChart(d);
            currentFeature=d;
            bpBtnGroup.selectAll("button")
                .attr("class",updateButtonStatus);
        });


});
