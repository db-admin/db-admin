/**
 * A helper class for the list page
 *
 * @class ModelList
 */
class ModelHelper {
  public modelName: string;
  public attributes: any;

  /**
   * creates a ModelList helper object.
   *
   * @param {string} modelName The name of the model.
   * @param {Object} attributes The attributes of the model.
   */
  constructor(modelName: string, attributes: any) {
    this.modelName = modelName;
    this.attributes = attributes;
  }

  /**
   * Gets The data for the current model.
   * @return {promise} A promise to use to get the records.
   */
  public getRecords(): Promise<Response> {
    return fetch(`/${this.modelName}`).then(response => response.json());
  }

  /**
   * Sorts the attributes of the attributes object in a user friendly order.
   *
   * @returns {any[]} An array with the attributes sorted alphabetically.
   *
   * @memberOf ModelList
   */
  public getSortedAttributes(): any[] {
    const firstItems: string[] = ["id", "name"];
    const secondItems: string[] = ["createdAt", "updatedAt"];
    let sortedAttributesWithProperties: any[];
    let sortedAttributes: string[];

    // sort attributes in a user friendly order
    sortedAttributes = Object.keys(this.attributes) // get array of keys
      .filter( // take out pre-indexed items
      (item: string) => {
        return firstItems.indexOf(item) === -1 &&
          secondItems.indexOf(item) === -1;
      }).sort();

    // prepend first items and append last items
    sortedAttributes = firstItems.concat(sortedAttributes, secondItems);

    // convert the attributes back to their objects
    sortedAttributesWithProperties = sortedAttributes.map((attr: string) => {
      const thingToReturn: any = {};
      thingToReturn[attr] = this.attributes[attr];
      return thingToReturn;
    });

    return sortedAttributesWithProperties;
  }

  /**
   * Converts the value given to a user friendly string.
   *
   * @param {any} attributeValue The value of the attribute
   * @param {any} attributeProperties The properties of the attribute. This is used to determine the friendly name.
   * @returns {string} The friendly attribute name
   *
   * @memberOf ModelList
   */
  public getFriendlyValueName(attributeValue: any, attributeProperties: any): string {
    if (attributeValue === null || attributeValue === undefined) {
      return null;
    } else if (attributeProperties.collection) {
      return `${attributeValue.length} ${attributeProperties.collection}`;
    } else if (attributeProperties.model) {
      return attributeValue.name;
    } else if (["datetime"].indexOf(attributeProperties.type) !== -1) {
      const date: Date = new Date(attributeValue);
      return date.toUTCString();
    } else {
      return attributeValue;
    }
  }

  /**
   * Deletes A record from the database.
   *
   * @param {*} record The record to delete.
   * @returns {Promise<Response>} A promise for the delete event.
   *
   * @memberOf ModelList
   */
  public deleteRecord(record: any): Promise<Response> {
    return fetch(`/${modelHelper.modelName}/${record.id}`, {
      "method": "DELETE",
      "body": record
    });
  }

  /**
   * Checks whether is value is empty. By empty, what is meant is null,
   * undefined, empty string, or whitespace.
   *
   * @param {*} value The value to check if empty
   * @returns Whether the value is empty.
   *
   * @memberOf ModelList
   */
  public isEmpty(value: any): boolean {
    const emptyValues: any[] = [null, undefined, ""];
    if (typeof value === "string") {
      value = value.replace(" ", "");
    }

    return emptyValues.indexOf(value) !== -1;
  }

  /**
   * Given a list of table rows that represent the record in the current model's database, this will filter those table rows to only the
   * ones that satisfy the given query.
   *
   * @param {string} query The query string to use for filtering.
   * @param {HTMLTableRowElement[]} unfilteredTableRows The HTML table rows that need to be filtered.
   * @returns {HTMLTableRowElement[]} The filtered HTML table rows.
   *
   * @memberof ModelHelper
   */
  public filterTableRows(query: string, unfilteredTableRows: HTMLTableRowElement[]): HTMLTableRowElement[] {
    const filteredTableRows: HTMLTableRowElement[] = unfilteredTableRows.filter((tr: HTMLTableRowElement) => {
      if (!tr.dataset.value) { return false; }
      const value: any = JSON.parse(tr.dataset.value);
      const name: string = value.name.toLowerCase();
      return name.indexOf(query) !== -1;
    });
    return filteredTableRows;
  }
}
interface IModel {
  /**
   * The name of the model.
   *
   * @type {string}
   * @memberOf IModel
   */
  name: string;
  /**
   * The attributes of the model in JSON format.
   *
   * @type {*}
   * @memberOf IModel
   */
  attributes: any;
}

// the following declared variables were defined in /views/models/list.ejs
declare const currentModel: IModel;
declare const highlight: number;
const modelHelper: ModelHelper = new ModelHelper(currentModel.name, currentModel.attributes);

// when user submits search query
(function (): void {
  document.getElementById("form-search").addEventListener("submit", event => {
    event.preventDefault(); // prevents the page from reloading

    const query: string = (<HTMLInputElement>document.getElementById("search")).value.toLowerCase();
    const unfilteredTableRows: HTMLTableRowElement[] = <HTMLTableRowElement[]>Array.from(document.querySelectorAll("table tbody tr"));
    const filteredTableRows: HTMLTableRowElement[] = modelHelper.filterTableRows(query, unfilteredTableRows);

    // display the ones that pass the test
    unfilteredTableRows.forEach(tr => {
      if (filteredTableRows.indexOf(tr) !== -1) {
        tr.style.display = null; // visible
      } else {
        tr.style.display = "none"; // invisible
      }
    });
  });
})();

// when the user submits the sort attribute <form>
(function (): void {
  document.getElementById("form-sort-attributes").addEventListener("submit", event => {
    event.preventDefault(); // prevent the default action of the submit button (because by default, it wil refresh the page)
    const attribute: string = (<HTMLSelectElement>document.getElementById("select-sort-attributes")).value;
    const thForAttribute: HTMLTableHeaderCellElement =
      <HTMLTableHeaderCellElement>document.querySelector(`th[data-attribute=${attribute}]`);
    thForAttribute.click(); // because the TH has a click handler which sorts the rows alrady.
  });
})();

// implement keyboard shortcuts for page
(function (): void {
  document.querySelector("body").addEventListener("keyup", (event: KeyboardEvent) => {
    const isFocusedOnSearchField: boolean = document.getElementById("search") === document.activeElement;
    if (isFocusedOnSearchField) { return; } // because they're typing in the search field, not trying to run a keyboard shortcut.
    switch (event.key) {
      case "n":
        document.getElementById("add-new").click();
        break;
      case "/":
        document.getElementById("search").focus();
    }
  });
})();

// handles the control panel toggle button
(function (): void {
  document.getElementsByClassName("toggle-control-panel")[0].addEventListener("click", event => {
    const controlPanel: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("sidebar")[0];
    controlPanel.classList.toggle("minimized");
  });
})();

// this creates the sort options (in the control panel) that users can select in the control bar
(function (): void {
  const sortSelectElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById("select-sort-attributes");
  modelHelper.getSortedAttributes().forEach(attribute => {
    const attributeName: string = Object.keys(attribute)[0];
    const optionElement: HTMLOptionElement = document.createElement("option");
    optionElement.innerHTML = attributeName;
    sortSelectElement.appendChild(optionElement);
  });
})();

// creates the attribute's check boxes
(function (): void {
  const fieldSetElement: HTMLFieldSetElement = <HTMLFieldSetElement>document.getElementById("fieldset-attributes");
  const toggleAllCheckboxElement: HTMLInputElement = <HTMLInputElement>document.getElementById("toggle-attributes");

  // event handler for the toggle-all checkbox
  (function (): void {
    toggleAllCheckboxElement.addEventListener("change", (event: Event) => {
      const isChecked: boolean = (<HTMLInputElement>event.target).checked;
      const attributeCheckBoxes: HTMLInputElement[] = <HTMLInputElement[]>Array.from(document.getElementsByClassName("checkbox-attribute"));

      // check all the attributes to the value of the "toggle all" checkbox
      attributeCheckBoxes.forEach((checkbox: HTMLInputElement) => {
        return checkbox.checked !== isChecked ? checkbox.click() : null;
      });
    });
  })();


  // output checkboxes for each attribute
  (function (): void {
    modelHelper.getSortedAttributes().forEach(attribute => {
      attribute = Object.keys(attribute)[0];
      const container: HTMLDivElement = document.createElement("div");
      const checkbox: HTMLInputElement = document.createElement("input");
      const label: HTMLLabelElement = document.createElement("label");

      checkbox.type = "checkbox";
      checkbox.setAttribute("checked", "checked"); // check all the boxes
      checkbox.classList.add("checkbox-attribute");
      checkbox.id = `attr-${attribute}`;

      checkbox.addEventListener("change", event => {
        const checked: boolean = (<HTMLInputElement>event.target).checked;
        Array.from(
          document.querySelectorAll(`th[data-attribute=${attribute}], td[data-attribute=${attribute}]`)
        ).forEach((cell: HTMLTableCellElement) => cell.style.display = checked ? null : "none");
      });

      label.innerHTML = attribute;
      label.setAttribute("for", checkbox.id);

      container.appendChild(checkbox);
      container.appendChild(label);

      fieldSetElement.appendChild(container);
    });
  })();
})();

// create page header.
(function (): void {
  document.getElementById("title").innerHTML = `${modelHelper.modelName}`;
  (<HTMLAnchorElement>document.getElementById("add-new")).href = `/models/${modelHelper.modelName}/create`;
})();

// create table headers
(function (): void {
  const theadTr: HTMLTableRowElement = <HTMLTableRowElement>document.querySelector("table thead tr");
  const editTh: HTMLTableHeaderCellElement = document.createElement("th");

  // create edit column.
  editTh.innerHTML = "Edit";
  theadTr.appendChild(editTh);

  // create a table header element for each attribute.
  modelHelper.getSortedAttributes().forEach((attr: {}) => {
    const arrowsContainer: HTMLDivElement = document.createElement("div");
    const keys: string[] = Object.keys(attr);
    const downArrow: HTMLSpanElement = document.createElement("span");
    const nameSpan: HTMLSpanElement = document.createElement("span");
    // const properties = attr[name];
    const th: HTMLTableHeaderCellElement = document.createElement("th");
    const thContainer: HTMLDivElement = document.createElement("div");
    const upArrow: HTMLSpanElement = document.createElement("span");
    let initialOrderById: HTMLTableRowElement[];

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
    th.addEventListener("click", event => {
      const attributeName: string = th.dataset.attribute;
      const attributeProperties: any = currentModel.attributes[attributeName];
      const tbody: HTMLTableSectionElement = document.querySelector("tbody");
      const trs: HTMLTableRowElement[] = <HTMLTableRowElement[]>Array.from(tbody.querySelectorAll("table#table-list > tbody > tr"));

      if (!initialOrderById) {
        initialOrderById = trs.map(tr => JSON.parse(tr.dataset.value).id);
      }

      // can be 'ascending', 'descending', or null. Null means not sorted;
      let targetSort: string = null; // the sort that the user is attempting

      if (upArrow.style.display === "none") {
        if (downArrow.style.display === "none") {
          targetSort = "ascending";
        } else {
          // downArrow.style.opacity == 1
          targetSort = null;
        }
      } else {
        // upArrow.style.opacity == 1
        targetSort = "descending";
      }

      if (!targetSort) {
        // then they're trying to unsort the data

        upArrow.style.display = "none";
        downArrow.style.display = "none";

        initialOrderById.map(id => trs.filter(tr => JSON.parse(tr.dataset.value).id === id)[0]) // convert ids to TRs
          .forEach(tr => tbody.appendChild(tr)); // append to table

      } else {
        // they're trying to sort the data

        // the sorted table rows
        const trsSorted: HTMLTableRowElement[] = trs.sort((tr1: HTMLTableRowElement, tr2: HTMLTableRowElement) => {
          // tODO: Fix it so it can sort rows that have expanded collection attribute values
          // tODO: Fix so it can sort model values

          let winner: number = null;
          let tr1Value: any = JSON.parse(tr1.dataset.value)[th.dataset.attribute];
          let tr2Value: any = JSON.parse(tr2.dataset.value)[th.dataset.attribute];

          const tr1ValIsEmpty: any = modelHelper.isEmpty(tr1Value);
          const tr2ValIsEmpty: any = modelHelper.isEmpty(tr2Value);

          // if one is undefined
          if (tr1ValIsEmpty && !tr2ValIsEmpty) { return targetSort === "ascending" ? 1 : -1; }
          if (tr2ValIsEmpty && !tr1ValIsEmpty) { return targetSort === "ascending" ? -1 : 1; }
          if (tr1ValIsEmpty && tr2ValIsEmpty) { return; }

          // if the values are foreign models
          if (attributeProperties.model) {
            // convert the values to their foreign model's id
            tr1Value = tr1Value.id;
            tr2Value = tr2Value.id;
          } else if (attributeProperties.collection) {
            // convert the values to just their lengths (since I'm sorting by length)
            tr1Value = tr1Value.length;
            tr2Value = tr2Value.length;
          }

          // number compare
          if (typeof tr1Value === "number" && typeof tr2Value === "number") {
            if (targetSort === "ascending") { winner = tr1Value - tr2Value; }
            if (targetSort === "descending") { winner = tr2Value - tr1Value; }

            // string compare (and foreign model compare)
          } else if (tr1Value.localeCompare && tr2Value.localeCompare) {
            if (targetSort === "ascending") { winner = tr1Value.localeCompare(tr2Value); }
            if (targetSort === "descending") { winner = tr2Value.localeCompare(tr1Value); }

            // whatever compare
          } else {
            if (targetSort === "ascending") { winner = tr1Value - tr2Value; }
            if (targetSort === "descending") { winner = tr2Value - tr1Value; }
          }

          return winner;

        });

        // show the <tr>s sorted
        tbody.innerHTML = "";
        trsSorted.forEach(tr => {
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

  //  create delete column.
  const deleteTh: HTMLTableHeaderCellElement = document.createElement("th");
  deleteTh.innerHTML = "Delete";
  theadTr.appendChild(deleteTh);
})();

// display the data.
(function (): void {
  modelHelper.getRecords().then((data: any) => {
    data.forEach(item => {
      // for loop that run for each record in table
      const deleteTd: HTMLTableDataCellElement = document.createElement("td");
      const deleteLink: HTMLAnchorElement = document.createElement("a");
      const editTd: HTMLTableDataCellElement = document.createElement("td");
      const editLink: HTMLAnchorElement = document.createElement("a");
      const tr: HTMLTableRowElement = document.createElement("tr");

      editLink.innerHTML = "Edit";
      editLink.href = `/models/${modelHelper.modelName}/${item.id}`;
      editTd.appendChild(editLink);

      deleteLink.innerHTML = "Delete";
      deleteLink.href = `/models/${modelHelper.modelName}`;
      deleteLink.onclick = event => {
        event.preventDefault();
        const warningMessage: string = `Are you sure you want to delete this item?\n\n${JSON.stringify(item)}`;
        if (confirm(warningMessage)) {
          modelHelper.deleteRecord(item).then(response => {
            location.href = deleteLink.href;
          });
        }
      };
      deleteTd.appendChild(deleteLink);
      tr.appendChild(editTd);

      // for loop that runs for each attrubte of a record
      modelHelper.getSortedAttributes().forEach(attr => {
        const keys: string[] = Object.keys(attr);
        const attrName: string = keys[0];
        const attrProperties: any = attr[attrName];
        const value: any = item[attrName];
        const td: HTMLTableDataCellElement = document.createElement("td");
        let name: string = modelHelper.getFriendlyValueName(value, attrProperties);

        td.dataset.attribute = keys[0];

        if (attrProperties === undefined) {
          // if the user forgets to add the name to a model, inform the user, then skip the rest of the code.
          console.log("Missing property '" + attrName + "' in model '" + modelHelper.modelName + "'");
          td.innerHTML = "";
          tr.appendChild(td);
          document.querySelector("table tbody").appendChild(tr);
          return;
        }

        // if the attribute is a foreign model, make it a link to that model.
        if (attrProperties.model) {
          if (value) {
            const a: HTMLAnchorElement = document.createElement("a");
            a.innerHTML = `#${value.id} ${name}`;
            a.href = `/models/${attrProperties.model}/${value.id}`;
            a.title = `#${value.id}`; // hover
            td.appendChild(a);
          } else {
            td.title = "null";
          }
        } else {
          // if not a foreign key

          // if the current attribute is a collection (a 1-to-N relationship)
          if (attrProperties.collection) {
            const container: HTMLDivElement = document.createElement("div");
            const details: HTMLElement = document.createElement("details");
            const summary: HTMLElement = document.createElement("summary"); // the value (when collection has data)
            const span: HTMLSpanElement = document.createElement("span"); // the value (when collection does not have data)
            const expandedTable: HTMLDivElement = document.createElement("div");

            container.classList.add("container");
            container.classList.add("container-flex-center");

            if (value.length > 0) {
              summary.innerHTML = name;
              summary.classList.add("value");
              summary.style.flex = "90";

              expandedTable.classList.add("collection-table");

              value.forEach(val => {
                const label: HTMLLabelElement = document.createElement("label");
                const a: HTMLAnchorElement = document.createElement("a");
                const br: HTMLBRElement = document.createElement("br");

                a.innerHTML = `#${val.id} - ${val.name}`;
                a.href = `/models/${attrProperties.collection}/${val.id}`;

                label.appendChild(a);
                expandedTable.appendChild(label);
                expandedTable.appendChild(br);
              });
              expandedTable.style.display = "block";

              details.appendChild(summary);
              details.appendChild(expandedTable);

              summary.addEventListener("focus", event => {
                (<HTMLElement>document.querySelector("summary")).blur();
              });

              td.appendChild(details);
            } else {
              span.innerHTML = name;
              span.classList.add("value");
              span.style.flex = "90";

              container.appendChild(span);
              td.appendChild(container);
            }
          } else {
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
      const tr: HTMLTableRowElement = <HTMLTableRowElement>Array.from(document.querySelectorAll("tbody tr"))
        .find((tr: HTMLTableRowElement) => {
          if (!tr.dataset.value) { return false; }
          const id: number = JSON.parse(tr.dataset.value).id;
          return id === highlight;
        });
      tr.classList.add("highlighted");
    }
  });
})();
