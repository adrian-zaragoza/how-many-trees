const axios = require('axios');
// axios.defaults.headers.common = {'Authorization': 'Bearer DoRWhU2QqYwELzPyS10VQ'}
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// const sslRootCAs = require('ssl-root-cas/latest')
// sslRootCAs.inject()


document.addEventListener('DOMContentLoaded', () => {
    console.log("I'm inside event listener")
    axios.post('/carbonfootprint',{
        "type": "flight",
        "passengers": 2,
        "legs": [{"departure_airport": "sfo", "destination_airport": "yyz"}, {"departure_airport": "yyz", "destination_airport": "sfo"}]
    })
    .then((response) => {
        console.log(response); 
    })
    .catch(function (error) {
        console.log(error);
    });

    // let query = "grace hopper";
    // axios.get(`/search?string=${query}`)
    // .then((response) => {
    //     console.log(response);
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
    
})