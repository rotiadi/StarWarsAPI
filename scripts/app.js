const menuContainer = document.querySelector('.menu-container');
const mainContainer = document.querySelector('.main-container');



// function that returns the data when calling an API
const callApi = async (urlAPI) => {

    const response = await fetch(urlAPI);

    if(response.status !== 200){
        throw new Error("Problem accesing api: " + urlAPI);
    }

    const data = await response.json();

    return data;
}

menuContainer.addEventListener('click' , (event) => {
    console.log(event.target.parentElement);
    
    if(event.target.classList.contains('menu-Item')){
        generateContext(event.target.innerHTML,  event.target.parentElement.getAttribute('urlApi'));
    }
             
    
})

const generateMeniu = async () =>{
    const myMeniu = await callApi('https://swapi.dev/api/');
    for(prop in myMeniu){
        menuContainer.innerHTML += `<div class="menuItem" id="menu-${prop.toUpperCase()}" urlApi="${myMeniu[prop]}">
        <h3 class="menu-Item">${prop.toUpperCase()}</h1>
        <span id="people-nbr"></span>
        </div>`;
    }    
}

const generateContext = async(cardType, url, nextPage ) => {
    if(!nextPage)
        mainContainer.innerHTML = "";

    const context = await callApi(url);
    if(cardType === 'PEOPLE')
        await generatePeopleCards(context);
    else {
        console.log(cardType);
        
    }
    
}

const generatePeopleCards = async (data) => {
    console.log(data)
    const nextUrl = data.next;
   
    for (let i=0; i < data.results.length; i++) {
      

        const homeWorld = await callApi(data.results[i]['homeworld']);
        const movies = await generateFilms( data.results[i]['films']);

        console.log("movies = ", movies.map(elem => elem.outerHTML.toString()).join().replaceAll(",",""))
       
        const id = i == data.results.length - 1 ? `id = "lastCard"` : "";
       

        mainContainer.innerHTML += 
            `<div class="card" ${id}}>
                <h3>${data.results[i].name}</h3>
                <div class="card-info">
                    <p>Birth Year: ${data.results[i].birth_year}</p>
                    <p>Gender: ${data.results[i].gender}</p>
                    <p>Height: ${data.results[i].height}</p>
                    <p>Mass: ${data.results[i].mass}</p>
                    <p>Skin color: ${data.results[i].skin_color}</p>
                    <p>Hair color: ${data.results[i].hair_color}</p>
                    <p>Homeworld:${homeWorld.name}</p>
                    <div class="people-films">
                        <h6>Films: </h6>
                        ${movies.map(elem => elem.outerHTML.toString()).join().replaceAll(",","")}
                    </div>
                    
                    
                </div>
             </div>`
             
             document.querySelector('#people-nbr').innerHTML = `- (${mainContainer.children.length})`;
    };   
    

    if(nextUrl){
        var waypoint = new Waypoint({
            element: document.querySelector('#lastCard'),
            handler: async function(direction) {

           
            console.log(document.querySelector('#lastCard'));
            
            if(document.querySelector('#lastCard'))
                document.querySelector('#lastCard').removeAttribute("id");  

            console.log("This is the last card: ",  nextUrl)
            this.destroy();
            await generateContext('PEOPLE', nextUrl, true);
            },
            offset: 'bottom-in-view'
        })
    }


}

const generateFilms = async (Urls) => {

    let movies = [];
       
    for(let i=0; i< Urls.length; i++){
        const name = await callApi(Urls[i]);
        const movie = document.createElement('span');
        movie.classList.add('movie-title');
        movie.setAttribute('movieLink', name.url) ;
        movie.innerText = name.title;            
        movies.push(movie)                
    }    

    return movies;
    
}


generateMeniu();

 