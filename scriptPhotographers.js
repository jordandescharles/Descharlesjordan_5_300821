
// recupération de l'URL
var urlcourante = document.location.href; 
var url = new URL(urlcourante);
var idPhotograph = url.searchParams.get("id");
var photographerName = url.searchParams.get("name");

const modalbg = document.querySelector(".bground");

// recuperation de la data
let  photographers = [];
let  media = [];
let totalLikes= 0 ;
let price = 0;


fetch('data.json')
    .then((response) => {
        return response.json();
})
    .then((data) => {
        photographers = data.photographers;
        media = data.media;
        showPhotographer(photographers);
        showImage (media);
        modal();
        

});

// fonction qui permet de recuperer le bon photographe
function showPhotographer (photographers){
    document.getElementById("photographer").innerHTML = `${photographers.map(function (photographer){
    if (photographer.id == idPhotograph){
            return pageDesign(photographer)
        }
    }).join('')}`
   
}



function pageDesign(card){

     price = card.price;
     callPrice(price);

    return `
    <article class="carte_id" id="${card.id}">
       <div>
        <h2 id="name">${card.name}</h2>
        <button id="btnContact">Contactez-moi</button>
        <p>   
            <span id="ville">${card.city}, ${card.country} </span>
            <span id="bio">${card.tagline}</span>
        </p>        
            <ul class="listeTag">${hashtags(card.tags)}</ul></div>
        <img src="img/Photographers_ID_Photos/${card.portrait}">   
    </article>
    ` 
}   

function hashtags(tag){
    return `${tag.map(listeTag).join('')}`
} 
function listeTag(tag){
    return `<li class="hashtag"><span>#</span>${tag}</li>`
}

function callPrice(price){
    document.getElementById('price').innerHTML = price + "/jours" ;
}
    
/*
 --- --- --- ---  photos  --- --- --- ---
*/
function showImage (photos){
     document.getElementById("gallery").innerHTML = `${photos.map(function (photo){
    if (photo.photographerId == idPhotograph){
            return galleryDesign(photo)
        }
    }).join('')}`
}

function galleryDesign(card){
    
    // on en profite pour callback du total des likes car map incrémente tt seul
    totalLikes += card.likes; 
    callLikes(totalLikes)

    return `
    <article class="imgGallery" id="${card.id}">
       <img class="galleryImg" src="img/${card.photographerId}/${card.image}"> 
        <div> 
        <h2 id="name">${card.title}</h2> 
        <span id="like">${card.likes} <i class="fas fa-heart"></i></span>
        </div>
    </article>
    `}  

function callLikes (ttLikes){
    document.getElementById("ttLikes").innerHTML = ttLikes;
}

 /*
 --- --- --- ---  modal  --- --- --- ---
*/  
function launchModal() {modalbg.style.display = "block";}
function closeModal() {modalbg.style.display = "none";}
// launch modal event
function modal(){
document.getElementById("btnContact").addEventListener("click", launchModal);
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("photographerName").innerHTML= photographerName;
}
//close modal

console.log(totalLikes)
