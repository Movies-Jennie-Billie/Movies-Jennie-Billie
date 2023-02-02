(function (){
    "use strict";
    console.log("yay")

    function createMovie(){
        const movieObj = {
            id: 7,
            title: 'yay',
            rating: 4,
            genre: "sci-fi"
        };
    }

    // const url = 'https://brook-pale-army.glitch.me/movies';
    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(movieObj),
    // };
    // // fetch(url, options)
    // //     .then( response => response.json()) /* review was created successfully */
    // //     .then((json) => console.log(json))
    // //     .catch( error => console.error(error) )
    // fetch(url, {method: "GET"})
    //     .then( response => response.json()) /* review was created successfully */
    //     .then((json) => console.log(json))
    //     .catch( error => console.error(error) ); /* handle errors */

    function createCard(){
        let html = "";
        html += `<div className="card" style="width: 15rem;">`
        html += `<img src="images/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg" 
                class="card-img-top" alt="...">`
        html += `<div class="card-body">`
        html += `<h5 class="card-title">Card title</h5>`
        html += `<p class="card-text">Some quick example text to build on the card title and make up the bulk the card's content.</p>`
        html += `<a href="#" class="btn btn-primary">Go somewhere</a>`
        html+= `</div> </div>`
        console.log(html)
        return html
    }
    $("#movie-cards").html(createCard())


})();