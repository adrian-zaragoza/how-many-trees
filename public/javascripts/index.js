const axios = require('axios');
const d3 = require("d3");


const flightCategoryPage = () =>{
    let titleEle = document.querySelector(".category-title");
    let titleText = document.createTextNode("Flight Carbon Footprint");
    titleEle.appendChild(titleText);
    
    let dataForm = document.querySelector(".carbonfootprint-form");
    dataForm.innerHTML = "<label>Number of Passengers<input type=number min=1 id='passenger-num'></label><br>"
    dataForm.innerHTML += "<p>For the airports, please use the 3-Letter Location Code for the airport found <a href='https://www.iata.org/en/publications/directories/code-search/' target='_blank'>HERE</a></p>"
    dataForm.innerHTML += "<label>Departure Airport<input type='text' placeholder='SFO' id='departure-airport'></label>"
    dataForm.innerHTML += "<label>Destination Airport<input type='text' placeholder='JFK' id='destination-airport'></label>"
    dataForm.innerHTML += "<input type='submit' value='Submit'>"

    dataForm.addEventListener('submit', sendFlightApiRequest)
}

const sendFlightApiRequest = (e) => {
    e.preventDefault();
    let numPassengers = document.getElementById('passenger-num').value;
    let departureAirport = document.getElementById('departure-airport').value;
    let destinationAirport = document.getElementById('destination-airport').value;

    axios.post('/carbonfootprint',{
        "type": "flight",
        "passengers": numPassengers,
        "legs": [{"departure_airport": departureAirport, "destination_airport": destinationAirport}, {"departure_airport": destinationAirport, "destination_airport": departureAirport}],
        "distance_unit": "mi"
        })
        .then((response) => {
            //console.log(response);
            sessionStorage.setItem(`Trip ${sessionStorage.length + 1}`, JSON.stringify(response.data.data.attributes))
            console.log("This is the session storage",sessionStorage);
            carbonfootprintChart(response.data.data.attributes);

        })
        .catch(function (error) {
            console.log(error);
        });

}

const carbonfootprintChart = () => {
    let dataArr = [];
    for(let i = 0; i < sessionStorage.length; i++){
        let trip = JSON.parse(sessionStorage.getItem(`Trip ${i + 1}`));
        dataArr.push(trip)
    }
    console.log(dataArr);
    const margin = 60;
    const width = 800 - 2 * margin;
    const height = 600 - 2 * margin;
    const svg = d3.select('svg')


    const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);
    const yScale = d3.scaleLinear().range([height, 0]).domain([0, 100]);
    chart.append('g').call(d3.axisLeft(yScale));

    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(dataArr.map((trip) => `${trip.legs[0].departure_airport} to ${trip.legs[0].destination_airport}`))
        .padding(0.2);

    chart.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));

    chart.selectAll()
        .data(dataArr)
        .enter()
        .append('rect')
        .attr('x', (s) => xScale(s))
        .attr('y', (s) => {
            if(sessionStorage.length === 0){
                return yScale(0);
            }else{
             return yScale(s.carbon_lb)
            }
        })
        .attr('height', (s) => height - (sessionStorage.length !== 0 ? yScale(s.carbon_lb) : yScale(0)))
        .attr('width', xScale.bandwidth())

}




document.addEventListener('DOMContentLoaded', () => {
    flightCategoryPage();
    carbonfootprintChart();
    console.log("I'm inside event listener")
    // axios.post('/carbonfootprint',{
    //     "type": "flight",
    //     "passengers": 2,
    //     "legs": [{"departure_airport": "sfo", "destination_airport": "yyz"}, {"departure_airport": "yyz", "destination_airport": "sfo"}]
    // })
    // .then((response) => {
    //     console.log(response); 
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });

    // let query = "grace hopper";
    // axios.get(`/search?string=${query}`)
    // .then((response) => {
    //     console.log(response);
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
    
})