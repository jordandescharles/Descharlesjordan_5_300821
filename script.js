let  allPhotographers = [];

fetch('data.json')
    .then((response) => {
        return response.json();
})
    .then((data) => {
        allPhotographers = data.photographers;
        displayPhotographers(allPhotographers);
});


function filterPhotograph(tag){
    //retourne un tableau 'filtré'
    let photographersFiltered = allPhotographers.filter(function(photographer){
        return photographer.tags.includes(tag);
    });
    displayPhotographers(photographersFiltered);  
}

// innerHtml ecrase les "anciennes données"
// . join('') permet de retirer les virgules de séparration des éléments des array  
// .map() permet d'eviter les boucles "tableau[i]" en créant un nouvel array

    function displayPhotographers(photographers){
        document.getElementById("photographer").innerHTML = `${photographers.map(function (photographer){
            return pageDesign(photographer)
        }).join('')}`
    }

// affichage des photographes avec Littéraux de gabarits ``
function pageDesign(card){ // attention mettre les noms en anglais
    
    return `
<article class="carte" id="${card.id}">
 <a href="${'photographer.html?id='+card.id+'&name='+card.name}"" alt="${card.name}">
        <img src="img/Photographers_ID_Photos/${card.portrait}">
        <h2 class="name">${card.name}</h2>
    </a>
    <p>
        <span class="ville">${card.city}, ${card.country} </span>
        <span class="bio">${card.tagline}</span>
        <span class="prix">${card.price}€/jour</span> 
    </p>
    <ul class="listeTag">${hashtags(card.tags)}</ul>   
</article>
` }  

function hashtags(tag){
    return `${tag.map(listeTag).join('')}`
} 
function listeTag(tag){
    return ` <li class="hashtag"><span>#</span>${tag}</li>`
}
