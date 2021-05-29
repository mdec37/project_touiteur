// FENETRE MODALE
// for(var i=0; i < 4; i++){
//     var modalTouit = document.getElementsByClassName("modalWindows")[i];
//     var btnOpen = document.getElementsByClassName("btnOpen")[i];
//     var btnClose = document.getElementsByClassName("btnClose")[i];

//     btnOpen.onclick = function () {
//         modalTouit.style.display = "block";
//     }
//     btnClose.onclick = function () {
//         modalTouit.style.display = "none";
//     }
// }

// CONVERSION TIMESTAMP EN DATE
function formatTimestamp(timestamp){
    return new Date(timestamp*1000).toLocaleString('fr-FR');
}
// function formatTimestamp(timestamp) {
//     const formattedDate = new Date(timestamp).toLocaleDateString('fr-FR');
//     const formattedTime = new Date(timestamp).toLocaleTimeString('fr-FR');
// return formattedDate + ' ,' + formattedTime;
// }


// AJOUT TOUIT
const containerBloc = document.querySelector(".touit");
const form = document.querySelector("#form");
const pseudo = document.querySelector("#pseudo");
const message = document.querySelector("#message");
const btnEnvoyer = document.querySelector("#ajouter");

    // BEST TOUIT
const containerBest = document.querySelector(".top-touit");


form.addEventListener("submit", function(ev){
    ev.preventDefault();

    sendTouit(
        function() {console.log("Le message a bien été envoyé");},
        function() {console.log("erreur lors de l'envoi");}, 
        pseudo.value,
        message.value
    );
    pseudo.value = null;
    message.value = null;
});



function addTouit(pseudo, message, likes, comments, timestamp, id){
    const touitCards = document.createElement("div");
        touitCards.className = "touit-cards";
        touitCards.id = id;
    const cardsContent = document.createElement("div");
        cardsContent.className = "cards-content";
    const touitPseudo = document.createElement("div");
        touitPseudo.className = "touit-pseudo";
        touitPseudo.textContent = pseudo;
    const btnOpen = document.createElement("button");
        btnOpen.className = "btnOpen";
    const contentTouit = document.createElement("p");
        contentTouit.className = "content";
        contentTouit.textContent = message;
    const footerTouit = document.createElement("footer");
        footerTouit.className = "flex";
    const touitLike = document.createElement("div");
        touitLike.className = "touit-like flex";
    const nbLike = document.createElement("p");
        nbLike.textContent = likes;
    const btnLike = document.createElement("button");
        btnLike.className = "btnLike";
    const iconLike = document.createElement("img");
        iconLike.src = "assets/img/heart.svg";
    const touitComment = document.createElement("div");
    touitComment.className = "touit-comment flex";
    const nbComment = document.createElement("p");
        nbComment.textContent = comments;
    const btnComment = document.createElement("button");
        btnComment.className = "btnComment";
    const iconComment = document.createElement("img");
        iconComment.src = "assets/img/bulle-de-chat.svg";
    const touitDate = document.createElement("p");
        touitDate.className = "touit-date";
        touitDate.textContent = formatTimestamp(timestamp);

    containerBloc.prepend(touitCards);
    touitCards.appendChild(cardsContent);
    
    cardsContent.appendChild(touitPseudo);
    cardsContent.appendChild(btnOpen);
    cardsContent.appendChild(footerTouit);

    btnOpen.appendChild(contentTouit);

    footerTouit.appendChild(touitLike);
    footerTouit.appendChild(touitComment);

    touitLike.appendChild(nbLike);
    touitLike.appendChild(btnLike);
    touitComment.appendChild(nbComment);
    touitComment.appendChild(btnComment);    

    btnLike.appendChild(iconLike);  
    btnComment.appendChild(iconComment);

    touitCards.appendChild(touitDate);
    

    btnLike.addEventListener("click", function(){
        btnLike.classList.toggle("active");
        if(btnLike.classList.contains("active")){
            addLike(
                function(){
                    getOneTouit(
                        function(resp) {
                            nbLike.textContent = resp.data.likes;
                        },
                        function() {console.log("Erreur");},
                        touitCards.id);
                    },
                function() {console.log("Erreur");},
                touitCards.id
            );
            iconLike.src = "assets/img/heartColor.svg";
        }
        else{
            deleteLike(
                function() {
                    getOneTouit(
                        function(resp) {
                            nbLike.textContent = resp.data.likes;
                        },
                        function() {console.log("Erreur");},
                        touitCards.id);
                },
                function() {console.log("Erreur");},
                touitCards.id
            );
            iconLike.src = "assets/img/heart.svg";
        }
    });

    touitCards.addEventListener("mouseenter", function(){
        getOneTouit(
            function(resp) {
                nbLike.textContent = resp.data.likes;
            },
            function() {console.log("Erreur");},
            touitCards.id);
    });    
};




// RECUPERER TOUS LES TOUIT DE LA BASE
function getTouit(success, error, timeStamp) {
    const request = new XMLHttpRequest();
    request.open("GET", "http://touiteur.cefim-formation.org/list?ts=" + timeStamp, true);
    request.addEventListener("readystatechange", function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
                success(response);
            } else {
                error(status);
            }
        }
    });
    request.send();
}

const error = document.querySelector(".error");


// REFRESH AUTOMATIQUE AVEC AJOUT DES NOUVEAUX TOUIT A INTERVAL REGULIER
// AJOUT EN FONCTION DU TS ET RECUPERER DANS L'INTERVAL
let timestamp = 0;

setInterval(function(){
    getTouit(
        function(resp){
            timestamp = resp.ts;
            for(i=0 ; i<resp.messages.length ; i++){
                addTouit(resp.messages[i].name, resp.messages[i].message, resp.messages[i].likes, resp.messages[i].comments_count, resp.messages[i].ts, resp.messages[i].id)}
        }, 
        function() {
            error.textContent = "Erreur lors de la récupération des touits !";
            error.style.color = "red";
        },
        timestamp);
}, 2000);



// RECUPERER UN SEUL TOUIT
function getOneTouit(success, error, id){
    const requestOne = new XMLHttpRequest();
    requestOne.open("GET", "http://touiteur.cefim-formation.org/get?id=" + id, true);
    requestOne.addEventListener("readystatechange", function () {
        if (requestOne.readyState === XMLHttpRequest.DONE) {
            if (requestOne.status === 200) {
                const response = JSON.parse(requestOne.responseText);
                success(response);
            } else {
                error(status);
            }
        }
    });
    requestOne.send();
}



function addBestTouit(pseudo, message, likes, comments, timestamp, id){
    const touitCards = document.createElement("div");
        touitCards.className = "touit-cards";
        touitCards.id = id;
    const cardsContent = document.createElement("div");
        cardsContent.className = "cards-content";
    const touitPseudo = document.createElement("div");
        touitPseudo.className = "touit-pseudo";
        touitPseudo.textContent = pseudo;
    const btnOpen = document.createElement("button");
        btnOpen.className = "btnOpen";
    const contentTouit = document.createElement("p");
        contentTouit.className = "content";
        contentTouit.textContent = message;
    const footerTouit = document.createElement("footer");
        footerTouit.className = "flex";
    const touitLike = document.createElement("div");
        touitLike.className = "touit-like flex";
    const nbLike = document.createElement("p");
        nbLike.textContent = likes;
    const btnLike = document.createElement("button");
        btnLike.className = "btnLike";
    const iconLike = document.createElement("img");
        iconLike.src = "assets/img/heart.svg";
    const touitComment = document.createElement("div");
    touitComment.className = "touit-comment flex";
    const nbComment = document.createElement("p");
        nbComment.textContent = comments;
    const btnComment = document.createElement("button");
        btnComment.className = "btnComment";
    const iconComment = document.createElement("img");
        iconComment.src = "assets/img/bulle-de-chat.svg";
    const touitDate = document.createElement("p");
        touitDate.className = "touit-date";
        touitDate.textContent = formatTimestamp(timestamp);

    containerBest.prepend(touitCards);
    touitCards.appendChild(cardsContent);
    
    cardsContent.appendChild(touitPseudo);
    cardsContent.appendChild(btnOpen);
    cardsContent.appendChild(footerTouit);

    btnOpen.appendChild(contentTouit);

    footerTouit.appendChild(touitLike);
    footerTouit.appendChild(touitComment);

    touitLike.appendChild(nbLike);
    touitLike.appendChild(btnLike);
    touitComment.appendChild(nbComment);
    touitComment.appendChild(btnComment);    

    btnLike.appendChild(iconLike);  
    btnComment.appendChild(iconComment);

    touitCards.appendChild(touitDate);
    

    btnLike.addEventListener("click", function(){
        btnLike.classList.toggle("active");
        if(btnLike.classList.contains("active")){
            addLike(
                function(){
                    getOneTouit(
                        function(resp) {
                            nbLike.textContent = resp.data.likes;
                        },
                        function() {console.log("Erreur");},
                        touitCards.id);
                    },
                function() {console.log("Erreur");},
                touitCards.id
            );
            iconLike.src = "assets/img/heartColor.svg";
        }
        else{
            deleteLike(
                function() {
                    getOneTouit(
                        function(resp) {
                            nbLike.textContent = resp.data.likes;
                        },
                        function() {console.log("Erreur");},
                        touitCards.id);
                },
                function() {console.log("Erreur");},
                touitCards.id
            );
            iconLike.src = "assets/img/heart.svg";
        }
    });

    touitCards.addEventListener("mouseenter", function(){
        getOneTouit(
            function(resp) {
                nbLike.textContent = resp.data.likes;
            },
            function() {console.log("Erreur");},
            touitCards.id);
    });    
};


// RECUPERER LES TOUITS LES PLUS LIKES
function topTouit(success, error, nbTouit) {
    const requestTop = new XMLHttpRequest();
    requestTop.open("GET", "http://touiteur.cefim-formation.org/likes/top?count=" + nbTouit, true);
    requestTop.addEventListener("readystatechange", function () {
        if (requestTop.readyState === XMLHttpRequest.DONE) {
            if (requestTop.status === 200) {
                const responseTop = JSON.parse(requestTop.responseText);
                success(responseTop);
            } else {
                error(status);
            }
        }
    });
    requestTop.send();
}

topTouit(
    function(resp){
        // UTILISER SORT POUR TRIER SELON NOMBRE DE LIKES
        // const respTop = resp.top.sort((a,b) => b.likes - a.likes);   attention fonction fléchée
        // Changer tous les resp.top par la constante respTop + verifier prepend dans addBestTouit
        for(y=0 ; y<resp.top.length ; y++){
            addBestTouit(resp.top[y].name, resp.top[y].message, resp.top[y].likes, resp.top[y].comments_count, resp.top[y].ts, resp.top[y].id)
        }
    }, 
    function() {
        error.textContent = "Erreur lors de la récupération des besttouits !";
        error.style.color = "red";
    },
    2);



// ENVOYER DES TOUIT VERS LA BASE
function sendTouit(success, error, pseudo, message) {
    const sendRequest = new XMLHttpRequest();
    sendRequest.open("POST", "http://touiteur.cefim-formation.org/send", true);
    sendRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    sendRequest.addEventListener("readystatechange", function () {
        if (sendRequest.readyState === XMLHttpRequest.DONE) {
            if (sendRequest.status === 200) {
                const response = JSON.parse(sendRequest.responseText);
                success(response);
            } else {
                error(status);
            }
        }
    });
    const data = "name="+pseudo+"&message="+message;
    sendRequest.send(data);
}



// AJOUTER LIKE
function addLike(success, error, id){
    const likeRequest = new XMLHttpRequest();
    likeRequest.open("PUT", "http://touiteur.cefim-formation.org/likes/send", true);
    likeRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    likeRequest.addEventListener("readystatechange", function () {
        if (likeRequest.readyState === XMLHttpRequest.DONE) {
            if (likeRequest.status === 200) {
                const response = JSON.parse(likeRequest.responseText);
                success(response);
            } else {
                error(status);
            }
        }
    });
    const data = "message_id="+id;
    likeRequest.send(data);
}


// SUPPRIMER LIKE
function deleteLike(success, error, id){
    const suppLikeRequest = new XMLHttpRequest();
    suppLikeRequest.open("DELETE", "http://touiteur.cefim-formation.org/likes/remove", true);
    suppLikeRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    suppLikeRequest.addEventListener("readystatechange", function () {
        if (suppLikeRequest.readyState === XMLHttpRequest.DONE) {
            if (suppLikeRequest.status === 200) {
                const response = JSON.parse(suppLikeRequest.responseText);
                success(response);
            } else {
                error(status);
            }
        }
    });
    const data = "message_id="+id;
    suppLikeRequest.send(data);
}


// RECUPERER LES TERMES LES PLUS FREQUEMMENT UTILISES
// para XXX ?
const containerTrending = document.querySelector(".trending");

function addTrending(XXX){
    const ulTrending = document.createElement("ul");
        ulTrending.className = "flex";
    const liTrending = document.createElement("li");
        liTrending.textContent = XXX;

    containerTrending.appendChild(ulTrending);
    ulTrending.appendChild(liTrending);
};


function trending(success, error){
    const trendingRequest = new XMLHttpRequest();
    trendingRequest.open("GET", "http://touiteur.cefim-formation.org/trending", true);
    trendingRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    trendingRequest.addEventListener("readystatechange", function () {
        if (trendingRequest.readyState === XMLHttpRequest.DONE) {
            if (trendingRequest.status === 200) {
                const response = JSON.parse(trendingRequest.responseText);
                success(response);
            } else {
                error(status);
            }
        }
    });
    trendingRequest.send();
}


// containerTrending.addEventListener("mouseenter", function(){
    trending(
        function(resp) {
            for(j=0; j< 7 ; j++)
            // addTrending(resp);
            console.log(resp);
        },
        function() {console.log("Erreur")});
// });

// UTILISER SORT AUSSI ?
// Transformer le format de la donnée avant d'utiliser