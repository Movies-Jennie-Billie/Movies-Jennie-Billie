(function (){
    "use strict";

    function createMovie(){
        const movieObj = {
            id: 7,
            title: 'yay',
            rating: 4,
            director: "Jimbobyo",
            genre: "sci-fi"
        };
        return movieObj
    }

    const url = 'https://brook-pale-army.glitch.me/movies';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(createMovie()),
    };
    fetch(url, options)
        .then(response => response.json()) /* review was created successfully */
        .then((json) => json)
        .catch(error => console.error(error) );

    fetch(url, {method: "GET"})
        .then(response => response.json()) /* review was created successfully */
        .then((json) => console.log(json))
        .catch( error => console.error(error) ); /* handle errors */

    fetch(url, {method: "GET"})
        .then(response => response.json()) /* review was created successfully */
        .then((json) => writeCards(json))
        .catch(error => console.error(error) ); /* handle errors */

    function writeCards(data){
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += createCard(data[i]);
        }
        $("#movie-cards").html(html)

        $('.my-btn-delete').click(function(){

            //    get button id and get matching card id
            let targetID = parseInt($(this).attr("data-id"))
            for (let i = 0; i < data.length; i++) {
                if((i) === targetID){
                    deleteCard(data[i]);
                    console.log('true')
                } else {
                    console.log('false')
                    console.log(`i: ${i}`)
                    console.log(`targetID: ${targetID}`)
                }

            }
            //    get whole card

            //    then send card to deleteCard
        })
    }

    function createCard(data){
        let html = "";
        html += `<div class="card" style="width: 15rem;">`
        html += `<img src="images/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg" 
                class="card-img-top" alt="...">`
        html += `<div class="card-body">`
        html += `<h5 class="card-title">${data.title}</h5>`
        html += `<div class="card-text">`
        html += `<ul>`
        html += `<li>Rating: ${data.rating}</li>`
        html += `<li>Director: ${data.director}</li>`
        html += `<li>Genre: ${data.genre}</li>`
        html += `</ul>`
        html += `</div>`
        html += `<button type="button" data-id="${data.id}" class="btn my-btn-delete btn-primary">Delete</button>`
        html+= `</div> </div>`

        return html
    }
    //
    // fetch(url, {method: "GET"})
    //     .then(response => response.json()) /* review was created successfully */
    //     .then((json) => deleteCard(json[5]))
    //     .catch(error => console.error(error) ); /* handle errors */
    //
    function deleteCard(card){
        let targetID = card.id
        console.log(card);
        fetch(`${url}/${targetID}`, {method: "DELETE"})
        .then(response => response.json())
    }



})();