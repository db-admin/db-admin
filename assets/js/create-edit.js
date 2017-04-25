var form = document.querySelector("form"); // the form HTML elements
var submitButton = document.createElement("input"); // the sumbit button
var cancelButton = document.createElement("button"); // the cancel button
var isEditing = recordId != null;
console.log(attributes);
var modelEditing; // what the user is currently editing (initially as null)
var numOfSelects = 0; // the number of <select> HTML elements
var numOfSelectsPopulated = 0; // the number of <select> HTML elements
var _loop_1 = function (key) {
    if (attributes.hasOwnProperty(key)) {
        return "continue";
    }
    var container = document.createElement("div"); // container for the current for input
    var label = document.createElement("label");
    var labelAfter = document.createElement("label");
    var inputType = getInputType(attributes[key]);
    var formHelpers = attributes[key].formHelpers;
    var addAnchor = void 0; // the container for buttons for <select>
    var input = void 0; // the input for this attribute
    var addSelect = void 0; // the add button for <select>
    var refreshSelect = void 0; // the refresh button for <select>
    // if is select box (if requires foreign table)
    if (["select", "multiselect"].indexOf(inputType) !== -1) {
        var foreignTable = inputType === "multiselect" ? attributes[key].collection : attributes[key].model;
        input = document.createElement("select");
        if (input instanceof HTMLSelectElement) {
            input.multiple = inputType === "multiselect";
        }
        // see https://github.com/balderdashy/sails/issues/3946
        // therefore, disabled
        // if(attributes[key].through){
        //   input.disabled = 'disabled';
        //   input.setAttribute('title', 'This attribute uses the "through" property which is currently not' +
        //      'supported to do a SailsJS bug. See the SailsJS GitHub issue #3946')
        // }
        // create add button
        var otherModel = attributes[key].model ? attributes[key].model : attributes[key].collection;
        addAnchor = document.createElement("div");
        addSelect = document.createElement("a");
        addSelect.href = "/models/" + otherModel + "/create";
        addSelect.target = "_blank";
        addSelect.innerHTML = "Add new " + otherModel;
        addSelect.classList.add("button-add");
        addAnchor.appendChild(addSelect);
        addAnchor.appendChild(document.createElement("br"));
        // create Refresh Button
        refreshSelect = document.createElement("a");
        refreshSelect.href = "javascript:;";
        refreshSelect.classList.add("button-add");
        refreshSelect.innerHTML = "Refresh " + key;
        addAnchor.appendChild(refreshSelect);
        addAnchor.style.display = "block";
        refreshSelect.addEventListener("click", function (event) {
            var otherModel = attributes[key].model ? attributes[key].model : attributes[key].collection;
            var input = document.querySelector("form select[name=" + key + "]");
            input.innerHTML = "";
            // gets the options for selected boxes (remember, this can run multiple times)
            fetch("/" + otherModel).then(function (response) { return response.json().then(function (results) {
                // populate the select box with the foreign table records
                if (inputType !== "multiselect") {
                    var nullOption = document.createElement("option");
                    input.appendChild(nullOption);
                }
                results.forEach(function (result) {
                    var option = document.createElement("option");
                    option.value = result.id;
                    option.innerHTML = "#" + result.id + " " + result.name;
                    // console.log(option);
                    input.appendChild(option);
                });
                loadEditingModel();
            }); });
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
    input.id = "model-" + key;
    input.name = key;
    // add the form helpers
    if (formHelpers) {
        input.setAttribute("title", "Description: " + formHelpers.description);
        input.setAttribute("placeholder", formHelpers.placeholder + " (Eg: " + formHelpers.example + ")");
    }
    // create the label
    label.htmlFor = input.id;
    label.innerHTML = key + ": ";
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
};
// algorithm:
// 1. Load the form elements
// 2. Load the foreign records if needed
// 3. Populate the form elements (by filling out their values, if the user is editing)
// 1. Create input for each attribute
for (var key in attributes) {
    _loop_1(key);
}
// 2. Populate the input elements that require foreign records
if (form.getElementsByTagName("select").length !== 0) {
    var _loop_2 = function (key) {
        if (!attributes.hasOwnProperty(key)) {
            return "continue";
        }
        var otherModel = attributes[key].model ? attributes[key].model : attributes[key].collection;
        var inputType = getInputType(attributes[key]);
        var input = document.querySelector("form select[name=" + key + "]");
        if (!input) {
            return "continue";
        } // the current element is not a <select> skip
        numOfSelects++;
        // gets the options for selected boxes (remember, this can run multiple times)
        fetch("/" + otherModel).then(function (response) { return response.json().then(function (results) {
            // add empty options for single selects
            if (inputType !== "multiselect") {
                var nullOption = document.createElement("option");
                input.appendChild(nullOption);
            } // else {
            // populate the select box with the foreign table records
            results.forEach(function (result) {
                var option = document.createElement("option");
                option.value = result.id;
                console.log(result);
                option.innerHTML = "#" + result.id + " " + result.name;
                input.appendChild(option);
            });
            numOfSelectsPopulated++;
            // if finished populating all the <selects>
            if (numOfSelectsPopulated === numOfSelects) {
                loadEditingModel();
            }
            // }
        }); }); // end fetch
    };
    // if there are some select inputs
    for (var key in attributes) {
        _loop_2(key);
    }
}
else {
    // there's no select inputs
    loadEditingModel();
}
function loadAttributeData(attributes, key) {
    var input = document.querySelector("form select[name=" + key + "]");
    if (!input) {
        continue;
    } // the current element is not a <select> skip
    var inputType = getInputType(attributes[key]);
    var foreignTable = inputType === "multiselect" ? attributes[key].collection : attributes[key].model;
    numOfSelects++;
    fetch("/" + foreignTable).then(function (response) { return response.json().then(function (results) {
        // add empty options for single selects
        if (inputType !== "multiselect") {
            var nullOption = document.createElement("option");
            input.appendChild(nullOption);
        }
        else {
            // populate the select box with the foreign table records
            results.forEach(function (result) {
                var option = document.createElement("option");
                option.value = result.id;
                option.innerHTML = "#" + result.id + " " + result.name;
                input.appendChild(option);
            });
            numOfSelectsPopulated++;
            // if finished populating all the <selects>
            if (numOfSelectsPopulated === numOfSelects) {
                loadEditingModel();
            }
        }
    }); }); // end fetch
}
// 3. Populate form elements
function loadEditingModel() {
    // gets the current editing model (if editing). (And this needs to finish first!)
    if (isEditing) {
        fetch("/" + table + "/" + recordId).then(function (results) { return results.json().then(function (result) {
            console.log("Model editing:", result);
            modelEditing = result;
            title.innerHTML = result.name;
            var _loop_3 = function (i) {
                var input = form.elements[i]; // get the current item
                var currentValue = modelEditing[input.name]; // the value of the current record attribute
                // console.log(input.name);
                if (!currentValue) {
                    return "continue";
                }
                // if is <select multiple> element
                if (input.tagName === "SELECT" && input.multiple) {
                    var options = input.getElementsByTagName("option");
                    for (var j = 0; j < options.length; j++) {
                        var valueIds = currentValue.map(function (item) { return item.id; });
                        var option = options[j];
                        if (valueIds.indexOf(Number(option.value)) !== -1) {
                            option.selected = true;
                        }
                    }
                }
                else if (input.tagName === "SELECT") {
                    var options = Array.from(input.childNodes);
                    if (!currentValue) {
                        options.filter(function (x) { return !x.value; })[0].setAttribute("selected", "selected");
                    }
                    else {
                        options.filter(function (x) { return x.value === currentValue.id; })[0].setAttribute("selected", "selected");
                    }
                }
                else if (input.type === "datetime-local") {
                    input.setAttribute("value", new Date(currentValue).toISOString().slice(0, 22));
                }
                else {
                    input.value = currentValue;
                }
            };
            // for each form item
            for (var i = 0; i < form.elements.length; i++) {
                _loop_3(i);
            }
        }); });
    }
}
// on form submit
form.addEventListener("submit", function (event) {
    var data = {};
    event.preventDefault();
    // convert all empty strings to null. They're empty strings by default
    // which errors in postgres for non- string attributes (like datetime).
    var dateTimeInputs = Array.from(document.querySelectorAll("input[type=datetime-local], input[type=number], input[type=text]"));
    dateTimeInputs.forEach(function (input) { return input.value === "" ? input.name = "" : null; }); // so it wont be sent to the server
    // convert selects that have no value and are not multiple to nulls
    Array.from(document.getElementsByTagName("select")).forEach(function (select) {
        if (select.multiple) {
            return;
        }
        if (select.value !== "") {
            return;
        }
        select.name = null;
    });
    fetch("/" + table + (recordId ? "/" + recordId : ""), {
        "method": recordId ? "PUT" : "POST",
        "body": new FormData(form) // this is cool!
    }).then(function (response) {
        response.json().then(function (jsonResults) {
            location.href = "/models/" + table + "?highlight=" + jsonResults.id;
        }, function (error) { return console.log(error); });
    }, function (error) {
        console.log("didnt work because idk");
    });
});
// add submit button
submitButton.type = "submit";
form.appendChild(submitButton);
// on cancel clicked
cancelButton.addEventListener("click", function (event) {
    location.href = "/models/" + table;
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