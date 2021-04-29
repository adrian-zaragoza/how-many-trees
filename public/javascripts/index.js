const axios = require('axios');


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
            console.log(response); 
        })
        .catch(function (error) {
            console.log(error);
        });

}













document.addEventListener('DOMContentLoaded', () => {
    flightCategoryPage();
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