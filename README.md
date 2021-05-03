# How Many Trees Does This Cost?
## Description
How Many Trees Does This Cost? is an app that measures your personal carbon footprint based on
flights(based on the number of passengers and the to and from airports).Interactive graphs display the carbon footprint and the number of trees needed to offset the carbon footprint. 
Animations show the number of trees on the screen.

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
  * for the API calls

### Dependencies
* Express.js
  * Web framework that lets you structure a web application to handle multiple HTTP requests at a specific URL. 
* body-parser
  * A middleware that parses data from a request object (user input).
* webpack
  * A bundler used to bundle Javascript files so the browser can use the files.

## Features

# Carbon Footprint Data Graphs
1. Challenge: Having multiple bars show in the graph for each flight.
   * Solution: Used sessionStorage to save the flight details for each flight destination and to clear the flight data after the user closes the app.
![image](https://user-images.githubusercontent.com/77212035/116846490-3b6ac400-ab9d-11eb-9340-7768e54dc359.png)

