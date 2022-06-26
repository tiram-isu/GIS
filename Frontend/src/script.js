const front = document.getElementById("front");
const back = document.getElementById("back");

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

    if (groupSelected == "" || groupSelected == "undefined" || groupSelected == null) {
        document.getElementById("error").innerHTML = "Es muss eine Sammlung ausgewählt werden.";
    } else if (inputFront != "" && inputBack != "") {
        addCardToCollection(inputFront, inputBack, groupSelected);

        localStorage.index = await groupLength(groupSelected);

        front.innerHTML = inputFront;
        back.innerHTML = inputBack;

        document.getElementById("newFront").value = "";
        document.getElementById("newBack").value = "";

        document.getElementById("error").innerHTML = "";
    }
}

// flashcards
async function fillFlashcards() {
    let index = localStorage.getItem("index");
    const groupSelected = localStorage.getItem("groupSelected");

    if (index !== "undefined" && index !== null && groupSelected !== "") {
        const length = await groupLength(groupSelected);
        if (index < 0 || index >= length) {
            index = length - 1;
        }
        if (length != 0) {
            const card = await getCard(groupSelected, index);
            front.innerHTML = card.front;
            document.getElementById("position").innerHTML = await Number(index) + 1 + "/" + length;
        } else {
            front.innerHTML = "";
            document.getElementById("position").innerHTML = "0/0";
        }

        document.getElementById("titleFront").innerHTML = "Vorderseite";
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

    if (groupSelected != "" && groupSelected != null) {
        dropdownTitle.innerHTML = groupSelected;
        localStorage.groupSelected = groupSelected;
    } else {
        dropdownTitle.innerHTML = "Sammlungen";
    }

    const toDelete = document.querySelectorAll(".option");
    toDelete.forEach((option) => {
        option.remove();
    });

    let collections = await getGroupsFromServer();
    collections = JSON.parse(collections);

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
    const groupSelected = localStorage.getItem("groupSelected");
    let index = Number(localStorage.getItem("index")) - 1;
    const length = await groupLength(groupSelected);

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
    const groupSelected = localStorage.getItem("groupSelected");
    let index = Number(localStorage.getItem("index")) + 1;
    const length = await groupLength(groupSelected);

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
    const groupSelected = localStorage.getItem("groupSelected");
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
async function deleteCard() {
    const groupSelected = localStorage.getItem("groupSelected");
    const index = Number(localStorage.getItem("index"));
    await deleteCardFromCollection(index, groupSelected);
    localStorage.index = index - 1;

    fillFlashcards();
}

// groups
// eslint-disable-next-line no-unused-vars
async function fillGroups() {
    const groupSelected = localStorage.getItem("groupSelected");
    document.getElementById("collectionContainer").innerHTML = "";
    if (groupSelected != "" && groupSelected != null) {
        document.getElementById("groupTitle").innerHTML = groupSelected;
        document.getElementById("groupInfo").innerHTML =
            "Anzahl Karteikarten: " + await groupLength(groupSelected);
    } else {
        document.getElementById("groupTitle").innerHTML = "Bitte Sammlung auswählen";
        document.getElementById("groupInfo").innerHTML = "";
    }

    createGroupsDropdown();
}

// eslint-disable-next-line no-unused-vars
async function addGroup() {
    groupName = document.getElementById("collectionName").value;
    document.getElementById("collectionName").value = "";
    if (groupName !== "") {
        addGroupToCollection(groupName);
        document.getElementById("collectionContainer").innerHTML = "";
        await groupLength();

        fillGroups();
    }
}

// eslint-disable-next-line no-unused-vars
async function deleteGroup() {
    const groupSelected = localStorage.getItem("groupSelected");
    if (groupSelected != "" && groupSelected != null) {
        await deleteGroupFromCollection(groupSelected);
    }
    localStorage.groupSelected = "";

    fillGroups();
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
        return new Card(text[0], text[1], text[2], text[3]);
    }
}

async function groupLength(groupName) {
    const response = await fetch(
        `http://localhost:3000/groupLength?groupName=${groupName}`
    );
    const text = await response.text();

    return text;
}

async function addCardToCollection(front, back, groupName) {
    const length = await groupLength(groupName);
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
    &groupName=${groupName}`);
}

async function getGroupsFromServer() {
    const response = await fetch("http://localhost:3000/getGroups");
    const text = await response.text();
    return text;
}

async function addGroupToCollection(groupName) {
    await add("http://localhost:3000/createGroup", groupName);
}

async function deleteGroupFromCollection(groupName) {
    await fetch(`http://localhost:3000/deleteGroup?groupName=${groupName}`);
}