

fetch('data.json')
.then((response) => {
    return response.json();
})

.then((data) => {
    console.log(data.photographers[0])


// affichage des photographes avec Littéraux de gabarits ``
    function photographe(card){
        return  `
        <article id="${card.id}">
            <a href="#" alt="${card.name}">
                <img src="img/Photographers_ID_Photos/${card.portrait}">
                <h2 id="name">${card.name}</h2>
            </a>
            <p>
                <span id="ville">${card.city}, ${card.country} </span>
                <span id="bio">${card.tagline}</span>
                <span id="prix">${card.price}€/jour</span> 
            </p>
            <ul class="listeTag">${hashtags(card.tags)}</ul>   
            </article>
            `  
            function hashtags(tag){
                return `${tag.map(listeTag).join('')}`
        }
        function listeTag(tag){
            return ` 
            <li class="hashtag"><span>#</span>${tag}</li>
        `}
        }
document.getElementById("main").innerHTML = `
${data.photographers.map(photographe).join('')}  

` 

});
          
