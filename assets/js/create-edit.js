const form = document.querySelector("form"); // the form HTML elements
const submitButton = document.createElement("input"); // the sumbit button
const cancelButton = document.createElement("button"); // the cancel button
const isEditing = recordId != null;
console.log(attributes);
let modelEditing; // what the user is currently editing (initially as null)
let numOfSelects = 0; // the number of <select> HTML elements
let numOfSelectsPopulated = 0; // the number of <select> HTML elements
// algorithm:
// 1. Load the form elements
// 2. Load the foreign records if needed
// 3. Populate the form elements (by filling out their values, if the user is editing)
// 1. Create input for each attribute
for (let key in attributes) {
    if (!attributes.hasOwnProperty(key)) {
        continue;
    }
    const container = document.createElement("div"); // container for the current for input
    const label = document.createElement("label");
    const labelAfter = document.createElement("label");
    const inputType = getInputType(attributes[key]);
    const formHelpers = attributes[key].formHelpers;
    let addAnchor; // the container for buttons for <select>
    let input; // the input for this attribute
    let addSelect; // the add button for <select>
    let refreshSelect; // the refresh button for <select>
    // if is select box (if requires foreign table)
    if (["select", "multiselect"].indexOf(inputType) !== -1) {
        const foreignTable = inputType === "multiselect" ? attributes[key].collection : attributes[key].model;
        input = document.createElement("select");
        if (input instanceof HTMLSelectElement) {
            input.multiple = inputType === "multiselect";
        }
        // create add button
        let otherModel = attributes[key].model ? attributes[key].model : attributes[key].collection;
        addAnchor = document.createElement("div");
        addSelect = document.createElement("a");
        addSelect.href = `/models/${otherModel}/create`;
        addSelect.target = "_blank";
        addSelect.innerHTML = `Add new ${otherModel}`;
        addSelect.classList.add("button-add");
        addAnchor.appendChild(addSelect);
        addAnchor.appendChild(document.createElement("br"));
        // create Refresh Button
        refreshSelect = document.createElement("a");
        refreshSelect.href = "javascript:;";
        refreshSelect.classList.add("button-add");
        refreshSelect.innerHTML = `Refresh ${key}`;
        addAnchor.appendChild(refreshSelect);
        addAnchor.style.display = "block";
        refreshSelect.addEventListener("click", event => {
            let otherModel = attributes[key].model ? attributes[key].model : attributes[key].collection;
            let input = document.querySelector(`form select[name=${key}]`);
            input.innerHTML = "";
            // gets the options for selected boxes (remember, this can run multiple times)
            fetch(`/${otherModel}`).then(response => response.json().then(results => {
                // populate the select box with the foreign table records
                if (inputType !== "multiselect") {
                    const nullOption = document.createElement("option");
                    input.appendChild(nullOption);
                }
                results.forEach(result => {
                    const option = document.createElement("option");
                    option.value = result.id;
                    option.innerHTML = `#${result.id} ${result.name}`;
                    // console.log(option);
                    input.appendChild(option);
                });
                loadEditingModel();
            }));
        });
    }
    else {
        // regular input
        input = document.createElement("input");
        if (input instanceof HTMLInputElement) {
            input.type = inputType;
        }
    }
    // finish the input element
    input.id = `model-${key}`;
    input.name = key;
    // add the form helpers
    if (formHelpers) {
        input.setAttribute("title", `Description: ${formHelpers.description}`);
        input.setAttribute("placeholder", `${formHelpers.placeholder} (Eg: ${formHelpers.example})`);
    }
    // create the label
    label.htmlFor = input.id;
    label.innerHTML = `${key}: `;
    if (attributes[key].type === "datetime") {
        label.innerHTML += "(UTC) ";
    }
    // append to the input container
    container.appendChild(label);
    container.appendChild(input);
    if (addAnchor) {
        input.style.flex = "80";
        addAnchor.style.flex = "10";
        container.appendChild(addAnchor);
    }
    // append to the form
    form.appendChild(container);
}
// 2. Populate the input elements that require foreign records
if (form.getElementsByTagName("select").length !== 0) {
    // if there are some select inputs
    for (let key in attributes) {
        if (!attributes.hasOwnProperty(key)) {
            continue;
        }
        const otherModel = attributes[key].model ? attributes[key].model : attributes[key].collection;
        const inputType = getInputType(attributes[key]);
        const input = document.querySelector(`form select[name=${key}]`);
        if (!input) {
            continue;
        } // the current element is not a <select> skip
        numOfSelects++;
        // gets the options for selected boxes (remember, this can run multiple times)
        fetch(`/${otherModel}`).then(response => response.json().then(results => {
            // add empty options for single selects
            if (inputType !== "multiselect") {
                const nullOption = document.createElement("option");
                input.appendChild(nullOption);
            } // else {
            // populate the select box with the foreign table records
            results.forEach(result => {
                const option = document.createElement("option");
                option.value = result.id;
                console.log(result);
                option.innerHTML = `#${result.id} ${result.name}`;
                input.appendChild(option);
            });
            numOfSelectsPopulated++;
            // if finished populating all the <selects>
            if (numOfSelectsPopulated === numOfSelects) {
                loadEditingModel();
            }
            // }
        })); // end fetch
    }
}
else {
    // there's no select inputs
    loadEditingModel();
}
// 3. Populate form elements
function loadEditingModel() {
    // gets the current editing model (if editing). (And this needs to finish first!)
    if (isEditing) {
        fetch(`/${table}/${recordId}`).then(results => results.json().then(result => {
            const title = document.getElementById("title");
            console.log("Model editing:", result);
            modelEditing = result;
            title.innerHTML = result.name;
            // for each form item
            for (let i = 0; i < form.elements.length; i++) {
                // get the current item
                const input = form.elements[i];
                const currentValue = modelEditing[input.name]; // the value of the current record attribute
                if (!currentValue) {
                    continue;
                }
                if (input instanceof HTMLSelectElement && input.multiple) {
                    const options = input.getElementsByTagName("option");
                    for (let j = 0; j < options.length; j++) {
                        const valueIds = currentValue.map(item => item.id);
                        const option = options[j];
                        if (valueIds.indexOf(Number(option.value)) !== -1) {
                            option.selected = true;
                        }
                    }
                }
                else if (input instanceof HTMLSelectElement) {
                    const options = Array.from(input.childNodes);
                    if (!currentValue) {
                        options.filter(x => !x.value)[0].setAttribute("selected", "selected");
                    }
                    else {
                        options.filter(x => Number(x.value) === currentValue.id)[0].setAttribute("selected", "selected");
                    }
                }
                else if (input.type === "datetime-local") {
                    input.setAttribute("value", new Date(currentValue).toISOString().slice(0, 22));
                }
                else {
                    input.value = currentValue;
                }
            }
        }));
    }
}
// on form submit
form.addEventListener("submit", event => {
    const data = {};
    event.preventDefault();
    // convert all empty strings to null. They're empty strings by default
    // which errors in postgres for non- string attributes (like datetime).
    const dateTimeInputs = Array.from(document.querySelectorAll("input[type=datetime-local], input[type=number], input[type=text]"));
    dateTimeInputs.forEach(input => input.value === "" ? input.name = "" : null); // so it wont be sent to the server
    // convert selects that have no value and are not multiple to nulls
    Array.from(document.getElementsByTagName("select")).forEach((select) => {
        if (select.multiple) {
            return;
        }
        if (select.value !== "") {
            return;
        }
        select.name = null;
    });
    fetch(`/${table}` + (recordId ? `/${recordId}` : ""), {
        "method": recordId ? "PUT" : "POST",
        "body": new FormData(form) // this is cool!
    }).then(response => {
        response.json().then(jsonResults => {
            location.href = `/models/${table}?highlight=${jsonResults.id}`;
        }, error => console.log(error));
    }, error => {
        console.log("didnt work because idk");
    });
});
// add submit button
submitButton.type = "submit";
form.appendChild(submitButton);
// on cancel clicked
cancelButton.addEventListener("click", event => {
    location.href = `/models/${table}`;
    return false;
});
// add cancel button
cancelButton.type = "button";
cancelButton.innerHTML = "Cancel";
cancelButton.type = "button";
form.appendChild(cancelButton);
function getInputType(attribute) {
    if (attribute.model) {
        return "select";
    }
    if (attribute.collection) {
        return "multiselect";
    }
    return {
        "string": "text",
        "integer": "number",
        "datetime": "datetime-local",
        "url": "url"
    }[attribute.type];
}
//# sourceMappingURL=create-edit.js.map