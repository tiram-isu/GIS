const front = document.getElementById("front");
const back = document.getElementById("back");
let cardIndex;
let groupIndex;

class Card {
    constructor(id, position, front, back) {
        this.id = id;
        this.position = position;
        this.front = front;
        this.back = back;
    }
}

// eslint-disable-next-line no-unused-vars
async function addCard() {
    const inputFront = document.getElementById("newFront").value;
    const inputBack = document.getElementById("newBack").value;
    const groupSelected = localStorage.getItem("groupSelected");

    if (groupSelected == "" || groupSelected == "undefined") {
        document.getElementById("error").innerHTML = "Es muss eine Sammlung ausgewählt werden.";
    } else if (inputFront != "" && inputBack != "") {
        addCardToCollection(inputFront, inputBack, groupSelected);

        // localStorage.index = Number(localStorage.getItem("index")) + 1;
        localStorage.index = await groupLength(JSON.stringify(groupSelected));

        front.innerHTML = inputFront;
        back.innerHTML = inputBack;

        document.getElementById("newFront").value = "";
        document.getElementById("newBack").value = "";
    }
}

// flashcards
async function fillFlashcards() {
    const index = localStorage.getItem("index");
    const groupSelected = localStorage.getItem("groupSelected");

    if (index !== "undefined" && index !== null) {
        const length = await groupLength(JSON.stringify(groupSelected));

        if (length !== 0) {
            const card = await getCard(groupSelected, index);
            console.log("index: " + index + "Card: " + card);
            front.innerHTML = card.front;
        } else {
            front.innerHTML = "";
        }

        document.getElementById("titleFront").innerHTML = "Vorderseite";
        document.getElementById("position").innerHTML = await Number(index) + 1 + "/" + length;
    }
}

// eslint-disable-next-line no-unused-vars
function flashcardsDropdown() {
    fillFlashcards();
    createGroupsDropdown();
}


async function createGroupsDropdown() {
    const dropdownTitle = document.querySelector(".dropdown .title");
    dropdownTitle.addEventListener("click", toggleMenuDisplay);
    const groupSelected = localStorage.getItem("groupSelected");

    if (groupSelected != "") {
        dropdownTitle.innerHTML = groupSelected;
        localStorage.groupSelected = groupSelected;
    }

    const toDelete = document.querySelectorAll(".option");
    toDelete.forEach((option) => {
        option.remove();
    });

    let collections = await getGroupsFromServer();
    collections = JSON.parse(collections);
    console.log(collections);

    for (i = 0; i < collections.length; i++) {
        const groupsDropdown = document.createElement("div");
        groupsDropdown.classList.add("option");
        groupsDropdown.addEventListener("click", handleOptionSelected);
        groupsDropdown.innerHTML = collections[i];
        document.getElementById("dropdown-content").appendChild(groupsDropdown);
    }
}

// eslint-disable-next-line no-unused-vars
async function previousCard() {
    let index = Number(localStorage.getItem("index")) - 1;
    const length = await groupLength(JSON.stringify(groupSelected));

    if (index < 0) {
        index = length - 1;
    }

    if (index >= 0 && index < length) {
        localStorage.index = index;
        fillFlashcards();
    }
}

// eslint-disable-next-line no-unused-vars
async function nextCard() {
    let index = Number(localStorage.getItem("index")) + 1;
    const length = await groupLength(JSON.stringify(groupSelected));
    console.log(index);

    if (index >= length) {
        index = 0;
    }

    if (index >= 0 && index < length) {
        localStorage.index = index;
        fillFlashcards();
    }
}

// eslint-disable-next-line no-unused-vars
async function flip() {
    const index = Number(localStorage.getItem("index"));
    const titleFront = document.getElementById("titleFront");
    const card = await getCard(groupSelected, index);

    if (titleFront.innerHTML === "Vorderseite") {
        document.getElementById("titleFront").innerHTML = "Rückseite";
        front.innerHTML = card.back;
        return;
    }

    if (titleFront.innerHTML === "Rückseite") {
        document.getElementById("titleFront").innerHTML = "Vorderseite";
        front.innerHTML = card.front;
        return;
    }
}

// eslint-disable-next-line no-unused-vars
function deleteCard() {
    const groupsLocalStorage = getGroups();
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
async function fillGroups() {
    const groupSelected = localStorage.getItem("groupSelected");
    document.getElementById("collectionContainer").innerHTML = "";
    document.getElementById("groupTitle").innerHTML = groupSelected;
    document.getElementById("groupInfo").innerHTML =
        "Anzahl Karteikarten: " + await groupLength(JSON.stringify(groupSelected));

    createGroupsDropdown();
}

// eslint-disable-next-line no-unused-vars
function addGroup() {
    groupName = document.getElementById("collectionName").value;
    document.getElementById("collectionName").value = "";
    if (groupName !== "") {
        addGroupToCollection(groupName);

        document.getElementById("collectionContainer").innerHTML = "";

        // fillGroups();
    }
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

function getGroupIndex() {
    const groupSelected = getOrCreateGroupSelected();
    const groupsLocalStorage = getGroups();

    for (i = 0; i < groupsLocalStorage.length; i++) {
        if (groupsLocalStorage[i][0] == groupSelected) {
            localStorage.groupIndex = i;
            return i;
        }
    }
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

async function add(url, jsonString) {
    await fetch(url, {
        method: "post",
        body: jsonString
    });
}

async function getCard(groupName, cardPosition) {
    const response = await fetch(
        `http://localhost:3000/cards?groupName=${groupName}&cardPosition=${cardPosition}`
    );
    let text = await response.text();
    if (text != "" && text !== "null") {
        text = JSON.parse(text);
        text = Object.values(text);
        console.log(new Card(text[0], text[1], text[2], text[3]));
        return new Card(text[0], text[1], text[2], text[3]);
    }
}

async function groupLength(groupName) {
    const response = await fetch(
        `http://localhost:3000/groupLength?groupName=${groupName}`
    );
    const text = await response.text();
    console.log("Länge: " + JSON.parse(text));

    return text;
}

async function addCardToCollection(front, back, groupName) {
    const length = await groupLength(JSON.stringify(groupName));
    console.log("Length: " + length + "Front: " + front + "Back: " + back);
    await add(
        `http://localhost:3000/cards?groupName=${groupName}`,
        JSON.stringify({
            cardPosition: length,
            front: front,
            back: back
        })
    );
}

async function deleteCardFromCollection(index, groupName) {
    await fetch(`http://localhost:3000/deleteCard?index=${index}
    &groupName=${JSON.stringify(groupName)}`);
}

async function addGroupToCollection(groupName) {
    await addCardToCollection("toDelete", "toDelete", groupName);
    await deleteCardFromCollection(0, groupName);
}

async function getGroupsFromServer() {
    const response = await fetch("http://localhost:3000/getGroups");
    const text = await response.text();
    console.log(text);
    return text;
}

async function test() {
    // await addGroupToCollection("dd");
    // const card = await getCard("aa", 0);
    // console.log(card);
    // await deleteCardFromDatabase(0, JSON.stringify("test2"));
    // await addCardToCollection("front", "back", "test");
    // await groupLength(JSON.stringify("test"));
    // await addCardToCollection("front", "back", "aua");
    // await groupLength(JSON.stringify("aua"));
    // await addGroupToCollection("test5");
    // await fetch("http://localhost:3000/deleteAllCards?groupName=\"deleteAll\"");
    // await getCard("test", 0);
    // console.log(await getCard("test", 0));
    await getGroupsFromServer();
}

test();