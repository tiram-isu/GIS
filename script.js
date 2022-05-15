class Card {
    constructor(front, back) {
        this.front = front;
        this.back = back;
    }
}

const front = document.getElementById("front");
const back = document.getElementById("back");
let cardIndex;

// eslint-disable-next-line no-unused-vars
function addCard() {
    const groupSelected = getOrCreateGroupSelected();
    const inputFront = document.getElementById("newFront").value;
    const inputBack = document.getElementById("newBack").value;

    if (groupSelected == "") {
        document.getElementById("error").innerHTML = "Es muss eine Sammlung ausgewählt werden.";
    } else if (inputFront != "" && inputBack != "") {

        const newCard = new Card();
        newCard.front = inputFront;
        newCard.back = inputBack;

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

// flashcards
// eslint-disable-next-line no-unused-vars
function fillFlashcards() {
    if (localStorage.getItem("index") !== "undefined" &&
        localStorage.getItem("index") !== null) {
        cardIndex = JSON.parse(localStorage.index);
        const collectionLocalStorage = getOrCreateCollection();

        if (collectionLocalStorage.length !== 0) {
            front.innerHTML = collectionLocalStorage[cardIndex].front;
        }

        fillPosition();
    }

    createGroupsDropdown();
}

function createGroupsDropdown() {
    const dropdownTitle = document.querySelector(".dropdown .title");
    dropdownTitle.addEventListener("click", toggleMenuDisplay);

    const groupSelected = getOrCreateGroupSelected();
    if (groupSelected != "") {
        dropdownTitle.innerHTML = groupSelected;
    }
    const groupsLocalStorage = getOrCreateGroups();

    for (i = 0; i < groupsLocalStorage.length; i++) {
        const groupsDropdown = document.createElement("div");
        groupsDropdown.classList.add("option");
        groupsDropdown.addEventListener("click", handleOptionSelected);
        groupsDropdown.innerHTML = groupsLocalStorage[i];
        document.getElementById("dropdown-content").appendChild(groupsDropdown);
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
    }

    localStorage.index = JSON.stringify(cardIndex);
    fillPosition();
}

// eslint-disable-next-line no-unused-vars
function flip() {
    const collectionLocalStorage = getOrCreateCollection();
    const titleFront = document.getElementById("titleFront");
    cardIndex = JSON.parse(localStorage.index);

    if (titleFront.innerHTML === "Vorderseite") {
        document.getElementById("titleFront").innerHTML = "Rückseite";
        front.innerHTML = collectionLocalStorage[cardIndex].back;
        return;
    }

    if (titleFront.innerHTML === "Rückseite") {
        document.getElementById("titleFront").innerHTML = "Vorderseite";
        front.innerHTML = collectionLocalStorage[cardIndex].front;
        return;
    }
}

// eslint-disable-next-line no-unused-vars
function deleteCard() {
    const collectionLocalStorage = getOrCreateCollection();
    cardIndex = JSON.parse(localStorage.index);

    collectionLocalStorage.splice(cardIndex, 1);

    if (cardIndex >= collectionLocalStorage.length) {
        cardIndex = collectionLocalStorage.length - 1;
    }

    if (cardIndex >= 0 && cardIndex < collectionLocalStorage.length) {
        front.innerHTML = collectionLocalStorage[cardIndex].front;
    }

    if (collectionLocalStorage.length == 0) {
        front.innerHTML = "";
    }

    localStorage.coll = JSON.stringify(collectionLocalStorage);
    localStorage.index = JSON.stringify(cardIndex);
    fillPosition();
}

function fillPosition() {
    const collectionLocalStorage = getOrCreateCollection();
    cardIndex = JSON.parse(localStorage.index) + 1;

    if (collectionLocalStorage.length > 0 && document.getElementById("position") != null) {
        document.getElementById("position").innerHTML = cardIndex +
            "/" + collectionLocalStorage.length;
    } else if (collectionLocalStorage.length === 0) {
        document.getElementById("position").innerHTML = 0 +
            "/" + 0;
    }
}

// groups
// eslint-disable-next-line no-unused-vars
function fillGroups() {
    const groupsLocalStorage = getOrCreateGroups();
    if (groupsLocalStorage.length !== 0) {
        document.getElementById("collectionContainer").innerHTML = "";
    }

    for (i = 0; i < groupsLocalStorage.length; i++) {
        const groupsButton = document.createElement("button");
        groupsButton.innerHTML = groupsLocalStorage[i];
        groupsButton.onclick = function() {
            // window.location.href = "indexCards.html";
            console.log(groupsButton.innerHTML);
        };
        document.body.appendChild(groupsButton);
    }
}

// eslint-disable-next-line no-unused-vars
function addGroup() {
    const groupsLocalStorage = getOrCreateGroups();
    groupName = document.getElementById("collectionName").value;
    document.getElementById("collectionName").value = "";
    if (groupName !== "") {
        groupsLocalStorage.push([groupName]);
        console.log(groupsLocalStorage);
        // groupsLocalStorage.push(groupName);

        // const groupsButton = document.createElement("button");
        // groupsButton.innerHTML = groupName;
        // groupsButton.onclick = test();
        // document.body.appendChild(groupsButton);
        // localStorage.groups = JSON.stringify(groupsLocalStorage);

        // document.getElementById("collectionContainer").innerHTML = "";
    }
}

function test() {
    console.log("help");
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

function getOrCreateGroups() {
    let groupsLocalStorage;
    if (localStorage.getItem("groups") == undefined) {
        groupsLocalStorage = [];
    } else {
        groupsLocalStorage = JSON.parse(localStorage.groups);
    }
    return groupsLocalStorage;
}

function getOrCreateGroupSelected() {
    let groupSelected;
    if (localStorage.getItem("groupSelected") == undefined) {
        groupSelected = "";
    } else {
        groupSelected = localStorage.groupSelected;
    }
    return groupSelected;
}

// dropdown menu
function toggleClass(elem, className) {
    if (elem.className.indexOf(className) !== -1) {
        elem.className = elem.className.replace(className, "");
    } else {
        elem.className = elem.className.replace(/\s+/g, " ") + " " + className;
    }

    return elem;
}

function toggleMenuDisplay(e) {
    const dropdown = e.currentTarget.parentNode;
    const menu = dropdown.querySelector(".menu");
    toggleClass(menu, "hide");
}

function handleOptionSelected(e) {
    toggleClass(e.target.parentNode, "hide");

    const newValue = e.target.textContent + " ";
    const titleElem = document.querySelector(".dropdown .title");

    titleElem.textContent = newValue;

    localStorage.groupSelected = newValue;

    console.log("test");
}


