function Card(front, back) {
    this.front = front;
    this.back = back;
}

const front = document.getElementById("front");
const back = document.getElementById("back");
let cardIndex = 0;
localStorage.index = JSON.stringify(cardIndex);

// eslint-disable-next-line no-unused-vars
function addCard() {
    if (document.getElementById("newFront").value != "" &&
        document.getElementById("newBack").value != "") {
        const newCard = new Card();
        newCard.front = document.getElementById("newFront").value;
        newCard.back = document.getElementById("newBack").value;

        const collectionLocalStorage = getOrCreateCollection();
        collectionLocalStorage.push(newCard);
        localStorage.coll = JSON.stringify(collectionLocalStorage);
        localStorage.index = JSON.stringify(collectionLocalStorage.length - 1);

        front.innerHTML = newCard.front;
        back.innerHTML = newCard.back;

        document.getElementById("newFront").value = "";
        document.getElementById("newBack").value = "";
    }
}

// eslint-disable-next-line no-unused-vars
function previousCard() {
    const collectionLocalStorage = getOrCreateCollection();
    cardIndex = JSON.parse(localStorage.index) - 1;

    if (cardIndex < 0) {
        cardIndex = collectionLocalStorage.length - 1;
    }

    if (cardIndex >= 0 && cardIndex < collectionLocalStorage.length) {
        front.innerHTML = collectionLocalStorage[cardIndex].front;
        back.innerHTML = collectionLocalStorage[cardIndex].back;
    }

    localStorage.index = JSON.stringify(cardIndex);
    fillPosition();
}

// eslint-disable-next-line no-unused-vars
function nextCard() {
    const collectionLocalStorage = getOrCreateCollection();
    cardIndex = JSON.parse(localStorage.index) + 1;

    if (cardIndex >= collectionLocalStorage.length) {
        cardIndex = 0;
    }

    if (cardIndex >= 0 && cardIndex < collectionLocalStorage.length) {
        front.innerHTML = collectionLocalStorage[cardIndex].front;
        back.innerHTML = collectionLocalStorage[cardIndex].back;
    }

    localStorage.index = JSON.stringify(cardIndex);
    fillPosition();
}

// eslint-disable-next-line no-unused-vars
function addCollection() {
    collectionName = document.getElementById("collectionName").value;
    if (collections.length === 0) {
        collections[0] = collectionName;
        document.getElementById("collectionContainer").innerHTML = collections[0];
    } else {
        collections[collections.length] = collectionName;
        text = collections[0].toString();
        document.getElementById("collectionContainer").innerHTML =
            document.getElementById("collectionContainer").innerHTML +
            "\n" + collections[collections.length - 1];
    }

    document.getElementById("collectionName").value = "";
}

// eslint-disable-next-line no-unused-vars
function fillFlashcards() {
    cardIndex = JSON.parse(localStorage.index);
    const collectionLocalStorage = getOrCreateCollection();

    if (collectionLocalStorage.length != 0) {
        front.innerHTML = collectionLocalStorage[cardIndex].front;
        back.innerHTML = collectionLocalStorage[cardIndex].back;
    }
    fillPosition();
}

// eslint-disable-next-line no-unused-vars
function deleteCard() {
    const collectionLocalStorage = getOrCreateCollection();
    cardIndex = JSON.parse(localStorage.index);

    collectionLocalStorage.splice(cardIndex, 1);

    if (cardIndex >= collectionLocalStorage.length) {
        console.log(cardIndex);
        cardIndex = collectionLocalStorage.length - 1;
    }

    if (cardIndex >= 0 && cardIndex < collectionLocalStorage.length) {
        front.innerHTML = collectionLocalStorage[cardIndex].front;
        back.innerHTML = collectionLocalStorage[cardIndex].back;
    }

    if (collectionLocalStorage.length == 0) {
        console.log("test");
        front.innerHTML = "";
        back.innerHTML = "";
    }

    localStorage.coll = JSON.stringify(collectionLocalStorage);
    localStorage.index = JSON.stringify(cardIndex);
    fillPosition();
}

function fillPosition() {
    const collectionLocalStorage = getOrCreateCollection();
    cardIndex = JSON.parse(localStorage.index) + 1;

    if (collectionLocalStorage.length != 0 && document.getElementById("position") != null) {
        document.getElementById("position").innerHTML = cardIndex +
            "/" + collectionLocalStorage.length;
    }
}

function getOrCreateCollection() {
    let collectionLocalStorage;
    if (localStorage.getItem("coll") == undefined) {
        collectionLocalStorage = [];
    } else {
        collectionLocalStorage = JSON.parse(localStorage.coll);
    }
    return collectionLocalStorage;
}
