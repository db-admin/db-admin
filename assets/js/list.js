/**
 * helper class for the list page
 */
var ModelList = (function () {
    /**
     * creates a ModelList helper object.
     *
     * @param {string} modelName The name of the model.
     * @param {Object} attributes The attributes of the model.
     */
    function ModelList(modelName, attributes) {
        this.modelName = modelName;
        this.attributes = attributes;
    }
    /**
     * Gets The data for the current model.
     * @return {promise} A promise to use to get the records.
     */
    ModelList.prototype.getRecords = function () {
        return fetch("/" + this.modelName).then(function (response) { return response.json(); });
    };
    /**
     * Sorts the attributes of the attributes object in a user friendly order.
     *
     * @returns {any[]} An array with the attributes sorted alphabetically.
     *
     * @memberOf ModelList
     */
    ModelList.prototype.getSortedAttributes = function () {
        var _this = this;
        var firstItems = ["id", "name"];
        var secondItems = ["createdAt", "updatedAt"];
        var sortedAttributesWithProperties;
        var sortedAttributes;
        // sort attributes in a user friendly order
        sortedAttributes = Object.keys(this.attributes) // get array of keys
            .filter(// take out pre-indexed items
        function (item) {
            return firstItems.indexOf(item) === -1 &&
                secondItems.indexOf(item) === -1;
        }).sort();
        // prepend first items and append last items
        sortedAttributes = firstItems.concat(sortedAttributes, secondItems);
        // convert the attributes back to their objects
        sortedAttributesWithProperties = sortedAttributes.map(function (attr) {
            var thingToReturn = {};
            thingToReturn[attr] = _this.attributes[attr];
            return thingToReturn;
        });
        return sortedAttributesWithProperties;
    };
    /**
     * Converts the value given to a user friendly string.
     *
     * @param {any} attributeValue The value of the attribute
     * @param {any} attributeProperties The properties of the attribute. This is used to determine the friendly name.
     * @returns {string} The friendly attribute name
     *
     * @memberOf ModelList
     */
    ModelList.prototype.getFriendlyValueName = function (attributeValue, attributeProperties) {
        if (attributeValue === null || attributeValue === undefined) {
            return null;
        }
        else if (attributeProperties.collection) {
            return attributeValue.length + " " + attributeProperties.collection;
        }
        else if (attributeProperties.model) {
            return attributeValue.name;
        }
        else if (["datetime"].indexOf(attributeProperties.type) !== -1) {
            var date = new Date(attributeValue);
            return date.toUTCString();
        }
        else {
            return attributeValue;
        }
    };
    /**
     * Deletes A record from the database.
     *
     * @param {*} record The record to delete.
     * @returns {Promise<Response>} A promise for the delete event.
     *
     * @memberOf ModelList
     */
    ModelList.prototype.deleteRecord = function (record) {
        return fetch("/" + modelList.modelName + "/" + record.id, {
            "method": "DELETE",
            "body": record
        });
    };
    /**
     * Checks whether is value is empty. By empty, what is meant is null,
     * undefined, empty string, or whitespace.
     *
     * @param {*} value The value to check if empty
     * @returns Whether the value is empty.
     *
     * @memberOf ModelList
     */
    ModelList.prototype.isEmpty = function (value) {
        var emptyValues = [null, undefined, ""];
        if (typeof value === "string") {
            value = value.replace(" ", "");
        }
        return emptyValues.indexOf(value) !== -1;
    };
    return ModelList;
}());
var modelName = currentModel.name; // inherited from list.ejs
var attributes = currentModel.attributes; // inherited from list.ejs
var modelList = new ModelList(modelName, attributes);
// when user submits search query
document.getElementById("form-search").addEventListener("submit", function (event) {
    event.preventDefault(); // prevents the page from reloading
    var query = document.getElementById("intput#search").value.toLowerCase();
    var trs = Array.from(document.querySelectorAll("table tbody tr"));
    // search filter algorithm
    var searchResults = trs.filter(function (tr) {
        if (!tr.dataset.value) {
            return false;
        }
        var value = JSON.parse(tr.dataset.value);
        var name = value.name.toLowerCase();
        return name.indexOf(query) !== -1;
    });
    // display the ones that pass the test
    trs.forEach(function (tr) {
        if (searchResults.indexOf(tr) !== -1) {
            tr.style.display = null;
        }
        else {
            tr.style.display = "none"; // invisible
        }
    });
});
// when the user submits the sort attribute <form>
document.getElementById("form-sort-attributes").addEventListener("submit", function (event) {
    event.preventDefault(); // prevent the default action of the submit button (because by default, it wil refresh the page)
    var attribute = document.getElementById("select-sort-attributes").value;
    var thForAttribute = document.querySelector("th[data-attribute=" + attribute + "]");
    thForAttribute.click();
});
// keyboard shortcuts for page
document.querySelector("body").addEventListener("keyup", function (event) {
    if (document.getElementById("search") === document.activeElement) {
        return;
    }
    switch (event.key) {
        case "n":
            document.getElementById("add-new").click();
            break;
        case "/":
            document.getElementById("search").focus();
    }
});
// handles the control panel toggle button
document.getElementsByClassName("toggle-control-panel")[0].addEventListener("click", function (event) {
    var controlPanel = document.getElementsByClassName("sidebar")[0];
    controlPanel.classList.toggle("minimized");
});
/** This creates the sort options (in the control panel) that users can select in the control bar */
(function createAttributeSortOptions() {
    var select = document.getElementById("select-sort-attributes");
    modelList.getSortedAttributes().forEach(function (attribute) {
        var attributeName = Object.keys(attribute)[0];
        var option = document.createElement("option");
        option.innerHTML = attributeName;
        select.appendChild(option);
    });
})();
/** Creates the attribute's check boxes */
(function createAttributeCheckboxes() {
    var fieldset = document.getElementById("fieldset-attributes");
    var toggleAllCheckbox = document.getElementById("toggle-attributes");
    toggleAllCheckbox.addEventListener("change", function (event) {
        var checked = event.target.checked;
        Array.from(document.getElementsByClassName("checkbox-attribute")).forEach(function (checkbox) { return checkbox.checked !== checked ? checkbox.click() : null; });
    });
    // output checkboxes for each attribute
    modelList.getSortedAttributes().forEach(function (attribute) {
        attribute = Object.keys(attribute)[0];
        var container = document.createElement("div");
        var checkbox = document.createElement("input");
        var label = document.createElement("label");
        checkbox.type = "checkbox";
        checkbox.setAttribute("checked", "checked"); // check all the boxes
        checkbox.classList.add("checkbox-attribute");
        checkbox.id = "attr-" + attribute;
        checkbox.addEventListener("change", function (event) {
            var checked = event.target.checked;
            Array.from(document.querySelectorAll("th[data-attribute=" + attribute + "], td[data-attribute=" + attribute + "]")).forEach(function (cell) { return cell.style.display = checked ? null : "none"; });
        });
        label.innerHTML = attribute;
        label.setAttribute("for", checkbox.id);
        container.appendChild(checkbox);
        container.appendChild(label);
        fieldset.appendChild(container);
    });
})();
/** Create table headers */
(function createTableHeaders() {
    var theadTr = document.querySelector("table thead tr");
    var editTh = document.createElement("th");
    document.getElementById("title").innerHTML = "" + modelList.modelName;
    document.getElementById("add-new").href = "/models/" + modelList.modelName + "/create";
    editTh.innerHTML = "Edit";
    theadTr.appendChild(editTh);
    // convert attributes to th
    modelList.getSortedAttributes().forEach(function (attr) {
        var arrowsContainer = document.createElement("div");
        var keys = Object.keys(attr);
        var downArrow = document.createElement("span");
        var nameSpan = document.createElement("span");
        var properties = attr[name];
        var th = document.createElement("th");
        var thContainer = document.createElement("div");
        var upArrow = document.createElement("span");
        var initialOrderById = null;
        upArrow.innerHTML = "▲";
        downArrow.innerHTML = "▼";
        upArrow.style.display = "none"; // invisible
        downArrow.style.display = "none"; // invisible
        arrowsContainer.classList.add("container");
        arrowsContainer.classList.add("container-arrows");
        arrowsContainer.appendChild(upArrow);
        arrowsContainer.appendChild(downArrow);
        th.dataset.attribute = keys[0];
        // when the user clicks a <th> (to sort)
        th.addEventListener("click", function (event) {
            var attributeName = th.dataset.attribute;
            var attributeProperties = attributes[attributeName];
            var tbody = document.querySelector("tbody");
            var trs = Array.from(tbody.querySelectorAll("table#table-list > tbody > tr"));
            if (!initialOrderById) {
                initialOrderById = trs.map(function (tr) { return JSON.parse(tr.dataset.value).id; });
            }
            // can be 'ascending', 'descending', or null. Null means not sorted;
            var targetSort = null; // the sort that the user is attempting
            if (upArrow.style.display === "none") {
                if (downArrow.style.display === "none") {
                    targetSort = "ascending";
                }
                else {
                    // downArrow.style.opacity == 1
                    targetSort = null;
                }
            }
            else {
                // upArrow.style.opacity == 1
                targetSort = "descending";
            }
            if (!targetSort) {
                // then they're trying to unsort the data
                upArrow.style.display = "none";
                downArrow.style.display = "none";
                initialOrderById.map(function (id) { return trs.filter(function (tr) { return JSON.parse(tr.dataset.value).id === id; })[0]; }) // convert ids to TRs
                    .forEach(function (tr) { return tbody.appendChild(tr); }); // append to table
            }
            else {
                // they're trying to sort the data
                // the sorted table rows
                var trsSorted = trs.sort(function (tr1, tr2) {
                    // tODO: Fix it so it can sort rows that have expanded collection attribute values
                    // tODO: Fix so it can sort model values
                    var winner = null;
                    var tr1Value = JSON.parse(tr1.dataset.value)[th.dataset.attribute];
                    var tr2Value = JSON.parse(tr2.dataset.value)[th.dataset.attribute];
                    var tr1ValIsEmpty = modelList.isEmpty(tr1Value);
                    var tr2ValIsEmpty = modelList.isEmpty(tr2Value);
                    // if one is undefined
                    if (tr1ValIsEmpty && !tr2ValIsEmpty)
                        return targetSort === "ascending" ? 1 : -1;
                    if (tr2ValIsEmpty && !tr1ValIsEmpty)
                        return targetSort === "ascending" ? -1 : 1;
                    if (tr1ValIsEmpty && tr2ValIsEmpty)
                        return;
                    // if the values are foreign models
                    if (attributeProperties.model) {
                        // convert the values to their foreign model's id
                        tr1Value = tr1Value.id;
                        tr2Value = tr2Value.id;
                    }
                    else if (attributeProperties.collection) {
                        // convert the values to just their lengths (since I'm sorting by length)
                        tr1Value = tr1Value.length;
                        tr2Value = tr2Value.length;
                    }
                    // number compare
                    if (typeof tr1Value === "number" && typeof tr2Value === "number") {
                        if (targetSort === "ascending")
                            winner = tr1Value - tr2Value;
                        if (targetSort === "descending")
                            winner = tr2Value - tr1Value;
                        // string compare (and foreign model compare)
                    }
                    else if (tr1Value.localeCompare && tr2Value.localeCompare) {
                        if (targetSort === "ascending")
                            winner = tr1Value.localeCompare(tr2Value);
                        if (targetSort === "descending")
                            winner = tr2Value.localeCompare(tr1Value);
                        // whatever compare
                    }
                    else {
                        if (targetSort === "ascending")
                            winner = tr1Value > tr2Value;
                        if (targetSort === "descending")
                            winner = tr2Value < tr1Value;
                    }
                    return winner;
                });
                // show the <tr>s sorted
                tbody.innerHTML = "";
                trsSorted.forEach(function (tr) {
                    tbody.appendChild(tr);
                });
                // toggle arrows
                upArrow.style.display = targetSort === "ascending" ? "initial" : "none";
                downArrow.style.display = targetSort === "ascending" ? "none" : "initial";
            }
        });
        nameSpan.innerHTML = keys[0];
        thContainer.appendChild(nameSpan);
        thContainer.appendChild(arrowsContainer);
        thContainer.classList.add("container");
        thContainer.classList.add("container-th");
        th.appendChild(thContainer);
        theadTr.appendChild(th);
    });
    var deleteTh = document.createElement("th");
    deleteTh.innerHTML = "Delete";
    theadTr.appendChild(deleteTh);
})();
/** Display the data */
modelList.getRecords().then(function (data) {
    data.forEach(function (item) {
        // for loop that run for each record in table
        var deleteTd = document.createElement("td");
        var deleteLink = document.createElement("a");
        var editTd = document.createElement("td");
        var editLink = document.createElement("a");
        var tr = document.createElement("tr");
        editLink.innerHTML = "Edit";
        editLink.href = "/models/" + modelList.modelName + "/" + item.id;
        editTd.appendChild(editLink);
        deleteLink.innerHTML = "Delete";
        deleteLink.href = "/models/" + modelList.modelName;
        deleteLink.onclick = function (event) {
            event.preventDefault();
            var warningMessage = "Are you sure you want to delete this item?\n\n" + JSON.stringify(item);
            if (confirm(warningMessage)) {
                modelList.deleteRecord(item).then(function (response) {
                    location.href = deleteLink.href;
                });
            }
        };
        deleteTd.appendChild(deleteLink);
        tr.appendChild(editTd);
        // for loop that runs for each attrubte of a record
        modelList.getSortedAttributes().forEach(function (attr) {
            var keys = Object.keys(attr);
            var attrName = keys[0];
            var attrProperties = attr[attrName];
            var value = item[attrName];
            var td = document.createElement("td");
            var name = modelList.getFriendlyValueName(value, attrProperties);
            td.dataset.attribute = keys[0];
            if (attrProperties === undefined) {
                // if the user forgets to add the name to a model, inform the user, then skip the rest of the code.
                console.log("Missing property '" + attrName + "' in model '" + modelList.modelName + "'");
                td.innerHTML = "";
                tr.appendChild(td);
                document.querySelector("table tbody").appendChild(tr);
                return;
            }
            // if the attribute is a foreign model, make it a link to that model.
            if (attrProperties.model) {
                if (value) {
                    var a = document.createElement("a");
                    a.innerHTML = "#" + value.id + " " + name;
                    a.href = "/models/" + attrProperties.model + "/" + value.id;
                    a.title = "#" + value.id; // hover
                    td.appendChild(a);
                }
                else {
                    td.title = "null";
                }
            }
            else {
                // if not a foreign key
                // if the current attribute is a collection (a 1-to-N relationship)
                if (attrProperties.collection) {
                    var container = document.createElement("div");
                    var details = document.createElement("details");
                    var summary = document.createElement("summary"); // the value (when collection has data)
                    var span = document.createElement("span"); // the value (when collection does not have data)
                    var expandedTable_1 = document.createElement("div");
                    container.classList.add("container");
                    container.classList.add("container-flex-center");
                    if (value.length > 0) {
                        summary.innerHTML = name;
                        summary.classList.add("value");
                        summary.style.flex = 90;
                        expandedTable_1.classList.add("collection-table");
                        value.forEach(function (val) {
                            var label = document.createElement("label");
                            var a = document.createElement("a");
                            var br = document.createElement("br");
                            a.innerHTML = "#" + val.id + " - " + val.name;
                            a.href = "/models/" + attrProperties.collection + "/" + val.id;
                            label.appendChild(a);
                            expandedTable_1.appendChild(label);
                            expandedTable_1.appendChild(br);
                        });
                        expandedTable_1.style.display = "block";
                        details.appendChild(summary);
                        details.appendChild(expandedTable_1);
                        summary.addEventListener("focus", function (event) {
                            document.querySelector("summary").blur();
                        });
                        td.appendChild(details);
                    }
                    else {
                        span.innerHTML = name;
                        span.classList.add("value");
                        span.style.flex = 90;
                        container.appendChild(span);
                        td.appendChild(container);
                    }
                }
                else {
                    td.innerHTML = name;
                }
            }
            tr.appendChild(td);
            document.querySelector("table tbody").appendChild(tr);
        });
        tr.dataset.value = JSON.stringify(item);
        tr.appendChild(deleteTd);
    });
    if (highlight) {
        var tr = Array.from(document.querySelectorAll("tbody tr")).find(function (tr) {
            if (!tr.dataset.value)
                return false;
            var id = JSON.parse(tr.dataset.value).id;
            return id === highlight;
        });
        tr.classList.add("highlighted");
    }
});
//# sourceMappingURL=list.js.map