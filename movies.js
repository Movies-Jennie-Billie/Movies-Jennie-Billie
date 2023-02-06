(function (){
    "use strict";

    const url = 'https://hollow-valiant-poultry.glitch.me/movies';
    let editMode = false;
    let editID = 0;

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
                json = sortMovies(json)
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
                    editMode = true;
                    editID = targetID;
                }
            }
        })
    }

    function setViewTarget(letter) {

        for (let i = 0; i < movies.length; i++) {
            if((movies[i].title.charAt(0)) === letter){
                const element = document.getElementById(`${movies[i].id}`);
                console.log(element)
                element.scrollIntoView();
            } else if(movies[i].title.charAt(0).localeCompare(letter) < 1){
                const element = document.getElementById(`${movies[i].id}`);
                console.log(element)
                element.scrollIntoView();
            }
        }
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

        let html = "";
        html += `<div id="${data.id}" class="card">`
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

    function sortMovies (data){
        let sortedData = data.sort((a, b) => a.title.localeCompare(b.title))
        return sortedData
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
            $('#search-bar').val('')
            let ApiUrl = `http://www.omdbapi.com/?t=${urlify(cardObj.title)}&apikey=${OMDB_API_KEY}`
            const defaultPosterImg = 'images/crying.jpg'
            let posterImgURL = defaultPosterImg;
            let result = await fetch(ApiUrl, {method: "GET"})
                .then(response => response.json())
                .catch((json) => undefined);

            if (result.Poster) {
                posterImgURL = result.Poster
            } else{
                result.Title = 'Not Found';
                result.Genre = '';
                result.Director = '';
                result.imdbRating = '';
            }

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

        function createAlphaButtonListeners(){
            let alphaArray = alpha();

            for (let i = 0; i < alphaArray.length; i++) {
                $(`#${alphaArray[i].toLowerCase()}`).click(function(){
                    console.log('clicked')
                    setViewTarget(alphaArray[i]);
                });
            }
        }

    function alpha (){
        let alphaArray = []
        let char = '';

        for (let i = 0; i < 26; i++) {
            char = String.fromCharCode(65 + i);
            alphaArray.push(char)
        }
        return alphaArray
    }

    $('#btn-search').click(async function(){
        const html = await setHtml();

        $('#modal').html(html);
        $('#modal').css('display', 'block')
        $('#dimmer').css('opacity', '.4')

        $('#modal-delete').click(function(){
            $('#modal').css('display', 'none');
            $('#dimmer').css('opacity', '1')
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
            $('#dimmer').css('opacity', '1')
        })
    });

    function urlify(title){
        title = title.replace(/\s+/g, '+');
        return title
    }

    $('#new-movie-submit').click(function(){

        let localURL = url;

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

        if(editMode){
            movieObj.id = editID;
            options.method = 'PUT';
            localURL = `${url}/${editID}`
            editMode = false;
            editID = 0;
        }

        fetch(localURL, options)
            .then(function (response){
                update()
            })
            .catch(error => console.error(error) );
        clearForm()
    })
    createAlphaButtonListeners()
})();