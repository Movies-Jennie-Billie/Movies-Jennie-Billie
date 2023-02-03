(function (){
    "use strict";

    const url = 'https://brook-pale-army.glitch.me/movies';

    function getID (){
        //start at 1 and comp all until unique num found
        let ids = []
        for (let i = 0; i < movies.length; i++) {
            ids.push(movies[i].id);
        }
        for (let i = 1; i <= movies.length; i++) {
            if(!ids.includes(i)){
                return i;
            }
        }
        return movies.length+1
    }
    //    console.log fetch
    fetch(url, {method: "GET"})
        .then(response => response.json()) /* review was created successfully */
        .then((json) => console.log(json))
        .catch(error => console.error(error) ); /* handle errors */

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


        async function writeCards(data){
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += await createCard(data[i]);
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

        $(".my-btn-edit").click(function (){
            let targetID = parseInt($(this).attr("data-id"))
            for (let i = 0; i < data.length; i++) {
                if((data[i].id) === targetID){
                    $('#title').val(data[i].title),
                    $('#rating').val(data[i].rating),
                    $('#director').val(data[i].director),
                    $('#genre').val(data[i].genre)
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

        async function createCard(data){
        const defaultPosterImg = 'images/defaultPoster.jpg'
        let posterImgURL = defaultPosterImg
        function urlify(title){
            title = title.replace(/\s+/g, '+');
            return title
        }
        let ApiUrl = `http://www.omdbapi.com/?t=${urlify(data.title)}&apikey=${OMDB_API_KEY}`
        posterImgURL = await fetch(ApiUrl, {method: "GET"})
            .then(response => response.json())
            .then((json) => {
                if(!json.Poster){
                    return defaultPosterImg
                } else{
                    return json.Poster
                }
            })
            .catch((json) => defaultPosterImg);

        //attempt to set img equal to that src
        //if it fails, use default img

        let html = "";
        html += `<div class="card">`
        html += `<img src="${posterImgURL}" class="card-img-top" alt="Movie Poster">`
        html += `<div class="card-body">`
        html += `<h5 class="card-title">${data.title}</h5>`
        html += `<div class="card-text">`
        html += `<ul>`
        html += `<li>Rating: ${data.rating}</li>`
        html += `<li>Director: ${data.director}</li>`
        html += `<li>Genre: ${data.genre}</li>`
        html += `</ul>`
        html += `</div>`
        html += `<button type="button" data-id="${data.id}" class="btn my-btn-delete btn-danger"><i class="fa-solid fa-trash"></i></button>`
        html += `<button type="button" data-id="${data.id}" class="btn my-btn-edit btn-success"><i class="fa-solid fa-pen-to-square"></i></button>`
        html+= `</div> </div>`

        return html
    }



    update()

    function clearForm(){
            $('#title').val(""),
            $('#rating').val(""),
            $('#director').val(""),
            $('#genre').val("")

    }

        async function setHtml() {
            const cardObj = {
                title: $('#search-bar').val()
            }
            let ApiUrl = `http://www.omdbapi.com/?t=${urlify(cardObj.title)}&apikey=${OMDB_API_KEY}`
            const defaultPosterImg = 'images/defaultPoster.jpg'
            let posterImgURL = defaultPosterImg;
            let result = await fetch(ApiUrl, {method: "GET"})
                .then(response => response.json())
                .catch((json) => undefined);

            if (result.Poster) {
                posterImgURL = result.Poster
            }

            let newId = getID()

            let html = "";
            html += `<div class="card">`
            html += `<img id="new-card-poster" src="${posterImgURL}" class="card-img-top" alt="Movie Poster">`
            html += `<div class="card-body">`
            html += `<h5 id="new-card-title" class="card-title">${result.Title}</h5>`
            html += `<div class="card-text">`
            html += `<ul>`
            html += `<li id="new-card-rating">${result.imdbRating}</li>`
            html += `<li id="new-card-director">${result.Director}</li>`
            html += `<li id="new-card-genre">${result.Genre}</li>`
            html += `</ul>`
            html += `</div>`
            html += `<button type="button" id="modal-delete" class="btn my-btn-delete btn-danger"><i class="fa-solid fa-trash"></i></button>`
            html += `<button type="button" id="modal-accept" class="btn my-btn-edit btn-success"><i class="fa-regular fa-thumbs-up"></i></button>`
            html += `</div> </div>`

            return html
        }


    $('#btn-search').click(async function(){
        const html = await setHtml();

        $('#modal').html(html);
        $('#modal').css('display', 'block')

        $('#modal-delete').click(function(){
            $('#modal').css('display', 'none');
        })

        $('#modal-accept').click(function(){
            const newCard = {
                id: getID(),
                title: $('#new-card-title').text(),
                rating: $('#new-card-rating').text(),
                director: $('#new-card-director').text(),
                genre: $('#new-card-genre').text()
            }

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCard),
            };

            fetch(url, options)
                .then(function (response){
                    update()
                })
                .catch(error => console.error(error) );

            $('#modal').css('display', 'none');
        })
    });

    function urlify(title){
        title = title.replace(/\s+/g, '+');
        return title
    }

    $('#new-movie-submit').click(function(){
        const movieObj = {
            id: getID(),
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

        fetch(url, options)
            .then(function (response){
                update()
            })
            .catch(error => console.error(error) );
        clearForm()
    })
})();