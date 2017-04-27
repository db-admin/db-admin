fetch("/_config").then(function (response) { return response.json().then(function (config) {
    // set title
    document.getElementById("title").innerHTML = config.title + "'s Database";
    // set models
    config.models.forEach(function (model) {
        var a = document.createElement("a");
        var addItemTd = document.createElement("td");
        var addItemLink = document.createElement("a");
        var nameTd = document.createElement("td");
        var numOfRowsTd = document.createElement("td");
        var tr = document.createElement("tr");
        // fetch the number of rows in the current table and put it in the TD
        // 1. Find out how to get the number of rows in the current model (table)
        // 2. Put in into the td
        a.innerHTML = model;
        a.href = "/models/" + model;
        nameTd.appendChild(a);
        addItemLink.innerHTML = "Add item";
        addItemLink.href = "/models/" + model + "/create";
        addItemTd.appendChild(addItemLink);
        // get number of rows
        fetch("/" + model + "/count")
            .then(function (response) { return response.text(); })
            .then(function (response) {
            numOfRowsTd.innerHTML = response;
            tr.appendChild(numOfRowsTd);
        });
        tr.appendChild(nameTd);
        document.querySelector("#models tbody").appendChild(tr);
    });
}); });
//# sourceMappingURL=homepage.js.map