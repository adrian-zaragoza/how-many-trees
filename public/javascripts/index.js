const axios = require('axios');
const d3 = require("d3");


const flightCategoryPage = () =>{
    let titleEle = document.querySelector(".category-title");
    let titleText = document.createTextNode("Flight Carbon Footprint");
    titleEle.appendChild(titleText);
    
    let dataForm = document.querySelector(".carbonfootprint-form");
    dataForm.innerHTML = "<label>Number of Passengers<input type=number min=1 id='passenger-num'></label>"
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
            console.log(response.data.data.attributes)
            sessionStorage.setItem(`${response.data.data.attributes.legs[0].departure_airport} to ${response.data.data.attributes.legs[0].destination_airport}`, JSON.stringify(response.data.data.attributes))
            let graphParentEle = document.getElementById('category-chart')
            removeChildNodes(graphParentEle);
            carbonfootprintChart();

        })
        .catch(function (error) {
            //console.log(error);
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
        let key = sessionStorage.key(i);
        let trip = JSON.parse(sessionStorage.getItem(key));
        dataArr.push(trip)
    }

    console.log(dataArr)
    
    const width = 500;
    const height = 300;
    const margin = 50;

    const svg = d3.select('#category-chart').append('svg');
    const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);
    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(dataArr.map((dataObj)=>`${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport}`))
        .padding(0.5)
    
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(dataArr, function (dataObj){ return dataObj.carbon_lb + 10; })])
    
    const makeYLines = () => d3.axisLeft().scale(yScale);
    
    chart.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));
    chart.append('g').call(d3.axisLeft(yScale));
    
    chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
    .tickSize(-width, 0, 0)
    .tickFormat('')
    )
    
    const barGroup = chart.selectAll()
    .data(dataArr)
    .enter()
    .append('g')
    
    barGroup
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (dataObj) => xScale(`${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport}`))
    .attr('y', (dataArr) => yScale(dataArr.carbon_lb))
    .attr('height', (dataArr) => height - yScale(dataArr.carbon_lb))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function(bar, i){
        
        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.5)
          .attr('x', (dataObj) => xScale(`${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport}`) - 10)
          .attr('width', xScale.bandwidth() + 20)
    })

    barGroup.on('mouseenter', function(bar, i){
        d3.select(this).select('.value').attr('opacity', 0)
        d3.select(this)
            .append('text')
            .attr('class', 'additional-values')
            .attr('x', (dataObj) =>  xScale(`${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport}`) + xScale.bandwidth() / 2)
            .attr('y', (dataObj) => yScale(dataObj.carbon_lb) - 40)
            .attr('text-anchor', 'middle')
            .text((dataObj) => `${dataObj.carbon_lb} lbs`)

        d3.select(this)
            .append('text')
            .attr('class', 'additional-values')
            .attr('x', (dataObj) =>  xScale(`${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport}`) + xScale.bandwidth() / 2)
            .attr('y', (dataObj) => yScale(dataObj.carbon_lb) - 30)
            .attr('text-anchor', 'middle')
            .text((dataObj) => `${dataObj.carbon_g} g`)

        d3.select(this)
            .append('text')
            .attr('class', 'additional-values')
            .attr('x', (dataObj) =>  xScale(`${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport}`) + xScale.bandwidth() / 2)
            .attr('y', (dataObj) => yScale(dataObj.carbon_lb) - 20)
            .attr('text-anchor', 'middle')
            .text((dataObj) => `${dataObj.carbon_kg} kg`)

         d3.select(this)
            .append('text')
            .attr('class', 'additional-values')
            .attr('x', (dataObj) =>  xScale(`${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport}`) + xScale.bandwidth() / 2)
            .attr('y', (dataObj) => yScale(dataObj.carbon_lb) - 10)
            .attr('text-anchor', 'middle')
            .text((dataObj) => `${dataObj.carbon_mt} mt`)

        d3.select(this)
            .append('text')
            .attr('class', 'additional-values')
            .attr('x', (dataObj) =>  xScale(`${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport}`) + xScale.bandwidth() / 2)
            .attr('y', (dataObj) => yScale(dataObj.carbon_lb))
            .attr('text-anchor', 'middle')
            .text((dataObj) => `${dataObj.passengers} pax`)

    })
    
    barGroup 
    .append('text')
    .attr('class', 'value')
    .attr('x', (dataObj) =>  xScale(`${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport}`) + xScale.bandwidth() / 2)
    .attr('y', (dataObj) => yScale(dataObj.carbon_lb) + 30)
    .attr('text-anchor', 'middle')
    .text((dataObj) => `${dataObj.carbon_lb}`)
    
    svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', 11)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Carbon Footprint in LBS')
    
    svg
    .append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Roundtrip Flight Destinations')
    
    // const svg = d3.select('#category-chart')
    //     .append('svg')
    //     .attr('height', height - margin.top - margin.bottom)
    //     .attr('width', width - margin.left - margin.right)
    //     .attr('viewBox', [0, 0, width, height]);
    
    // const x = d3.scaleBand()
    //     .domain(d3.range(dataArr.length))
    //     .range([margin.left, width - margin.right])
    //     .padding(0.2);
    
    // const y = d3.scaleLinear()
    //     .domain([0, d3.max(dataArr, function (dataObj){ return dataObj.carbon_lb + 10; })])
    //     .range([height - margin.bottom, margin.top]);
    
    // //This is for the grid lines
    // svg.append('g')
    //     .attr('class', 'grid')
    //     .attr('transform', `translate(${margin.left})`)
    //     .call(d3.axisLeft(y)
    //         .scale(y)
    //         .tickSize(-width, 0, 0)
    //         .tickFormat(''))

    // //This is for the bars
    // const barGroup = svg.append('g')
    //     .attr('fill', 'green')
    //     .selectAll('rect')
    //     .data(dataArr)
    //     .join('rect')
    //         .attr('x', (dataArr, i) => x(i))
    //         .attr('y', (dataArr) => y(dataArr.carbon_lb))
    //         .attr('height', (dataArr) => y(0) - y(dataArr.carbon_lb))
    //         .attr('width', x.bandwidth())
    //         .attr('class', 'bar')
    //         .on('mouseenter', function (actual, i) {
    //             d3.selectAll('.bar')
    //             .attr('opacity', 0)

    //   })

    // Trying to add the carbon lb value to the bar
    // barGroup.append('g')
    //     .append('text')
    //     .attr('class', 'carbon-lbs')
    //     .attr('x', (dataObj, i) => x(i))
    //     .attr('y', (dataObj) => y(dataObj.carbon_lb))
    //     .attr('text-anchor', 'middle')
    //     .text((dataObj) => `${dataObj.carbon_lb}lbs`)

    // function xAxis(g){
    //     g.attr('transform', `translate(0, ${height - margin.bottom})`)
    //         .call(d3.axisBottom(x).tickFormat(i =>{
    //             let dataObj = dataArr[i];
    //             let axisName = `${dataObj.legs[0].departure_airport} to ${dataObj.legs[0].destination_airport}`;
    //             return axisName;
    //         }))
    //         .attr('font-size', '8px')
    // }

    // function yAxis(g){
    //     g.attr('transform', `translate(${margin.left}, 0)`)
    //         .call(d3.axisLeft(y).tickFormat(null, dataArr.format))
    //         .attr('font-size', '8px')
    // }

    // svg.append('g').call(yAxis);
    // svg.append('g').call(xAxis);

    //Y-axis label
    // svg.append('text')
    //     .attr('x', -(height / 2))
    //     .attr('y', (margin.left - 10) / 2.4)
    //     .attr('transform', 'rotate(-90)')
    //     .attr('text-anchor', 'middle')
    //     .text('Carbon Footprint in lbs')
    //     .attr('font-size', '11px')

    //X-axis label
//   svg.append("text")             
//       .attr("transform", `translate(${width / 2}, ${height - 20})`)
//       .style("text-anchor", "middle")
//       .text("Roundtrip Flight Destinations")
//       .attr('font-size', '11px')

    //Chart tile label
    // svg.append('text')
    //     .attr('x', width / 2 + margin.bottom)
    //     .attr('y', 40)
    //     .attr('text-anchor', 'middle')
    //     .text('Rountrip Flights Carbon Footprint')
    //     .attr('font-size', '17px')


    return svg.node();



}



document.addEventListener('DOMContentLoaded', () => {
    flightCategoryPage();
    carbonfootprintChart();
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