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
    console.log("groupSelected (addCard): " + groupSelected);

    if (groupSelected == "" || groupSelected == "undefined" || groupSelected == null) {
        document.getElementById("error").innerHTML = "Es muss eine Sammlung ausgewählt werden.";
    } else if (inputFront != "" && inputBack != "") {
        addCardToCollection(inputFront, inputBack, groupSelected);

        localStorage.index = await groupLength(groupSelected);

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
        const length = await groupLength(groupSelected);

        if (length != 0) {
            const card = await getCard(groupSelected, index);
            console.log("index: " + index + " Card: " + card + " Length: " + length);
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

    // fillCards();
}

// groups
// eslint-disable-next-line no-unused-vars
async function fillGroups() {
    const groupSelected = localStorage.getItem("groupSelected");
    document.getElementById("collectionContainer").innerHTML = "";
    document.getElementById("groupTitle").innerHTML = groupSelected;
    document.getElementById("groupInfo").innerHTML =
        "Anzahl Karteikarten: " + await groupLength(groupSelected);

    createGroupsDropdown();
}

// eslint-disable-next-line no-unused-vars
function addGroup() {
    groupName = document.getElementById("collectionName").value;
    document.getElementById("collectionName").value = "";
    if (groupName !== "") {
        addGroupToCollection(groupName);

        document.getElementById("collectionContainer").innerHTML = "";

        fillGroups();
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
    const length = await groupLength(groupName);
    console.log("addCardToCollection: groupName: " + groupName + " Length: " + length +
        "Front: " + front + "Back: " + back);
    await add(
        `http://localhost:3000/cards?groupName=${groupName}`,
        JSON.stringify({
            cardPosition: length,
            front: front,
            back: back
        })
    );
    console.log("Gruppen (addCard): " + await getGroupsFromServer());
}

async function deleteCardFromCollection(index, groupName) {
    await fetch(`http://localhost:3000/deleteCard?index=${index}
    &groupName=${JSON.stringify(groupName)}`);
    console.log("delete: groupName: " + groupName + " index: " + index);
}

async function getGroupsFromServer() {
    const response = await fetch("http://localhost:3000/getGroups");
    const text = await response.text();
    console.log(text);
    return text;
}

async function addGroupToCollection(groupName) {
    await add("http://localhost:3000/createGroup", groupName);
}

async function test() {
    // await addGroupToCollection("dd");
    // const card = await getCard("aa", 0);
    // console.log(card);
    // await deleteCardFromDatabase(0, JSON.stringify("test2"));
    // await addCardToCollection("front", "back", "test");
    // await groupLength("test");
    // await addCardToCollection("front", "back", "aua");
    // await groupLength("aua");
    // await addGroupToCollection("test5");
    // await fetch("http://localhost:3000/deleteAllCards?groupName=\"deleteAll\"");
    // await getCard("test", 0);
    // console.log(await getCard("test", 0));
    // await getGroupsFromServer();
    // await addGroupToCollection("please");
}

test();