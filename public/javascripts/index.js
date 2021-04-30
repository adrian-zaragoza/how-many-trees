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
            let graphParentEle = document.getElementById('category-chart')
            removeChildNodes(graphParentEle);
            carbonfootprintChart(response.data.data.attributes);

        })
        .catch(function (error) {
            console.log(error);
        });

}

const removeChildNodes = (parentEle)=>{
    while(parentEle.firstChild){
        parentEle.removeChild(parentEle.firstChild);
    }
}

const carbonfootprintChart = () => {
    let dataArr = [];
    for(let i = 0; i < sessionStorage.length; i++){
        let trip = JSON.parse(sessionStorage.getItem(`Trip ${i + 1}`));
        dataArr.push(trip)
    }
    console.log(dataArr);
    
    const width = 800;
    const height = 600;
    const margin = {top: 50, bottom: 50, left: 50, right: 50}

    const svg = d3.select('#category-chart')
        .append('svg')
        .attr('height', height - margin.top - margin.bottom)
        .attr('width', width - margin.left - margin.right)
        .attr('viewBox', [0, 0, width, height]);

    const x = d3.scaleBand()
        .domain(d3.range(dataArr.length))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataArr, function (dataObj){ return dataObj.carbon_lb + 10; })])
        .range([height - margin.bottom, margin.top]);
    
    //This is for the grid lines
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(${margin.left})`)
        .call(d3.axisLeft(y)
            .scale(y)
            .tickSize(-width, 0, 0)
            .tickFormat(''))
    //This is for the bars
    svg.append('g')
        .attr('fill', 'green')
        .selectAll('rect')
        .data(dataArr)
        .join('rect')
            .attr('x', (dataArr, i) => x(i))
            .attr('y', (dataArr) => y(dataArr.carbon_lb))
            .attr('height', (dataArr) => y(0) - y(dataArr.carbon_lb))
            .attr('width', x.bandwidth());

    function xAxis(g){
        g.attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(i =>{
                let dataObj = dataArr[i];
                let axisName = `${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport} `;
                return axisName;
            }))
            .attr('font-size', '12px')
    }

    function yAxis(g){
        g.attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).tickFormat(null, dataArr.format))
    }

    svg.append('g').call(yAxis);
    svg.append('g').call(xAxis);


    svg.node();



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