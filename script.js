const front = document.getElementById("front");
const back = document.getElementById("back");
let cardIndex;
let groupIndex;

class Card {
    constructor(front, back) {
        this.front = front;
        this.back = back;
    }
}

// eslint-disable-next-line no-unused-vars
function addCard() {
    const groupSelected = getOrCreateGroupSelected();
    const groupsLocalStorage = getOrCreateGroups();
    const inputFront = document.getElementById("newFront").value;
    const inputBack = document.getElementById("newBack").value;
    groupIndex = getGroupIndex();

    if (groupSelected == "") {
        document.getElementById("error").innerHTML = "Es muss eine Sammlung ausgewählt werden.";
    } else if (inputFront != "" && inputBack != "") {
        const newCard = new Card();
        newCard.front = inputFront;
        newCard.back = inputBack;

        groupsLocalStorage[groupIndex].push(newCard);
        localStorage.groups = JSON.stringify(groupsLocalStorage);
        localStorage.index = JSON.stringify(groupsLocalStorage[groupIndex].length - 1);

        front.innerHTML = newCard.front;
        back.innerHTML = newCard.back;

        document.getElementById("newFront").value = "";
        document.getElementById("newBack").value = "";
    }
}

// flashcards
function fillFlashcards() {
    if (localStorage.getItem("index") !== "undefined" &&
        localStorage.getItem("index") !== null) {
        const groupsLocalStorage = getOrCreateGroups();
        groupIndex = getGroupIndex();
        cardIndex = getCardIndex();

        if (groupsLocalStorage.length !== 0 && groupsLocalStorage[groupIndex].length > 1) {
            front.innerHTML = groupsLocalStorage[groupIndex][cardIndex].front;
        } else {
            front.innerHTML = "";
        }

        fillPosition();
    }
}

// eslint-disable-next-line no-unused-vars
function flashcardsDropdown() {
    fillFlashcards();
    createGroupsDropdown();
}

function fillPosition() {
    const groupsLocalStorage = getOrCreateGroups();
    groupIndex = getGroupIndex();
    cardIndex = JSON.parse(localStorage.index) + 1;

    if (groupsLocalStorage[groupIndex].length > 1 && document.getElementById("position") != null) {
        document.getElementById("position").innerHTML = (cardIndex - 1) +
            "/" + (groupsLocalStorage[groupIndex].length - 1);
    } else {
        document.getElementById("position").innerHTML = 0 +
            "/" + 0;
    }
}

function createGroupsDropdown() {
    const dropdownTitle = document.querySelector(".dropdown .title");
    dropdownTitle.addEventListener("click", toggleMenuDisplay);

    const groupSelected = getOrCreateGroupSelected();
    if (groupSelected != "") {
        dropdownTitle.innerHTML = groupSelected;
    }
    const groupsLocalStorage = getOrCreateGroups();

    const toDelete = document.querySelectorAll(".option");
    toDelete.forEach((option) => {
        option.remove();
    });

    for (i = 0; i < groupsLocalStorage.length; i++) {
        const groupsDropdown = document.createElement("div");
        groupsDropdown.classList.add("option");
        groupsDropdown.addEventListener("click", handleOptionSelected);
        groupsDropdown.innerHTML = groupsLocalStorage[i][0];
        document.getElementById("dropdown-content").appendChild(groupsDropdown);
    }
}

// eslint-disable-next-line no-unused-vars
function previousCard() {
    const groupsLocalStorage = getOrCreateGroups();
    groupIndex = getGroupIndex();
    cardIndex = JSON.parse(localStorage.index) - 1;

    if (groupsLocalStorage[groupIndex].length <= 1) {
        return;
    }

    if (cardIndex < 1) {
        cardIndex = groupsLocalStorage[groupIndex].length - 1;
    }

    if (cardIndex >= 1 && cardIndex < groupsLocalStorage[groupIndex].length) {
        front.innerHTML = groupsLocalStorage[groupIndex][cardIndex].front;
    }

    localStorage.index = JSON.stringify(cardIndex);
    fillPosition();
}

// eslint-disable-next-line no-unused-vars
function nextCard() {
    const groupsLocalStorage = getOrCreateGroups();
    groupIndex = getGroupIndex();
    cardIndex = JSON.parse(localStorage.index) + 1;

    if (groupsLocalStorage[groupIndex].length <= 1) {
        return;
    }

    if (cardIndex > groupsLocalStorage[groupIndex].length - 1) {
        cardIndex = 1;
    }

    if (cardIndex >= 1 && cardIndex <= groupsLocalStorage[groupIndex].length) {
        front.innerHTML = groupsLocalStorage[groupIndex][cardIndex].front;
    }

    localStorage.index = JSON.stringify(cardIndex);
    fillPosition();
}

// eslint-disable-next-line no-unused-vars
function flip() {
    const groupsLocalStorage = getOrCreateGroups();
    groupIndex = getGroupIndex();
    cardIndex = JSON.parse(localStorage.index);
    const titleFront = document.getElementById("titleFront");

    if (groupsLocalStorage[groupIndex].length <= 1) {
        return;
    }

    if (titleFront.innerHTML === "Vorderseite") {
        document.getElementById("titleFront").innerHTML = "Rückseite";
        front.innerHTML = groupsLocalStorage[groupIndex][cardIndex].back;
        return;
    }

    if (titleFront.innerHTML === "Rückseite") {
        document.getElementById("titleFront").innerHTML = "Vorderseite";
        front.innerHTML = groupsLocalStorage[groupIndex][cardIndex].front;
        return;
    }
}

// eslint-disable-next-line no-unused-vars
function deleteCard() {
    const groupsLocalStorage = getOrCreateGroups();
    groupIndex = getGroupIndex();
    cardIndex = JSON.parse(localStorage.index);

    if (cardIndex >= 1) {
        groupsLocalStorage[groupIndex].splice(cardIndex, 1);

        if (cardIndex >= groupsLocalStorage[groupIndex].length) {
            cardIndex = groupsLocalStorage[groupIndex].length - 1;
        }

        if (cardIndex >= 0 && cardIndex < groupsLocalStorage[groupIndex].length) {
            front.innerHTML = groupsLocalStorage[groupIndex][cardIndex].front;
        }

        if (groupsLocalStorage[groupIndex].length <= 1) {
            front.innerHTML = "";
        }

        localStorage.groups = JSON.stringify(groupsLocalStorage);
        localStorage.index = JSON.stringify(groupsLocalStorage[groupIndex].length - 1);

        fillPosition();
    }
}

// groups
// eslint-disable-next-line no-unused-vars
function fillGroups() {
    const groupsLocalStorage = getOrCreateGroups();
    groupIndex = getGroupIndex();

    if (groupsLocalStorage.length !== 0) {
        document.getElementById("collectionContainer").innerHTML = "";
        document.getElementById("groupTitle").innerHTML = groupsLocalStorage[groupIndex][0];
        document.getElementById("groupInfo").innerHTML =
            "Anzahl Karteikarten: " + (groupsLocalStorage[groupIndex].length - 1);
    }

    createGroupsDropdown();
}

// eslint-disable-next-line no-unused-vars
function addGroup() {
    const groupsLocalStorage = getOrCreateGroups();
    groupName = document.getElementById("collectionName").value;
    document.getElementById("collectionName").value = "";
    if (groupName !== "") {
        groupsLocalStorage.push([groupName]);
        localStorage.groups = JSON.stringify(groupsLocalStorage);
        localStorage.groupSelected = groupName;

        document.getElementById("collectionContainer").innerHTML = "";

        fillGroups();
    }
}

function getOrCreateGroups() {
    let groupsLocalStorage;
    // const test = getJSON("http://localhost:3000/groups");
    if (localStorage.getItem("groups") == undefined) {
        groupsLocalStorage = [];
    } else {
        groupsLocalStorage = JSON.parse(localStorage.groups);
        sendJSONStringWithPOST("http://localhost:3000/groups",
            JSON.stringify(groupsLocalStorage));
    }
    return groupsLocalStorage;
}

// async function requestTextWithGET(url) {
//     const response = await fetch(url);
//     console.log("response: " + response);
//     const text = await response.text();
//     console.log("text: " + text);
//     return text;
// }

// async function getJSON(url) {
//     const settings = { method: "Get" };
//     fetch(url, settings)
//         .then((res) => res.json())
//         .then((json) => {
//             console.log("json: " + json);
//             return json;
//         });
// }

function getOrCreateGroupSelected() {
    let groupSelected;
    if (localStorage.getItem("groupSelected") == undefined) {
        groupSelected = "";
    } else {
        groupSelected = localStorage.groupSelected;
        sendJSONStringWithPOST("http://localhost:3000/groupSelected",
            JSON.stringify(groupSelected));
    }
    return groupSelected;
}

function getGroupIndex() {
    const groupSelected = getOrCreateGroupSelected();
    const groupsLocalStorage = getOrCreateGroups();

    for (i = 0; i < groupsLocalStorage.length; i++) {
        if (groupsLocalStorage[i][0] == groupSelected) {
            sendJSONStringWithPOST("http://localhost:3000/groupIndex", JSON.stringify(i));
            localStorage.groupIndex = i;
            return i;
        }
    }
}

function getCardIndex() {
    const groupsLocalStorage = getOrCreateGroups();

    const groupIndex = getGroupIndex();
    if (localStorage.cardIndex == undefined) {
        cardIndex = groupsLocalStorage[groupIndex].length - 1;
    } else if (localStorage.cardIndex <= groupsLocalStorage[groupIndex].length - 1) {
        cardIndex = localStorage.cardIndex;
    } else {
        cardIndex = groupsLocalStorage[groupIndex].length - 1;
    }
    sendJSONStringWithPOST("http://localhost:3000/cardIndex", JSON.stringify(cardIndex));
    return cardIndex;
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

    const newValue = e.target.textContent;
    const titleElem = document.querySelector(".dropdown .title");

    titleElem.textContent = newValue;

    localStorage.groupSelected = newValue;

    if (document.getElementById("front") != null) {
        fillFlashcards();
    }

    if (document.getElementById("groupTitle") != null) {
        fillGroups();
    }
}

async function sendJSONStringWithPOST(url, jsonString) {
    const response = await fetch(url, {
        method: "post",
        body: jsonString
    });
}


