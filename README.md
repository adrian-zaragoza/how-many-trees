# How Many Trees Does This Cost?
![how-many-trees-gif](https://github.com/adrian-zaragoza/how-many-trees/blob/main/public/images/how-many-trees.gif)

## Description
How Many Trees Does This Cost? is an app that measures your personal carbon footprint based on
flights (using the number of passengers and the departure and destination airports). Interactive graphs display the carbon footprint and the number of trees needed to offset the carbon footprint. Animations also show the number of trees on the screen displayed at random places.

## Technologies Used
### Frontend
* Javascript
  * A popular programming language that allows users to implement complex features on web pages.
* D3.js
  *  To produce data visualization graphs.
* HTML/CSS

### Backend
* Carbon Interface API 
  * For carbon footprint data
* Express
  * For the API calls to Carbon Interface

### Dependencies
* Express.js
  * Web framework that lets you structure a web application to handle multiple HTTP requests at a specific URL. 
* body-parser
  * A middleware that parses data from a request object (user input).
* webpack
  * A bundler used to bundle Javascript files so the browser can use the files.

## Features

### Carbon Footprint Data Graphs
1. Challenge: Having multiple bars show in the graph for each flight without a database.
   * Solution: Used sessionStorage to save the flight details for each flight destination and to clear the flight data after the user closes the app.

### Animation of Trees
1. Challenge: Having the trees appear when clicked and disappear.
   * Solution: Built an algorithm to randomly assign a top and left pixel to the tree image. Implemented setTimeout to remove the trees after 2.5 seconds.
2. Challenge: Prevent user from clicking animation multiple times.
   * Solution: Created a flag and set it equal to true when the bar was clicked. Added a conditional on the flag to check before running the animation.


