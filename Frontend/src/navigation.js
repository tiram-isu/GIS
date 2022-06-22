fetch("navigation.html")
    .then((res) => res.text())
    .then((text) => {
        const oldelem = document.querySelector("script#replace_with_navbar");
        const newelem = document.createElement("div");
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem, oldelem);
    });