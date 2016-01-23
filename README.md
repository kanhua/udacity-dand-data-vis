# Data Visualization: The evolution of three-point field goals in the NBA

Visualization page: [http://kanhua.github.io/udacity-dand-data-vis/](http://kanhua.github.io/udacity-dand-data-vis/)

## Summary
Basketball fans may be aware that NBA teams are shooting more and more three-point field goals. 
The project aims to visualize the trend the evolution of three-pointers in the NBA. This visualization allows users to explore and compare a number of 3-pointer statistics of each NBA team since 1990. 

#### Background information
In a basketball game, you typically get two points or three points when you shot the ball into the hoop, which is called as a "field goal". You can get three points if you shot behind the three-point line, which is around 23 feet from the hoop. The history and evolution of three-point lines can be found in this [wiki article](https://en.wikipedia.org/wiki/Three-point_field_goal).

## Design
This visualization presents some offense statistics of each team from 1990 to 2016. The users are able to select which team team to plotted on the main chart.

#### V0
The initial version was made by modifying [this example](http://dimplejs.org/advanced_examples_viewer.html?id=advanced_storyboard_control) provided on dimple.js official website.

<img src="./chart_snapshot/v0-snapshot.png" width="70%">

According to the feedback, I want to add the following features:

1. The statstics of the selected team can be compared with all the NBA teams.
2. The color codes of each team can be consistent to the NBA teams. 

Since these features cannot be implemented by the APIs of dimple.js, we turned back to D3 and started from scratch.

#### V1
Improvements in this version:
- This version allows the users to highlight the teams that they are interested in and compare it with other teams.
- The users can also select the metrics (3PAPG, 3P, 3P\%) shown on the plot by pressing the red buttons below the chart.
- The colors of each team are set to be consistent with the color codes of NBA teams.
<img src="./chart_snapshot/v1-snapshot.png" width="70%">

The feedback of this version includs the layout 


#### V2
Major changes in this version:
- Use [Boostrap](http://getbootstrap.com) to rearrange the layout.
- Replace the red rectangle buttons in V1 by Bootstrap buttons.
- Add title, background information, and discussions in the figure.
- Add tooltips for the data points.
<img src="./chart_snapshot/v2-snapshot.png" width="70%">



#### V3 (the current version)
Major changes of this version:
- The background information and explaination are enhanced.
- A tooltip is added to the y-axis so that users can quickly check the definition of each metrics
- A new button is placed to let the user show the "League Average".
- Minor revisions of the layout and texts.

<img src="./chart_snapshot/v3-snapshot.png" width="70%">


## Feedback

#### Comments for V0:
- It would be good to see how the statics of a single team compared with other teams.=
- The chart will be more attractive to NBA fans if the colors of each team in the figure can match the color codes of NBA teams.


#### Comments for V1:
- The users need some explainatin of what the metrics 3PAPG, 3PA and 3P represent.
- The red button below the chart does not look very good. 


#### Comments for V2:
The original version of comments for this version can be found on [this post](https://discussions.udacity.com/t/project-6-the-evolution-of-three-pointers-in-the-nba/44016) or this [backup version](./feeback_charlie.md).





## Resources
- Source of data: [basketball-reference.com](http://basketball-reference.com)
- Color codes of team: [Team Color Codes](http://teamcolorcodes.com)
- Basketball court chart: [Basketball diagrams](http://li16-138.members.linode.com/sportsdiagrams/BasketballDiagrams.html) 
