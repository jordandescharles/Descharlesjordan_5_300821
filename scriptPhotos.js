// recupération de l'URL
var urlcourante = document.location.href; 
var url = new URL(urlcourante);
var idPhotograph = url.searchParams.get("id");
console.log(idPhotograph);

// recuperation de la data
let  photos = [];

fetch('data.json')
    .then((response) => {
        return response.json();
})
    .then((data) => {
        photos = data.media;
        showPhotographer(photos);
     
});


// fonction qui permet de recuperer le bon photographe
function showPhotographer (p){
    console.log(p) 
     /* document.getElementById("gallery").innerHTML = `${photographers.map(function (photo){
    if (p.id == idPhotograph){
            return galleryDesign(photo)
        }
    }).join('')}`*/
}

function galleryDesign(card){
    console.log(card.id)
    return `
    <article class="imgGallery" id="${card.id}">
       <img src="img/${card.photographerId}/${card.image}"> 
        <h2 id="name">${card.tittle}</h2> 
        <p>   
            <span id="ville">${card.city}, ${card.country} </span>
            <span id="bio">${card.tagline}</span>
        </p>
        
            <ul class="listeTag">${hashtags(card.tags)}</ul>
            </div>
           
         
    </article>
    ` }  
    
   
   


