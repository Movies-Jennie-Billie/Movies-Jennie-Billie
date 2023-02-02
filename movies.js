(function (){
    "use strict";

    const url = 'https://brook-pale-army.glitch.me/movies';

    function getID (){
        //start at 1 and comp all until unique num found
        for (let i = 1; i < movies.length; i++) {
            if(i == movies[i].id){
                continue;
            }
            return i;
        }
    }
    //    console.log fetch
    fetch(url, {method: "GET"})
        .then(response => response.json()) /* review was created successfully */
        .then((json) => console.log(json))
        .catch( error => console.error(error) ); /* handle errors */

    //make json global and then put to getId
    let movies = undefined
    //makes cards info
    function update(){
        fetch(url, {method: "GET"})
            .then(response => response.json()) /* review was created successfully */
            // .then((json) => writeCards(json))
            .then(function(json) {
                writeCards(json)
                movies = json
            })
            .catch(error => console.error(error) ) /* handle errors */
            .finally(function(){
                    $("#loading-img").css("display", "none")
            })
    }


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
                if((data[i].id) === targetID){
                    deleteCard(data[i]);

                }
            }
        })

    }

    function deleteCard(card){
        let targetID = card.id
        console.log(card);
        fetch(`${url}/${targetID}`, {method: "DELETE"})
            .then(response => update());
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
    // $(document).ready(function() {
    //     $("#loading-img").css("display", "none")
    // })
    update()



    $('#new-movie-submit').click(function(){
        // e.preventDefault()
        const movieObj = {
            id: movies.length + 1,
            title: $('#title').val(),
            rating: $('#rating').val(),
            director: $('#director').val(),
            genre: $('#genre').val()
        };
        console.log(movieObj)
        const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieObj),
            };
        // console.log(options)
        fetch(url, options)
            .then(function (response){
                console.log("hey")
                update()
            })
            .catch(error => console.error(error) );

    })

})();