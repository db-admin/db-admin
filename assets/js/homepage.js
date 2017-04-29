fetch("/_config").then(response => response.json().then(config => {
    // set title
    document.getElementById("title").innerHTML = `${config.title}'s Database`;
    // set models
    config.models.forEach(model => {
        const a = document.createElement("a");
        const addItemTd = document.createElement("td");
        const addItemLink = document.createElement("a");
        const nameTd = document.createElement("td");
        const numOfRowsTd = document.createElement("td");
        const tr = document.createElement("tr");
        // fetch the number of rows in the current table and put it in the TD
        // 1. Find out how to get the number of rows in the current model (table)
        // 2. Put in into the td
        a.innerHTML = model;
        a.href = `/models/${model}`;
        nameTd.appendChild(a);
        addItemLink.innerHTML = "Add item";
        addItemLink.href = `/models/${model}/create`;
        addItemTd.appendChild(addItemLink);
        // get number of rows
        fetch(`/${model}/count`)
            .then(response => response.text())
            .then(response => {
            numOfRowsTd.innerHTML = response;
            tr.appendChild(numOfRowsTd);
        });
        tr.appendChild(nameTd);
        document.querySelector("#models tbody").appendChild(tr);
    });
}));
//# sourceMappingURL=homepage.js.map