declare const modelNamesAndRows: DBAdmin.IModelNameAndRows[];
declare const title: string;

// set title
document.getElementById("title").innerHTML = `${title}'s Database`;

// set models
modelNamesAndRows.forEach((modelNameAndRow: DBAdmin.IModelNameAndRows) => {
    const a: HTMLAnchorElement = document.createElement("a");
    const addItemTd: HTMLTableDataCellElement = document.createElement("td");
    const addItemLink: HTMLAnchorElement = document.createElement("a");
    const nameTd: HTMLTableDataCellElement = document.createElement("td");
    const numOfRowsTd: HTMLTableDataCellElement = document.createElement("td");
    const tr: HTMLTableRowElement = document.createElement("tr");

    // fetch the number of rows in the current table and put it in the TD
    // 1. Find out how to get the number of rows in the current model (table)
    // 2. Put in into the td

    a.innerHTML = modelNameAndRow.name;
    a.href = `/models/${modelNameAndRow.name}`;
    nameTd.appendChild(a);

    addItemLink.innerHTML = "Add item";
    addItemLink.href = `/models/${modelNameAndRow.name}/create`;
    addItemTd.appendChild(addItemLink);

    numOfRowsTd.innerHTML = modelNameAndRow.rows.toString();

    tr.appendChild(nameTd);
    tr.appendChild(numOfRowsTd);
    document.querySelector("#models tbody").appendChild(tr);
});
