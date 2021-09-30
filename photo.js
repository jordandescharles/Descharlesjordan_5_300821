// recupération de l'URL
const urlcourante = document.location.href;
const url = new URL(urlcourante);
const idURL = url.searchParams.get("id");
const photographerName = url.searchParams.get("name");
// CONST
const modalbg = document.querySelector(".bground");
// recuperation de la data
var photographers = [];
var media = [];
var totalLikes = 0;
var price = 0;
var arrayPhotos = [];
var indexPhoto = 0;
var PhotographMedias = [];
var keys=false;

fetch('data.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        photographers = data.photographers;
        media = data.media;
        showPhotographer(photographers);
        pushMedia(media)
        showImage(PhotographMedias);
        modal();
    });

// PHOTOGRAPHE  -----------------------------------------------------------------------------------------------
// Recupere le bon photographe 
// Affiche la carte du photographe

const showPhotographer = (photographers) => {
    document.getElementById("photographer").innerHTML = 
    `${photographers.map(photographer => {
         if (photographer.id == idURL) { 
             return pageDesign(photographer) }}).join('')}`
}
const pageDesign = (card) => {
    document.getElementById('price').innerHTML = `${card.price}€/jours`; 
    return `
    <article class="carte_id" id="${card.id}">
       <div>
        <h1 class="name">${card.name}</h1>
        <button id="btnContact">Contactez-moi</button>
        <p>   
            <span class="ville">${card.city}, ${card.country} </span>
            <span class="bio">${card.tagline}</span>
        </p>        
        <ul class="listeTag">${hashtags(card.tags)}</ul></div>
        <div class="imgPhotographe">   
            <img src="img/Photographers_ID_Photos/${card.portrait}" alt="${card.name}">  
        </div>  
    </article>
    `
}
// map des tags vers listeTag
const hashtags = (tags) => {
    return `${tags.map(listeTag).join('')}`
}
// met chaque tag dasn une Li
const listeTag = (tag) => {
    return `<li class="hashtag"><span>#</span>${tag}</li>`
}

// FACTORY -----------------------------------------------------------------------------------------------
// Permet de séparer images et vidéos.
// Retire les infos inutiles ex: price.
// uniformise les objets du JSON => "video" et "image" deviennent media

class Video {
    constructor(id, photographerId, title, video, likes, date, alt) {
        this.id=id, this.photographerId=photographerId, this.title=title, this.likes=likes, this.date=date,
        this.media=video, this.alt=alt, this.type="mp4", this.likedBefore='false'}
}
class Image {
    constructor(id, photographerId, title, image, likes, date, alt) {
        this.id=id, this.photographerId=photographerId, this.title=title, this.likes=likes, this.date=date,
        this.media=image, this.alt=alt, this.type="jpg", this.likedBefore='false'}
}
 
// FACTORY - avant return check si video est null, pour savoir si c'est c'est une image ou une vidéo
const MediaFactoryMethod = { 
    makeMedia(id, photographerId, title, image, likes, date, video, alt) {
            if (video == null) {return new Image(id, photographerId, title, image, likes, date, alt);}
            else {return new Video(id, photographerId, title, video, likes, date, alt);}
    }
}
// fonction qui recupèere les données du JSON fourni les infos à la factory
const pushMedia = (media) => { for (const i in media) {
    if (media[i].photographerId == idURL) {
        PhotographMedias.push(MediaFactoryMethod.makeMedia(
            media[i].id, media[i].photographerId, media[i].title, 
            media[i].image, media[i].likes, media[i].date, media[i].video, media[i].alt))    
        }
}}

// LIKES -----------------------------------------------------------------------------------------------
// Affiche le nombre de likes sur la page
const callLikes = (ttLikes) => { document.getElementById("ttLikes").innerHTML = ttLikes;}

 // Se lance au clic sur un petit coeur et recupere le nb de likes et l'id de l'image
 // recupere l'index ou se situe l'image likée 
 // ecrase la valeur des likes avec likes+1 suite au click sur le coeur 
 // ajoute le parametre likedBefore a l'objet pour eviter de pouvoir reliker une photo apres un tri 
 // la derniere ligne permet de desactiver le click du like, on ne peut liker qu'une fois
const incrementLikes = (likes, id) => {
    likes++;
    document.getElementById(id).innerHTML = `${likes} <i class="fas fa-heart"></i> `;
    const index = PhotographMedias.map(e => { return e.id; }).indexOf(id);
    PhotographMedias[index].likes = likes;
    PhotographMedias[index].likedBefore = 'true'; 
    totalLikes++;
    callLikes(totalLikes);
    document.getElementById(id).onclick = null;
}

// GALLERY  -----------------------------------------------------------------------------------------------

// map des images de la galery
// incrémente totallikes a chaque boucle
// comme on le reutilise a chaque tri
// on RAZ le total like pour ne pas qu'il double
// et on raz indexPhoto pour la lightbox car l'image ne sera plus au meme endroit
const showImage = (photos) => {
    document.getElementById("gallery").innerHTML = 
        `${photos.map(photo => { 
            totalLikes += photo.likes; 
            indexPhoto = 0;
            return galleryDesign(photo)}).join('')}`
}

// cette fonction va  
// callback du total des likes car map incrémente tt seul
const galleryDesign = (card) => {
    callLikes(totalLikes);
//permet de faire un array avec les média pour les recupérer avec la LightBox
    arrayPhotos.push(card.media);

// si c'est une IMAGE et Non likée
    if (card.type == 'jpg' && card.likedBefore == 'false') {
        return `<article class="imgGallery">
                    <img class="galleryImg" src="img/${card.photographerId}/${card.media}" alt="${card.alt}" tabindex="0" onclick="fullsize(${card.photographerId},'${card.media}',${card.id},'${card.title}','${card.type}')"> 
                    <div> 
                        <h2 class="name">${card.title}</h2> 
                        <span id="${card.id}">${card.likes} 
                            <i class="fas fa-heart"alt="${card.alt}" onclick="incrementLikes(${card.likes},${card.id})" tabindex="0"></i>
                        </span>
                    </div>
                 </article>`}
// si c'est une VIDEO et Non likée
    else if (card.type == 'mp4' && card.likedBefore == 'false') {
        return `<article class="imgGallery" >
                    <video title="${card.alt}" class="galleryImg" tabindex="0" onclick="fullsize(${card.photographerId},'${card.media}',${card.id},'${card.title}','${card.type}')">
                        <source src="img/${card.photographerId}/${card.media}" type="video/mp4" alt="${card.alt}"> 
                    </video>
                    <div> 
                        <h2 class="name">${card.title}</h2> 
                         <span id="${card.id}">${card.likes} <i class="fas fa-heart" tabindex="0" onclick="incrementLikes(${card.likes},${card.id})"></i></span>
                    </div>
                </article>`}
}

// MODAL  -----------------------------------------------------------------------------------------------

function launchModal ()  { modalbg.style.display = "block"; }
function closeModal () { modalbg.style.display = "none"; }
function modal () {
    document.getElementById("btnContact").addEventListener("click", launchModal);
    document.getElementById("contactMobile").addEventListener("click", launchModal);
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("photographerName").innerHTML = photographerName;
}

//TRIS -----------------------------------------------------------------------------------------------


function selectList() {
    document.getElementById("selectFilter").innerHTML =  
    `<li onclick="popFilter();closeListpop()" >Popularité <i class="fas fa-chevron-up" onclick="" ></i></li><hr>
    <li onclick="dateFilter();closeListdate()" >Date</li><hr>
    <li onclick="titleFilter();closeListtitle()">Titre</li>`
}
function closeListpop(){
    document.getElementById("selectFilter").innerHTML =  
    `<li>Popularité <i class="fas fa-chevron-down" onclick="selectList()"></i></li>`
}
function closeListdate() {
    document.getElementById("selectFilter").innerHTML =  
    `<li>Date <i class="fas fa-chevron-down" onclick="selectList()"></i></li>`
}
function closeListtitle() {
    document.getElementById("selectFilter").innerHTML =  
    `<li>Titre <i class="fas fa-chevron-down" onclick="selectList()"></i></li>`
}
// par titre
function titleFilter(){
    PhotographMedias.sort((a,b)=>a.title.localeCompare(b.title)).filter
     // RAZ des totaux de likes pour eviter de cumuler les likes a chaques tri
     totalLikes = 0;
        showImage (PhotographMedias); 
}
// par date
function dateFilter(){
    PhotographMedias.sort((b,a)=>a.date.localeCompare(b.date )).filter
     totalLikes = 0;
        showImage (PhotographMedias);  
}
// parlikes
function popFilter(){
    PhotographMedias.sort((a, b) => {return b.likes-a.likes})
     totalLikes = 0;
        showImage (PhotographMedias);  
}
/*
--- --- --- ---  LIGHTBOX --- --- --- --- *********************************************************
}*/
function launchLightbox() { document.getElementById("lightbox").style.display = "block";keys=true;}
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; keys=false;}
// on récupère l'index de la photo pour les fleches gauche et droite de la lightBox
function searchPhotoIndex(idPhoto) {
    indexPhoto = PhotographMedias.findIndex(x => x.id === idPhoto);
    return indexPhoto
}
// permet de naviguer entre les photos vers la droite
/// mettre un objet a la place ------------------------------------------------------------------------------------------------>
function rightArrow() {
    indexPhoto++;
    let idURLPlus = idURL;
    let mediaPlus = PhotographMedias[indexPhoto].media;
    let idPlus = PhotographMedias[indexPhoto].id;
    let PhotonamePlus = PhotographMedias[indexPhoto].title;
    let typePlus = PhotographMedias[indexPhoto].type;
    fullsize(idURLPlus, mediaPlus, idPlus, PhotonamePlus, typePlus);
}

// permet de naviguer entre les photos vers la gauche
function leftArrow() {
    indexPhoto--;
    let idURLMinus = idURL;
    let mediaMinus = PhotographMedias[indexPhoto].media;
    let idMinus = PhotographMedias[indexPhoto].id;
    let Photonameminus = PhotographMedias[indexPhoto].title;
    let typeMinus = PhotographMedias[indexPhoto].type;
    fullsize(idURLMinus, mediaMinus, idMinus, Photonameminus, typeMinus);
}

function fullsize(id, media, idPhoto, name, type) {
    searchPhotoIndex(idPhoto);
    const test = () => {
        if (type == "jpg") {
            return `<img src="img/${id}/${media}" alt="${PhotographMedias[indexPhoto].alt}">`
        }
        else {
            return `<video controls height="700"><source src="img/${id}/${media}" type="video/mp4" alt="${PhotographMedias[indexPhoto].alt}"> </video>`
        }
    }
        if (indexPhoto == 0) {
            document.getElementById("Light").innerHTML = `
            <div id="imgLight">
                <i class="fas fa-chevron-left" id="leftArrowWhite"></i> 
                ${test()}
                <i class="fas fa-chevron-right" id="rightArrow" onclick="rightArrow()"></i> 
            </div>
            <p>${name}<p>`  }

        else if (indexPhoto == PhotographMedias.length - 1) {
            document.getElementById("Light").innerHTML = `
            <div id="imgLight">
                <i class="fas fa-chevron-left" id="leftArrow" onclick="leftArrow()"></i> 
                ${test()}
                <i class="fas fa-chevron-left" id="rightArrowWhite"></i> 
            </div>
            <p>${name}<p>`}

        else {
            document.getElementById("Light").innerHTML = `
            <div id="imgLight">
                <i class="fas fa-chevron-left" id="leftArrow" onclick="leftArrow()"></i> 
                ${test()}
                <i class="fas fa-chevron-right" id="rightArrow" onclick="rightArrow()"></i> 
            </div>
            <p>${name}<p>`}

    launchLightbox();
    keyTriggers();
    }

/* 
KEYS LIGHTBOX
la variable keys sert a bloquer la navigation fléché hors de la lightbox
*/  

function keyTriggers(){
    document.onkeydown = e => {
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                if (indexPhoto != 0 && keys==true) {
                leftArrow()
            }
                break;
            case 'ArrowRight':
                if (indexPhoto != PhotographMedias.length - 1 && keys==true) {
                    rightArrow()
                }
                break;
            } 
        }
}

