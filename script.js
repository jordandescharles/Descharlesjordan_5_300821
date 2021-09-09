

fetch('data.json')
.then((response) => {
    return response.json();
})

.then((data) => {
// affichage des photographes avec Littéraux de gabarits ``
 // .map() permet d'eviter les boucles "tableau[i]" en créant de nouveaux arrays3
 // . join('') permet de retirer les virgules de séparration des éléments des array
document.getElementById("main").innerHTML = `
    ${data.photographers.map(photographe).join('')} ` 

});
function photographe(card){
    return  `
     <article class="carte" id="${card.id}">
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
 }
function hashtags(tag){
    return `${tag.map(listeTag).join('')}`
        }
                 
function listeTag(tag){
    return ` 
        <li class="hashtag"><span>#</span>${tag}</li>
    `
}

