
// recupération de l'URL
var urlcourante = document.location.href;
var url = new URL(urlcourante);
var idPhotograph = url.searchParams.get("id");
var photographerName = url.searchParams.get("name");
const modalbg = document.querySelector(".bground");
// recuperation de la data
let photographers = [];
let media = [];
let totalLikes = 0;
let price = 0;
let arrayPhotos = [];
let indexPhoto = 0;
let mediaFactoryMethod = new MediaFactoryMethod();
let mediaFactorised = []

fetch('data.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        photographers = data.photographers;
        media = data.media;
        showPhotographer(photographers);
        pushMedia(media)
        showImage(mediaFactorised);
        modal();
    });


/*
 --- --- --- ---  PHOTOGRAPHE  --- --- --- --- *********************************************************
*/
// Recuperer le bon photographe 
function showPhotographer(photographers) {
    document.getElementById("photographer").innerHTML = `${photographers.map(function (photographer) {
        if (photographer.id == idPhotograph) {
            return pageDesign(photographer)
        }
    }).join('')}`
}

function pageDesign(card) {
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
function hashtags(tag) {
    return `${tag.map(listeTag).join('')}`
}
function listeTag(tag) {
    return `<li class="hashtag"><span>#</span>${tag}</li>`
}
function callPrice(price) {
    document.getElementById('price').innerHTML = price + "/jours";
}
/*
 --- --- --- ---  FACTORY  --- --- --- --- *********************************************************
*/
// fonction factory permet de definir le type de média.
// on se sépare des infos inutiles ( price, image/vidéo )
// fonction qui ajoute le type VDO et qui tranforme le "video" en "média"
function Video(id, photographerId, title, video, likes, date, tag) {
    this.id = id, this.photographerId = photographerId,
        this.title = title, this.likes = likes, this.date = date,
        this.media = video; this.tag = tag;
    this.type = "mp4";
    this.likedBefore = 'false';
}
// fonction qui ajoute le type Image et qui tranforme le "image" en "média"
function Image(id, photographerId, title, image, likes, date, tag) {
    this.id = id, this.photographerId = photographerId,
        this.title = title, this.likes = likes, this.date = date,
        this.media = image; this.tag = tag;
    this.type = "jpg";
    this.likedBefore = 'false';
}
/*  on créé un nouvel objet factory
    mais avant de return
    on check si le paramettre video est null ou undefined, pour savoir si c'est c'est une image ou une vidéo
*/
function MediaFactoryMethod() {
    this.create = function (id, photographerId, title, image, likes, date, video, tag) {
        if (video == null) {
            return new Image(id, photographerId, title, image, likes, date, tag)
        }
        else {
            return new Video(id, photographerId, title, video, likes, date, tag)
        }
    }
}
function pushMedia(media) {
    for (let i = 0; i < media.length; i++) {
        if (media[i].photographerId == idPhotograph) {
            mediaFactorised.push(mediaFactoryMethod.create(media[i].id, media[i].photographerId, media[i].title, media[i].image, media[i].likes, media[i].date, media[i].video, media[i].tags[0]))
        }
    }
}


/*
 --- --- --- ---  GALLERY  --- --- --- --- *********************************************************
*/

function showImage(photos) {
    document.getElementById("gallery").innerHTML = `${photos.map(function (photo) {
        if (photo.photographerId == idPhotograph) {
            totalLikes += photo.likes;
            indexPhoto = 0;
            return galleryDesign(photo)
        }
    }).join('')}`
}

function galleryDesign(card) {
    // on en profite pour callback du total des likes car map incrémente tt seul
    // deux return car deux medias possibles
    callLikes(totalLikes);
    //permet de faire un array avec les média pour les recupérer pour la LightBox
    arrayPhotos.push(card.media);

    if (card.type == 'jpg' && card.likedBefore == 'false') {
        return `
    <article class="imgGallery">
       <img class="galleryImg" src="img/${card.photographerId}/${card.media}"  onclick="fullsize(${card.photographerId},'${card.media}',${card.id},'${card.title}','${card.type}')"> 
        <div> 
        <h2 id="name">${card.title}</h2> 
        <span id="${card.id}">${card.likes} <i class="fas fa-heart" onclick="incrementLikes(${card.likes},${card.id})"></i></span>
        </div>
    </article>
    `}
    else if (card.type == 'mp4' && card.likedBefore == 'false') {
        return `
    <article class="imgGallery" onclick="fullsize(${card.photographerId},'${card.media}',${card.id},'${card.title}','${card.type}')" >
    <video class="galleryImg">
    <source src="img/${card.photographerId}/${card.media}" type="video/mp4"> 
    </video>
        <div> 
        <h2 id="name">${card.title}</h2> 
        <span id="${card.id}">${card.likes} <i class="fas fa-heart" onclick="incrementLikes(${card.likes},${card.id})"></i></span>
                </div>
    </article>
    `
    }
    //  conditions avec likedBefore TRUE qui enleve la possibilité de liker //
    else if (card.type == 'jpg' && card.likedBefore == 'true') {
        return `
        <article class="imgGallery" >
        <img class="galleryImg" src="img/${card.photographerId}/${card.media}"  onclick="fullsize(${card.photographerId},'${card.media}',${card.id},'${card.title}','${card.type}')"> 
        <div> 
            <h2 id="name">${card.title}</h2> 
            <span id="${card.id}">${card.likes} <i class="fas fa-heart"></i></span>
            </div>
        </article>
        `}
    else if (card.type == 'mp4' && card.likedBefore == 'true') {
        return `
        <article class="imgGallery" >
        <video class="galleryImg" onclick="fullsize(${card.photographerId},'${card.media}',${card.id},'${card.title}','${card.type}')">
        <source src="img/${card.photographerId}/${card.media}" type="video/mp4" > 
        </video>
            <div> 
            <h2 id="name">${card.title}</h2> 
            <span id="${card.id}">${card.likes} <i class="fas fa-heart"></i></span>
                    </div>
        </article>
        `
    }
}
function callLikes(ttLikes) {
    document.getElementById("ttLikes").innerHTML = ttLikes;
}

/*
--- --- --- ---  MODAL  --- --- --- --- *********************************************************
*/
function launchModal() { modalbg.style.display = "block"; }
function closeModal() { modalbg.style.display = "none"; }
// launch modal event
function modal() {
    document.getElementById("btnContact").addEventListener("click", launchModal);
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("photographerName").innerHTML = photographerName;
}
//close modal

/*
 --- --- --- ---  LIKES  --- --- --- --- *********************************************************
}*/
function incrementLikes(likes, id) {
    likes++;
    document.getElementById(id).innerHTML = `${likes} <i class="fas fa-heart"></i> `;
    //recupere l'index ou se situe l'image likée
    var index = mediaFactorised.map(function (e) { return e.id; }).indexOf(id)
    console.log(index);
    // on erase la valeur des likes avec likes+1 suite au click sur le coeur
    mediaFactorised[index].likes = likes;
    // ajoute le parametre likedBefore a l'objet pour eviter de pouvoir reliker une photo apres un tri
    mediaFactorised[index].likedBefore = 'true';
    // on lance incrementeTtLikes pour que le total se mette a jour
    incrementTtLikes();
}

function incrementTtLikes() {
    totalLikes++
    callLikes(totalLikes);
}

/*
 --- --- --- ---  TRIS  --- --- --- --- *********************************************************
}*/
function triParNom() {
    mediaFactorised.sort(function (a, b) {
        if (a.title < b.title) { return -1; }
        if (a.title > b.title) { return 1; }
        return 0;
    })
    // RAZ des totaux de likes pour eviter de cumuler les likes a chaques tri
    totalLikes = 0;
    // on relance l'affichage des images
    showImage(mediaFactorised);
}


/*
--- --- --- ---  LIGHTBOX --- --- --- --- *********************************************************
}*/

function launchLightbox() { document.getElementById("lightbox").style.display = "block"; }
function closeLightbox() { document.getElementById("lightbox").style.display = "none"; }
// on récupère l'index de la photo pour les fleches gauche et droite de la lightBox
function searchPhotoIndex(idPhoto) {
    indexPhoto = mediaFactorised.findIndex(x => x.id === idPhoto);
    return indexPhoto
}

// permet de naviguer entre les photos vers la droite
function rightArrow() {
    indexPhoto++;
    let idPhotographPlus = idPhotograph
    let mediaPlus = mediaFactorised[indexPhoto].media;
    let idPlus = mediaFactorised[indexPhoto].id;
    let PhotonamePlus = mediaFactorised[indexPhoto].title;
    let typePlus = mediaFactorised[indexPhoto].type;

    fullsize(idPhotographPlus, mediaPlus, idPlus, PhotonamePlus, typePlus);
}

// permet de naviguer entre les photos vers la gauche
function leftArrow() {
    indexPhoto--;
    let idPhotographMinus = idPhotograph
    let mediaMinus = mediaFactorised[indexPhoto].media;
    let idMinus = mediaFactorised[indexPhoto].id;
    let Photonameminus = mediaFactorised[indexPhoto].title;
    let typeMinus = mediaFactorised[indexPhoto].type;
    fullsize(idPhotographMinus, mediaMinus, idMinus, Photonameminus, typeMinus);
}


function fullsize(id, media, idPhoto, name, type) {

    searchPhotoIndex(idPhoto);
    if (type == "jpg") {
        if (indexPhoto == 0) {
            document.getElementById("imgLight").innerHTML = `
            <img src="img/${id}/${media}"> 
            <p>${name}<p>
            <i class="fas fa-chevron-right" id="rightArrow" onclick="rightArrow()"></i> 
            `  }
        else if (indexPhoto == mediaFactorised.length - 1) {
            document.getElementById("imgLight").innerHTML = `
            <i class="fas fa-chevron-left" id="leftArrow" onclick="leftArrow()"></i> 
             <img src="img/${id}/${media}"> 
             <p>${name}<p>
            `}
        else {
            document.getElementById("imgLight").innerHTML = `
            <i class="fas fa-chevron-left" id="leftArrow" onclick="leftArrow()"></i> 
            <img src="img/${id}/${media}">
            <p>${name}<p>
            <i class="fas fa-chevron-right" id="rightArrow" onclick="rightArrow()"></i> 
            `}
    }
    else {

        if (indexPhoto == 0) {
            document.getElementById("imgLight").innerHTML = `
            <video controls height="700">
            <source src="img/${id}/${media}" type="video/mp4"> 
            </video>
            <p>${name}<p>
            <i class="fas fa-chevron-right" id="rightArrow" onclick="rightArrow()"></i> 
            `  }
        else if (indexPhoto == mediaFactorised.length - 1) {
            document.getElementById("imgLight").innerHTML = `
        <i class="fas fa-chevron-left" id="leftArrow" onclick="leftArrow()"></i> 
        <video controls >
        <source src="img/${id}/${media}" type="video/mp4"> 
        </video>
        <p>${name}<p>
        `}
        else {
            document.getElementById("imgLight").innerHTML = `
        <i class="fas fa-chevron-left" id="leftArrow" onclick="leftArrow()"></i> 
        <video controls >
        <source src="img/${id}/${media}" type="video/mp4"> 
        </video> 
        <p>${name}<p>
        <i class="fas fa-chevron-right" id="rightArrow" onclick="rightArrow()"></i> 
        `}
    }


    launchLightbox();
}
