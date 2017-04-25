fetch("/_config").then(response => response.json().then(config => {

    // set title
    document.getElementById("title").innerHTML = `${config.title}'s Database`;

    // set models
    config.models.forEach(model => {
        const a: HTMLAnchorElement = document.createElement("a");
        const addItemTd: HTMLTableDataCellElement = document.createElement("td");
        const addItemLink: HTMLAnchorElement = document.createElement("a");
        const nameTd: HTMLTableDataCellElement = document.createElement("td");
        const numOfRowsTd: HTMLTableDataCellElement = document.createElement("td");
        const tr: HTMLTableRowElement = document.createElement("tr");

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
// close fetch